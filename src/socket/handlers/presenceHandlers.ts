import { Socket } from 'socket.io-client';
import { store } from '@/store';
import { ServerEvent, OnlineStatusEvent } from '@/types';
import { setUserOnline } from '@/store/slices/presenceSlice';

export function registerPresenceHandlers(socket: Socket): void {
  socket.on(ServerEvent.ONLINE_STATUS, (event: OnlineStatusEvent) => {
    store.dispatch(setUserOnline({
      userId: event.userId,
      isOnline: event.isOnline,
      lastSeen: event.lastSeen,
    }));
  });
}
