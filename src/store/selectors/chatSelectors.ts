import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export const selectChats = (state: RootState) => state.chat.chats;
export const selectActiveChat = (state: RootState) => state.chat.activeChat;
export const selectChatLoading = (state: RootState) => state.chat.isLoading;

export const selectSortedChats = createSelector([selectChats], (chats) =>
  [...chats].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
);

export const selectChatById = (chatId: string) =>
  createSelector([selectChats], (chats) => chats.find((c) => c.id === chatId));

export const selectTotalUnread = createSelector([selectChats], (chats) =>
  chats.reduce((total, chat) => total + chat.unreadCount, 0)
);
