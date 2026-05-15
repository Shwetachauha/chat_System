import { Socket } from 'socket.io-client';
import { store } from '@/store';
import { ServerEvent, TypingEvent, ReadReceiptEvent } from '@/types';
import { setUserTyping, removeUserTyping } from '@/store/slices/typingSlice';
import { updateReadReceipt } from '@/store/slices/messageSlice';

export function registerTypingHandlers(socket: Socket): void {
  socket.on(ServerEvent.TYPING, (event: TypingEvent) => {
    const state = store.getState();
    // Only handle typing from other users
    if (event.userId !== state.auth.user?.id) {
      store.dispatch(setUserTyping({
        chatId: event.chatId,
        userId: event.userId,
        username: event.username,
      }));
    }
  });

  socket.on(ServerEvent.STOP_TYPING, (event: TypingEvent) => {
    store.dispatch(removeUserTyping({
      chatId: event.chatId,
      userId: event.userId,
    }));
  });

  socket.on(ServerEvent.READ_RECEIPT, (event: ReadReceiptEvent) => {
    store.dispatch(updateReadReceipt({
      chatId: event.chatId,
      messageId: event.messageId,
      userId: event.userId,
      readAt: event.readAt,
    }));
  });
}
