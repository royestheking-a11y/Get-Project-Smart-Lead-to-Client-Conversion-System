// Backend API client for Express.js backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Get auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Set auth token in localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

// Remove auth token
export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authApi = {
  register: async (name: string, email: string, password: string) => {
    const data = await apiRequest<{ token: string; user: { id: string; name: string; email: string } }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }
    );
    setAuthToken(data.token);
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await apiRequest<{ token: string; user: { id: string; name: string; email: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    setAuthToken(data.token);
    return data;
  },

  me: async () => {
    return apiRequest<{ id: string; name: string; email: string }>('/auth/me');
  },

  logout: () => {
    removeAuthToken();
  },

  updateProfile: async (data: { name?: string; signature?: any }) => {
    return apiRequest<{ id: string; name: string; email: string; signature: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Campaigns API
export const campaignsApi = {
  list: async () => {
    return apiRequest<any[]>('/campaigns');
  },

  get: async (id: string) => {
    return apiRequest<any>(`/campaigns/${id}`);
  },

  create: async (data: {
    name: string;
    dailyLimit?: number;
    sendingWindowStart?: string;
    sendingWindowEnd?: string;
    rateLimitMinSec?: number;
    rateLimitMaxSec?: number;
    followupsEnabled?: boolean;
  }) => {
    return apiRequest<any>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<any>) => {
    return apiRequest<any>(`/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  pause: async (id: string) => {
    return apiRequest<any>(`/campaigns/${id}/pause`, {
      method: 'POST',
    });
  },

  resume: async (id: string) => {
    return apiRequest<any>(`/campaigns/${id}/resume`, {
      method: 'POST',
    });
  },

  delete: async (id: string) => {
    return apiRequest<{ message: string }>(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  },
};

// Templates API
export const templatesApi = {
  list: async (campaignId?: string) => {
    const query = campaignId ? `?campaignId=${campaignId}` : '';
    return apiRequest<any[]>(`/templates${query}`);
  },

  get: async (id: string) => {
    return apiRequest<any>(`/templates/${id}`);
  },

  create: async (data: {
    campaignId: string;
    name: string;
    category: string;
    subjectTemplate: string;
    bodyTemplate: string;
  }) => {
    return apiRequest<any>('/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<any>) => {
    return apiRequest<any>(`/templates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest<{ message: string }>(`/templates/${id}`, {
      method: 'DELETE',
    });
  },
};

// Leads API
export const leadsApi = {
  import: async (file: File, campaignId: string, mapping: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('campaignId', campaignId);
    formData.append('mapping', JSON.stringify(mapping));

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/leads/import`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Import failed');
    }

    return response.json();
  },

  list: async (params: {
    campaignId: string;
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    return apiRequest<any>(`/leads?${queryParams.toString()}`);
  },

  update: async (id: string, data: Partial<any>) => {
    return apiRequest<any>(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  markReplied: async (id: string) => {
    return apiRequest<any>(`/leads/${id}/mark-replied`, {
      method: 'POST',
    });
  },

  doNotContact: async (id: string) => {
    return apiRequest<any>(`/leads/${id}/do-not-contact`, {
      method: 'POST',
    });
  },

  categorize: async (campaignId: string, limit?: number) => {
    return apiRequest<{ categorized: number }>('/leads/categorize', {
      method: 'POST',
      body: JSON.stringify({ campaignId, limit }),
    });
  },

  delete: async (id: string) => {
    return apiRequest<{ message: string }>(`/leads/${id}`, {
      method: 'DELETE',
    });
  },

  deleteBatch: async (leadIds: string[]) => {
    return apiRequest<{ message: string; deletedCount: number }>('/leads/delete-batch', {
      method: 'POST',
      body: JSON.stringify({ leadIds }),
    });
  },
};

// Send API
export const sendApi = {
  start: async (campaignId: string) => {
    return apiRequest<any>('/send/start', {
      method: 'POST',
      body: JSON.stringify({ campaignId }),
    });
  },

  stop: async (campaignId: string) => {
    return apiRequest<any>('/send/stop', {
      method: 'POST',
      body: JSON.stringify({ campaignId }),
    });
  },

  stats: async (campaignId: string) => {
    return apiRequest<any>(`/send/stats?campaignId=${campaignId}`);
  },
};

// Email Logs API
export const emailLogsApi = {
  list: async (params: {
    campaignId?: string;
    leadId?: string;
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    return apiRequest<any>(`/email-logs?${queryParams.toString()}`);
  },

  get: async (id: string) => {
    return apiRequest<any>(`/email-logs/${id}`);
  },
};
