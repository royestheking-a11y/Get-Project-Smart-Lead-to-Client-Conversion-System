import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const formSchema = z.object({
    name: z.string().min(1, 'Campaign name is required'),
    dailyLimit: z.coerce.number().min(1).max(200).default(50),
});

interface EditCampaignDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    campaign: {
        id: string;
        name: string;
        dailyLimit: number;
    } | null;
}

export function EditCampaignDialog({ open, onOpenChange, campaign }: EditCampaignDialogProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            dailyLimit: 50,
        },
    });

    // Update form when campaign changes
    useEffect(() => {
        if (campaign) {
            form.reset({
                name: campaign.name,
                dailyLimit: campaign.dailyLimit,
            });
        }
    }, [campaign, form]);

    const updateMutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            if (!campaign) throw new Error('No campaign selected');
            return api.campaigns.update(campaign.id, values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            toast({
                title: 'Campaign updated',
                description: 'Campaign settings saved successfully.',
            });
            onOpenChange(false);
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        updateMutation.mutate(values);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Campaign</DialogTitle>
                    <DialogDescription>
                        Update your campaign settings.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Campaign Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Q1 Sales Outreach" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dailyLimit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Daily Email Limit</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Maximum emails sent per day (1-200).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
