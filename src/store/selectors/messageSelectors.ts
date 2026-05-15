import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export const selectMessagesByChatId = (chatId: string) =>
  createSelector(
    [(state: RootState) => state.messages.messagesByChatId[chatId]],
    (chatMessages) => {
      if (!chatMessages) return [];
      return chatMessages.ids.map((id) => chatMessages.entities[id]).filter(Boolean);
    }
  );

export const selectMessagesLoading = (chatId: string) => (state: RootState) =>
  state.messages.messagesByChatId[chatId]?.isLoading ?? false;

export const selectHasMoreMessages = (chatId: string) => (state: RootState) =>
  state.messages.messagesByChatId[chatId]?.hasMore ?? true;

export const selectMessageCursor = (chatId: string) => (state: RootState) =>
  state.messages.messagesByChatId[chatId]?.cursor ?? null;

export const selectPendingMessages = (state: RootState) => state.messages.pendingMessages;
export const selectFailedMessages = (state: RootState) => state.messages.failedMessages;

export const selectMessageById = (chatId: string, messageId?: string) => (state: RootState) => {
  if (!messageId) return undefined;
  return state.messages.messagesByChatId[chatId]?.entities[messageId];
};
