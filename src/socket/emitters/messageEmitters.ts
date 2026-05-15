import { socketManager } from '../socketManager';
import { ClientEvent } from '@/types';

export const messageEmitters = {
  markRead(chatId: string): void {
    socketManager.emit(ClientEvent.MARK_READ, { chatId });
  },

  reactMessage(chatId: string, messageId: string, emoji: string): void {
    socketManager.emit(ClientEvent.REACT_MESSAGE, { chatId, messageId, emoji });
  },
};
