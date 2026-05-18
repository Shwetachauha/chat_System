import { Socket } from 'socket.io-client';
import { store } from '@/store';
import { updateChat } from '@/store/slices/chatSlice';
import { ServerEvent } from '@/types/socket';
import { Chat } from '@/types';

export function registerGroupHandlers(socket: Socket): void {
  socket.on(ServerEvent.GROUP_UPDATED, (data: { chat: Chat }) => {
    console.log('[GroupHandler] group_updated received:', data.chat);
    store.dispatch(updateChat(data.chat));
  });
}
