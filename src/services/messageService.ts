import api from './api';
import { Message, PaginationParams } from '@/types';

interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
  nextCursor: string | null;
}

interface SendMessageResponse {
  message: Message;
}

export const messageService = {
  async getMessages(params: PaginationParams): Promise<{ messages: Message[]; hasMore: boolean; cursor: string | null }> {
    const { chatId, cursor, limit = 50 } = params;
    const queryParams = new URLSearchParams({ limit: String(limit) });
    if (cursor) queryParams.append('cursor', cursor);

    const response = await api.get<MessagesResponse>(
      `/messages/${chatId}?${queryParams.toString()}`
    );
    return {
      messages: response.data.messages,
      hasMore: response.data.hasMore,
      cursor: response.data.nextCursor,
    };
  },

  async sendMessage(formData: FormData, onProgress?: (progress: number) => void): Promise<Message> {
    const response = await api.post<SendMessageResponse>('/messages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(pct);
        }
      },
    });
    return response.data.message;
  },

  async markRead(chatId: string): Promise<void> {
    await api.put(`/messages/read/${chatId}`);
  },

  async deleteMessage(messageId: string): Promise<void> {
    await api.delete(`/messages/${messageId}`);
  },
};
