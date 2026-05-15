import { socketManager } from '../socketManager';
import { ClientEvent } from '@/types';

export const presenceEmitters = {
  emitOnline(): void {
    socketManager.emit(ClientEvent.USER_ONLINE);
  },

  emitOffline(): void {
    socketManager.emit(ClientEvent.USER_OFFLINE);
  },
};
