// Re-export backend API for backward compatibility
export { campaignsApi as campaigns, templatesApi as templates, leadsApi as leads, sendApi as send } from './backend-api';
export { authApi as auth } from './backend-api';

// Legacy API wrapper for compatibility
import { campaignsApi } from './backend-api';

export const api = {
    campaigns: {
        list: async () => {
            return campaignsApi.list();
        },

        create: async (name: string, dailyLimit: number) => {
            return campaignsApi.create({ name, dailyLimit });
        },

        updateStatus: async (id: string, status: string) => {
            // Map status values if needed
            const statusMap: Record<string, string> = {
                'draft': 'paused',
                'active': 'active',
                'paused': 'paused'
            };
            const mappedStatus = statusMap[status] || status;

            if (mappedStatus === 'paused') {
                return campaignsApi.pause(id);
            } else if (mappedStatus === 'active') {
                return campaignsApi.resume(id);
            } else {
                return campaignsApi.update(id, { status: mappedStatus });
            }
        },

        update: async (id: string, data: any) => {
            return campaignsApi.update(id, data);
        },

        delete: async (id: string) => {
            return campaignsApi.delete(id);
        }
    }
};
