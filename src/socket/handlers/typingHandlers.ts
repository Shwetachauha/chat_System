import { Socket } from 'socket.io-client';
import { store } from '@/store';
import { ServerEvent, TypingEvent, ReadReceiptEvent } from '@/types';
import { setUserTyping, removeUserTyping } from '@/store/slices/typingSlice';

export function registerTypingHandlers(socket: Socket): void {
  socket.on(ServerEvent.TYPING, (event: TypingEvent) => {
    const state = store.getState();
    // Only handle typing from other users
    if (event.userId !== state.auth.user?.id) {
      store.dispatch(setUserTyping({
        chatId: event.chatId,
        userId: event.userId,
      }));
    }
  });

  socket.on(ServerEvent.STOP_TYPING, (event: TypingEvent) => {
    store.dispatch(removeUserTyping({
      chatId: event.chatId,
      userId: event.userId,
    }));
  });

  socket.on(ServerEvent.READ_RECEIPT, (_event: ReadReceiptEvent) => {
    // Update read status in UI — mark messages as read by this user
    // The chatId tells which conversation, userId tells who read it
  });
}
