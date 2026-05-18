import api from './api';
import { CallLog } from '@/types/callLog';

export const callService = {
  async getCallLogs(): Promise<CallLog[]> {
    const response = await api.get('/calls');
    const data = response.data;
    // Handle various response shapes
    if (Array.isArray(data)) return data;
    if (data?.callLogs && Array.isArray(data.callLogs)) return data.callLogs;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.calls && Array.isArray(data.calls)) return data.calls;
    return [];
  },

  async deleteCallLog(id: string): Promise<void> {
    await api.delete(`/calls/${id}`);
  },
};
