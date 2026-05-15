import { socketManager } from '../socketManager';
import { ClientEvent } from '@/types';

export const groupEmitters = {
  createGroup(name: string, participantIds: string[]): void {
    socketManager.emit(ClientEvent.CREATE_GROUP, { name, participantIds });
  },

  addMember(chatId: string, userId: string): void {
    socketManager.emit(ClientEvent.ADD_GROUP_MEMBER, { chatId, userId });
  },

  removeMember(chatId: string, userId: string): void {
    socketManager.emit(ClientEvent.REMOVE_GROUP_MEMBER, { chatId, userId });
  },
};
