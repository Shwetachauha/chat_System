import { socketManager } from '../socketManager';
import { ClientEvent, SendMessagePayload } from '@/types';

export const messageEmitters = {
  sendMessage(payload: SendMessagePayload): void {
    socketManager.emit(ClientEvent.SEND_MESSAGE, {
      chatId: payload.chatId,
      content: payload.content,
      type: payload.type,
      tempId: payload.tempId,
      replyTo: payload.replyTo,
    });
  },

  deleteMessage(chatId: string, messageId: string): void {
    socketManager.emit(ClientEvent.DELETE_MESSAGE, { chatId, messageId });
  },

  editMessage(chatId: string, messageId: string, content: string): void {
    socketManager.emit(ClientEvent.EDIT_MESSAGE, { chatId, messageId, content });
  },

  markRead(chatId: string, messageId: string): void {
    socketManager.emit(ClientEvent.MARK_READ, { chatId, messageId });
  },
};
