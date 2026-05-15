import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export const selectOnlineUsers = (state: RootState) => state.presence.onlineUsers;
export const selectLastSeen = (state: RootState) => state.presence.lastSeen;

export const selectIsUserOnline = (userId: string) => (state: RootState) =>
  state.presence.onlineUsers[userId] ?? false;

export const selectUserLastSeen = (userId: string) => (state: RootState) =>
  state.presence.lastSeen[userId] ?? null;

export const selectTypingUsersForChat = (chatId: string) =>
  createSelector(
    [(state: RootState) => state.typing.typingUsers[chatId]],
    (users) => users ?? []
  );
