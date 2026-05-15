import { Socket } from 'socket.io-client';
import { store } from '@/store';
import { ServerEvent, Message, MessageAckEvent, MessageDeletedEvent, MessageUpdatedEvent } from '@/types';
import { addMessage, confirmMessage, deleteMessage, updateMessage } from '@/store/slices/messageSlice';
import { updateLastMessage, incrementUnread } from '@/store/slices/chatSlice';

export function registerMessageHandlers(socket: Socket): void {
  socket.on(ServerEvent.MESSAGE_RECEIVED, (message: Message) => {
    const state = store.getState();
    const activeChat = state.chat.activeChat;

    // Deduplicate: skip if already in store
    const chatMessages = state.messages.messagesByChatId[message.chatId];
    if (chatMessages?.entities[message.id]) return;

    store.dispatch(addMessage(message));

    // Update last message on chat list
    store.dispatch(updateLastMessage({
      chatId: message.chatId,
      message: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        createdAt: message.createdAt,
        type: message.type,
      },
    }));

    // Increment unread if not the active chat
    if (activeChat?.id !== message.chatId) {
      store.dispatch(incrementUnread(message.chatId));
    }
  });

  socket.on(ServerEvent.MESSAGE_SENT_ACK, (ack: MessageAckEvent) => {
    store.dispatch(confirmMessage({
      tempId: ack.tempId,
      message: ack.message,
    }));

    // Update last message
    store.dispatch(updateLastMessage({
      chatId: ack.message.chatId,
      message: {
        id: ack.message.id,
        content: ack.message.content,
        senderId: ack.message.senderId,
        createdAt: ack.message.createdAt,
        type: ack.message.type,
      },
    }));
  });

  socket.on(ServerEvent.MESSAGE_DELETED, (event: MessageDeletedEvent) => {
    store.dispatch(deleteMessage({
      chatId: event.chatId,
      messageId: event.messageId,
    }));
  });

  socket.on(ServerEvent.MESSAGE_UPDATED, (event: MessageUpdatedEvent) => {
    store.dispatch(updateMessage({
      chatId: event.chatId,
      message: event.message,
    }));
  });
}
