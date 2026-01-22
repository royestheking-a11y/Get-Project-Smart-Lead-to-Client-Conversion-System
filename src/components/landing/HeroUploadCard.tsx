import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, FileSpreadsheet, Check, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';

type UploadState = 'idle' | 'selected' | 'processing' | 'success';

const HeroUploadCard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [dailyLimit, setDailyLimit] = useState('40');
  const [autoCategories, setAutoCategories] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx'))) {
      setFile(droppedFile);
      setUploadState('selected');
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadState('selected');
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadState('idle');
    setProgress(0);
  };

  const handleUpload = () => {
    setUploadState('processing');
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('success');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Card className="w-full max-w-2xl min-h-[500px] border-2 shadow-2xl shadow-primary/10 bg-card/95 backdrop-blur-sm flex flex-col justify-center">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          {t('upload.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {uploadState === 'idle' && (
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer ${isDragging
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5'
                }`}
            >
              <div className={`mb-4 rounded-full p-4 transition-colors ${isDragging ? 'bg-primary/20' : 'bg-primary/10'}`}>
                <Upload className={`h-8 w-8 transition-colors ${isDragging ? 'text-primary' : 'text-primary/80'}`} />
              </div>
              <p className="mb-2 text-center font-medium text-foreground">
                {t('upload.dragDrop')}
              </p>
              <p className="mb-4 text-center text-sm text-muted-foreground">{t('upload.or')}</p>
              <label htmlFor="file-upload">
                <Button variant="outline" asChild className="cursor-pointer">
                  <span>{t('upload.browseFile')}</span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {t('upload.maxSize')}
            </p>
          </div>
        )}

        {uploadState === 'selected' && file && (
          <div className="space-y-5 animate-fade-in">
            {/* File Preview */}
            <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile} className="shrink-0 hover:bg-destructive/10 hover:text-destructive">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('upload.dailyLimit')}</label>
                <Select value={dailyLimit} onValueChange={setDailyLimit}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 {t('upload.emailsPerDay')}</SelectItem>
                    <SelectItem value="40">40 {t('upload.emailsPerDay')}</SelectItem>
                    <SelectItem value="60">60 {t('upload.emailsPerDay')}</SelectItem>
                    <SelectItem value="70">70 {t('upload.emailsPerDay')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Checkbox
                  id="auto-categorize"
                  checked={autoCategories}
                  onCheckedChange={(checked) => setAutoCategories(checked as boolean)}
                />
                <label htmlFor="auto-categorize" className="text-sm font-medium text-foreground cursor-pointer">
                  {t('upload.autoCategories')}
                </label>
              </div>
            </div>

            <Button onClick={handleUpload} className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25">
              <Upload className="mr-2 h-5 w-5" />
              {t('upload.uploadProcess')}
            </Button>
          </div>
        )}

        {uploadState === 'processing' && (
          <div className="space-y-6 py-8 text-center animate-fade-in">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
              <div className="relative flex items-center justify-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground text-lg">{t('upload.processing')}</p>
              <p className="text-sm text-muted-foreground">
                {t('upload.cleaning')}
              </p>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">{progress}{t('upload.complete')}</p>
            </div>
          </div>
        )}

        {uploadState === 'success' && (
          <div className="space-y-6 py-6 text-center animate-fade-in">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-foreground">{t('upload.success')}</p>
              <p className="text-sm text-muted-foreground">
                {t('upload.successDesc')}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-xs text-muted-foreground">{t('upload.total')}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-2xl font-bold text-primary">148</p>
                <p className="text-xs text-muted-foreground">{t('upload.imported')}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">{t('upload.skipped')}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/login')}
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25 group"
            >
              {t('upload.goToDashboard')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeroUploadCard;
