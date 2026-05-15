import { socketManager } from '../socketManager';
import { ClientEvent } from '@/types';

export const typingEmitters = {
  startTyping(chatId: string): void {
    socketManager.emit(ClientEvent.TYPING, chatId);
  },

  stopTyping(chatId: string): void {
    socketManager.emit(ClientEvent.STOP_TYPING, chatId);
  },
};
