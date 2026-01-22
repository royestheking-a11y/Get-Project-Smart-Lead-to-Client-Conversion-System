import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, X, CheckCircle, Trash2, Eye, Calendar, Users, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { leadsApi, campaignsApi, sendApi } from '@/lib/backend-api';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { read, utils } from 'xlsx';
import { RecentActivityTable } from '@/components/dashboard/RecentActivityTable';

interface UploadedFile {
  name: string;
  size: number;
  file: File;
  columns?: string[];
}

export default function ImportLeads() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'mapping' | 'processing' | 'categorizing' | 'complete'>('idle');
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [importResult, setImportResult] = useState<any>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');

  // Get campaigns
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignsApi.list,
  });

  // Set newest campaign as default
  useEffect(() => {
    if (campaigns && campaigns.length > 0 && !selectedCampaignId) {
      // Sort by creation date descending (newest first)
      const sortedCampaigns = [...campaigns].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      setSelectedCampaignId(sortedCampaigns[0]._id || sortedCampaigns[0].id);
    }
  }, [campaigns, selectedCampaignId]);

  // Get stats
  const { data: stats } = useQuery({
    queryKey: ['stats', selectedCampaignId],
    queryFn: () => sendApi.stats(selectedCampaignId),
    enabled: !!selectedCampaignId,
  });

  const parseFileColumns = async (file: File): Promise<string[]> => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    try {
      if (fileExtension === 'csv') {
        const text = await file.text();
        const firstLine = text.split('\n')[0];
        return firstLine.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
      } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = read(arrayBuffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
        if (jsonData.length > 0) {
          return (jsonData[0] as string[]).map(col => String(col).trim());
        }
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      toast({
        title: 'Error reading file',
        description: 'Could not read columns from file. Please check the format.',
        variant: 'destructive',
      });
    }
    return [];
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const columns = await parseFileColumns(droppedFile);
      setFile({ name: droppedFile.name, size: droppedFile.size, file: droppedFile, columns });
      setImportStatus('mapping');
      // Auto-map common column names
      const autoMapping: Record<string, string> = {};
      columns.forEach((col) => {
        const colLower = col.toLowerCase();
        if (colLower.includes('email')) autoMapping['emailColumn'] = col;
        if (colLower.includes('company') || colLower.includes('name')) autoMapping['company_nameColumn'] = col;
        if (colLower.includes('website') || colLower.includes('url')) autoMapping['websiteColumn'] = col;
        if (colLower.includes('location') || colLower.includes('city')) autoMapping['locationColumn'] = col;
        if (colLower.includes('industry')) autoMapping['industryColumn'] = col;
      });
      setColumnMapping(autoMapping);
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const columns = await parseFileColumns(selectedFile);
      setFile({ name: selectedFile.name, size: selectedFile.size, file: selectedFile, columns });
      setImportStatus('mapping');
      // Auto-map common column names
      const autoMapping: Record<string, string> = {};
      columns.forEach((col) => {
        const colLower = col.toLowerCase();
        if (colLower.includes('email')) autoMapping['emailColumn'] = col;
        if (colLower.includes('company') || colLower.includes('name')) autoMapping['company_nameColumn'] = col;
        if (colLower.includes('website') || colLower.includes('url')) autoMapping['websiteColumn'] = col;
        if (colLower.includes('location') || colLower.includes('city')) autoMapping['locationColumn'] = col;
        if (colLower.includes('industry')) autoMapping['industryColumn'] = col;
      });
      setColumnMapping(autoMapping);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!file?.file || !selectedCampaignId) {
        throw new Error('File and campaign are required');
      }
      const result = await leadsApi.import(file.file, selectedCampaignId, columnMapping);
      return result;
    },
    onSuccess: async (result) => {
      setImportResult(result);

      // Auto-start categorization
      if (result.importedCount > 0) {
        setImportStatus('categorizing');
        try {
          await leadsApi.categorize(selectedCampaignId);
          toast({
            title: 'Analysis Complete',
            description: `Categorized ${result.importedCount} leads`,
          });
        } catch (error) {
          console.error('Categorization failed:', error);
          toast({
            title: 'Categorization Warning',
            description: 'Imported leads but failed to categorize some. You can retry in the Leads view.',
            variant: 'destructive',
          });
        }
      }

      setImportStatus('complete');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({
        title: 'Import Successful',
        description: `Successfully processed ${result.importedCount} leads`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Import failed',
        description: error.message,
        variant: 'destructive',
      });
      setImportStatus('mapping');
    },
  });

  const handleImport = () => {
    if (!selectedCampaignId) {
      toast({
        title: 'Campaign required',
        description: 'Please select a campaign',
        variant: 'destructive',
      });
      return;
    }
    if (!columnMapping.emailColumn) {
      toast({
        title: 'Email column required',
        description: 'Please map the email column',
        variant: 'destructive',
      });
      return;
    }
    setImportStatus('processing');
    importMutation.mutate();
  };

  // Import history can be tracked via leads API if needed



  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Import Leads</h1>
        <p className="text-muted-foreground mt-1">Upload your leads from CSV or Excel files</p>
      </div>

      {/* Campaign Selection - Prominent at top */}
      <div className="card-elevated p-6 border-2 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Select Campaign</h3>
            <p className="text-sm text-muted-foreground">Choose which campaign to import leads into</p>
          </div>
        </div>
        <select
          value={selectedCampaignId}
          onChange={(e) => setSelectedCampaignId(e.target.value)}
          className="w-full h-12 rounded-lg border-2 border-input bg-background px-4 text-base font-medium focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select campaign...</option>
          {campaigns?.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          }).map((campaign) => (
            <option key={campaign._id || campaign.id} value={campaign._id || campaign.id}>
              {campaign.name} {campaign.createdAt && `(Created ${new Date(campaign.createdAt).toLocaleDateString()})`}
            </option>
          ))}
        </select>
        {selectedCampaignId && (
          <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-primary font-medium">✓ Leads will be imported to: {campaigns?.find(c => (c._id || c.id) === selectedCampaignId)?.name}</p>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* File Upload Card */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload New File
          </h3>

          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                'border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer',
                isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-1">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <Button variant="outline" asChild>
                  <span>Browse Files</span>
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: CSV, XLSX • Max 20MB
                </p>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFile(null);
                    setImportStatus('idle');
                    setColumnMapping({});
                    setImportResult(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {importStatus === 'mapping' && file && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Select Campaign</label>
                    <select
                      value={selectedCampaignId}
                      onChange={(e) => setSelectedCampaignId(e.target.value)}
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Select campaign...</option>
                      {campaigns?.map((campaign) => (
                        <option key={campaign._id || campaign.id} value={campaign._id || campaign.id}>
                          {campaign.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Match the columns from your uploaded file to the required system fields below.
                  </p>

                  <div className="grid gap-3">
                    {[
                      { key: 'company_nameColumn', label: 'Company Name' },
                      { key: 'emailColumn', label: 'Email Address *' },
                      { key: 'websiteColumn', label: 'Website URL' },
                      { key: 'locationColumn', label: 'Location' },
                      { key: 'industryColumn', label: 'Industry' },
                    ].map((field) => (
                      <div key={field.key} className="flex items-center gap-4">
                        <label className="w-32 text-sm font-medium text-foreground">{field.label}</label>
                        <select
                          value={columnMapping[field.key] || ''}
                          onChange={(e) => setColumnMapping({ ...columnMapping, [field.key]: e.target.value })}
                          className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm"
                        >
                          <option value="">Select column from file...</option>
                          {file.columns?.map((col) => (
                            <option key={col} value={col}>{col}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleImport}
                    className="w-full"
                    disabled={!selectedCampaignId || !columnMapping.emailColumn}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Mapping & Import
                  </Button>
                </div>
              )}

              {importStatus === 'processing' && (
                <div className="p-6 rounded-lg bg-muted/50 text-center animate-fade-in">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="font-medium text-foreground">Processing file...</p>
                  <p className="text-sm text-muted-foreground">Cleaning emails, removing duplicates...</p>
                </div>
              )}

              {importStatus === 'categorizing' && (
                <div className="p-6 rounded-lg bg-muted/50 text-center animate-fade-in">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="font-medium text-foreground">Analyzing Leads...</p>
                  <p className="text-sm text-muted-foreground">Checking websites, identifying value props, and assigning categories.</p>
                  <p className="text-xs text-muted-foreground mt-2">This may take a minute...</p>
                </div>
              )}

              {importStatus === 'complete' && importResult && (
                <div className="p-6 rounded-lg bg-primary/5 border border-primary/20 animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Import & Analysis Complete!</h4>
                      <p className="text-sm text-muted-foreground">Your leads have been imported, cleaned, and categorized. They are now <strong>READY</strong> for sending.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-background text-center">
                      <p className="text-xl font-bold text-foreground">{importResult.totalRows || 0}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/10 text-center">
                      <p className="text-xl font-bold text-primary">{importResult.importedCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Imported</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background text-center">
                      <p className="text-xl font-bold text-foreground">
                        {(importResult.invalidCount || 0) + (importResult.duplicateCount || 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Skipped</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-background border border-border mb-4">
                    <h5 className="font-medium text-sm mb-2">Next Steps:</h5>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                      <li>Go to <strong>Campaigns</strong> and ensure your campaign is active.</li>
                      <li>Click <strong>Start Sending</strong> to begin the outreach.</li>
                      <li>The system will automatically pick the best template for each lead category.</li>
                    </ol>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link to="/leads">View Categorized Leads</Link>
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setFile(null);
                      setImportStatus('idle');
                      setImportResult(null);
                      setColumnMapping({});
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}>
                      Import More
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Campaign Stats */}
        <div className="space-y-6">
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold mb-4">Campaign Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total Leads</span>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {stats ? stats.leadsImported : 0}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm text-muted-foreground">Ready to Send</span>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {stats ? stats.readyCount : 0}
                </p>
              </div>
            </div>
            {!selectedCampaignId && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Select a campaign to view stats
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Import Summary footer */}
      {campaigns && campaigns.length > 0 && (
        <RecentActivityTable />
      )}
    </div>
  );
}
