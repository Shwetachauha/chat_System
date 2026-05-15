import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Message, MessagesByChatId, PaginationParams } from '@/types';
import { messageService } from '@/services/messageService';
import { MOCK_MODE } from '@/mocks/config';
import { mockMessagesByChat } from '@/mocks/mockData';

interface MessageSliceState {
  messagesByChatId: MessagesByChatId;
  pendingMessages: Message[];
  failedMessages: Message[];
}

const initialState: MessageSliceState = {
  messagesByChatId: {},
  pendingMessages: [],
  failedMessages: [],
};

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (params: PaginationParams, { rejectWithValue }) => {
    if (MOCK_MODE) {
      const messages = mockMessagesByChat[params.chatId] || [];
      return { chatId: params.chatId, messages, hasMore: false, cursor: null };
    }
    try {
      const response = await messageService.getMessages(params);
      return { chatId: params.chatId, ...response };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      const { chatId, id } = action.payload;
      if (!state.messagesByChatId[chatId]) {
        state.messagesByChatId[chatId] = {
          ids: [],
          entities: {},
          hasMore: true,
          cursor: null,
          isLoading: false,
        };
      }
      const chatMessages = state.messagesByChatId[chatId];
      // Deduplicate
      if (!chatMessages.entities[id]) {
        chatMessages.ids.push(id);
        chatMessages.entities[id] = action.payload;
      }
    },
    addPendingMessage(state, action: PayloadAction<Message>) {
      const msg = action.payload;
      state.pendingMessages.push(msg);
      // Also add to chat messages for optimistic display
      if (!state.messagesByChatId[msg.chatId]) {
        state.messagesByChatId[msg.chatId] = {
          ids: [],
          entities: {},
          hasMore: true,
          cursor: null,
          isLoading: false,
        };
      }
      const chatMessages = state.messagesByChatId[msg.chatId];
      chatMessages.ids.push(msg.id);
      chatMessages.entities[msg.id] = msg;
    },
    confirmMessage(state, action: PayloadAction<{ tempId: string; message: Message }>) {
      const { tempId, message } = action.payload;
      const chatMessages = state.messagesByChatId[message.chatId];
      if (chatMessages) {
        // Remove temp message
        const tempIndex = chatMessages.ids.indexOf(tempId);
        if (tempIndex !== -1) {
          chatMessages.ids.splice(tempIndex, 1);
          delete chatMessages.entities[tempId];
        }
        // Add confirmed message
        if (!chatMessages.entities[message.id]) {
          chatMessages.ids.push(message.id);
          chatMessages.entities[message.id] = message;
        }
      }
      // Remove from pending
      state.pendingMessages = state.pendingMessages.filter((m) => m.id !== tempId);
    },
    markMessageFailed(state, action: PayloadAction<string>) {
      const tempId = action.payload;
      const pending = state.pendingMessages.find((m) => m.id === tempId);
      if (pending) {
        pending.status = 'failed';
        state.failedMessages.push(pending);
        state.pendingMessages = state.pendingMessages.filter((m) => m.id !== tempId);
        // Update in chat
        for (const chatId in state.messagesByChatId) {
          const entity = state.messagesByChatId[chatId].entities[tempId];
          if (entity) {
            entity.status = 'failed';
          }
        }
      }
    },
    retryMessage(state, action: PayloadAction<string>) {
      const tempId = action.payload;
      const failed = state.failedMessages.find((m) => m.id === tempId);
      if (failed) {
        failed.status = 'sending';
        state.pendingMessages.push(failed);
        state.failedMessages = state.failedMessages.filter((m) => m.id !== tempId);
        // Update in chat
        for (const chatId in state.messagesByChatId) {
          const entity = state.messagesByChatId[chatId].entities[tempId];
          if (entity) {
            entity.status = 'sending';
          }
        }
      }
    },
    updateMessageStatus(state, action: PayloadAction<{ chatId: string; messageId: string; status: Message['status'] }>) {
      const { chatId, messageId, status } = action.payload;
      const chatMessages = state.messagesByChatId[chatId];
      if (chatMessages?.entities[messageId]) {
        chatMessages.entities[messageId].status = status;
      }
    },
    updateReadReceipt(state, action: PayloadAction<{ chatId: string; messageId: string; userId: string; readAt: string }>) {
      const { chatId, messageId, userId, readAt } = action.payload;
      const chatMessages = state.messagesByChatId[chatId];
      if (chatMessages?.entities[messageId]) {
        const msg = chatMessages.entities[messageId];
        const existingReceipt = msg.readBy.find((r) => r.userId === userId);
        if (!existingReceipt) {
          msg.readBy.push({ userId, readAt });
        }
        msg.status = 'seen';
      }
    },
    deleteMessage(state, action: PayloadAction<{ chatId: string; messageId: string }>) {
      const { chatId, messageId } = action.payload;
      const chatMessages = state.messagesByChatId[chatId];
      if (chatMessages?.entities[messageId]) {
        chatMessages.entities[messageId].isDeleted = true;
        chatMessages.entities[messageId].content = 'This message was deleted';
      }
    },
    updateMessage(state, action: PayloadAction<{ chatId: string; message: Message }>) {
      const { chatId, message } = action.payload;
      const chatMessages = state.messagesByChatId[chatId];
      if (chatMessages?.entities[message.id]) {
        chatMessages.entities[message.id] = message;
      }
    },
    editMessageContent(state, action: PayloadAction<{ chatId: string; messageId: string; content: string }>) {
      const { chatId, messageId, content } = action.payload;
      const chatMessages = state.messagesByChatId[chatId];
      if (chatMessages?.entities[messageId]) {
        chatMessages.entities[messageId].content = content;
        chatMessages.entities[messageId].isEdited = true;
        chatMessages.entities[messageId].updatedAt = new Date().toISOString();
      }
    },
    addReaction(state, action: PayloadAction<{ chatId: string; messageId: string; emoji: string; userId: string; username: string }>) {
      const { chatId, messageId, emoji, userId, username } = action.payload;
      const chatMessages = state.messagesByChatId[chatId];
      if (chatMessages?.entities[messageId]) {
        const msg = chatMessages.entities[messageId];
        const existing = msg.reactions.find((r) => r.emoji === emoji && r.userId === userId);
        if (!existing) {
          msg.reactions.push({ emoji, userId, username });
        }
      }
    },
    removeReaction(state, action: PayloadAction<{ chatId: string; messageId: string; emoji: string; userId: string }>) {
      const { chatId, messageId, emoji, userId } = action.payload;
      const chatMessages = state.messagesByChatId[chatId];
      if (chatMessages?.entities[messageId]) {
        const msg = chatMessages.entities[messageId];
        msg.reactions = msg.reactions.filter((r) => !(r.emoji === emoji && r.userId === userId));
      }
    },
    clearChatMessages(state, action: PayloadAction<string>) {
      delete state.messagesByChatId[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state, action) => {
        const chatId = action.meta.arg.chatId;
        if (!state.messagesByChatId[chatId]) {
          state.messagesByChatId[chatId] = {
            ids: [],
            entities: {},
            hasMore: true,
            cursor: null,
            isLoading: true,
          };
        } else {
          state.messagesByChatId[chatId].isLoading = true;
        }
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { chatId, messages, hasMore, cursor } = action.payload;
        const chatMessages = state.messagesByChatId[chatId];
        chatMessages.isLoading = false;
        chatMessages.hasMore = hasMore;
        chatMessages.cursor = cursor;
        // Prepend older messages (they come newest first from API)
        const newMessages = messages.reverse();
        for (const msg of newMessages) {
          if (!chatMessages.entities[msg.id]) {
            chatMessages.ids.unshift(msg.id);
            chatMessages.entities[msg.id] = msg;
          }
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        const chatId = action.meta.arg.chatId;
        if (state.messagesByChatId[chatId]) {
          state.messagesByChatId[chatId].isLoading = false;
        }
      });
  },
});

export const {
  addMessage,
  addPendingMessage,
  confirmMessage,
  markMessageFailed,
  retryMessage,
  updateMessageStatus,
  updateReadReceipt,
  deleteMessage,
  updateMessage,
  editMessageContent,
  addReaction,
  removeReaction,
  clearChatMessages,
} = messageSlice.actions;
export default messageSlice.reducer;
