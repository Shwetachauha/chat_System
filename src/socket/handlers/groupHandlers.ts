import { Socket } from 'socket.io-client';
import { store } from '@/store';
import { ServerEvent, Chat } from '@/types';
import { addChat, updateChatParticipants } from '@/store/slices/chatSlice';

export function registerGroupHandlers(socket: Socket): void {
  socket.on(ServerEvent.CHAT_CREATED, (chat: Chat) => {
    store.dispatch(addChat(chat));
  });

  socket.on(ServerEvent.USER_JOINED_GROUP, (data: { chatId: string; participants: Chat['participants'] }) => {
    store.dispatch(updateChatParticipants({
      chatId: data.chatId,
      participants: data.participants,
    }));
  });

  socket.on(ServerEvent.USER_REMOVED_GROUP, (data: { chatId: string; participants: Chat['participants'] }) => {
    store.dispatch(updateChatParticipants({
      chatId: data.chatId,
      participants: data.participants,
    }));
  });
}
