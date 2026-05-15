import api from './api';
import { Message, PaginationParams } from '@/types';

interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
  cursor: string | null;
}

export const messageService = {
  async getMessages(params: PaginationParams): Promise<MessagesResponse> {
    const { chatId, cursor, limit = 50 } = params;
    const queryParams = new URLSearchParams({ limit: String(limit) });
    if (cursor) queryParams.append('cursor', cursor);

    const response = await api.get<MessagesResponse>(
      `/chats/${chatId}/messages?${queryParams.toString()}`
    );
    return response.data;
  },

  async sendMessage(chatId: string, formData: FormData): Promise<Message> {
    const response = await api.post<Message>(`/chats/${chatId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteMessage(chatId: string, messageId: string): Promise<void> {
    await api.delete(`/chats/${chatId}/messages/${messageId}`);
  },

  async editMessage(chatId: string, messageId: string, content: string): Promise<Message> {
    const response = await api.patch<Message>(`/chats/${chatId}/messages/${messageId}`, { content });
    return response.data;
  },
};
