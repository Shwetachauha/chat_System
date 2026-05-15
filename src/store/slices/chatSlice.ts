import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from '@/types';
import { chatService } from '@/services/chatService';
import { MOCK_MODE } from '@/mocks/config';
import { mockChats } from '@/mocks/mockData';

interface ChatSliceState {
  chats: Chat[];
  activeChat: Chat | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatSliceState = {
  chats: MOCK_MODE ? mockChats : [],
  activeChat: null,
  isLoading: false,
  error: null,
};

export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      return await chatService.getChats();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch chats');
    }
  }
);

export const createPrivateChat = createAsyncThunk(
  'chat/createPrivate',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await chatService.createPrivateChat(userId);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Failed to create chat');
    }
  }
);

export const createGroupChat = createAsyncThunk(
  'chat/createGroup',
  async (data: { name: string; participantIds: string[] }, { rejectWithValue }) => {
    try {
      return await chatService.createGroupChat(data.name, data.participantIds);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Failed to create group');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat(state, action: PayloadAction<Chat | null>) {
      state.activeChat = action.payload;
    },
    updateLastMessage(state, action: PayloadAction<{ chatId: string; message: Chat['lastMessage'] }>) {
      const chat = state.chats.find((c) => c.id === action.payload.chatId);
      if (chat) {
        chat.lastMessage = action.payload.message;
        chat.updatedAt = new Date().toISOString();
      }
    },
    incrementUnread(state, action: PayloadAction<string>) {
      const chat = state.chats.find((c) => c.id === action.payload);
      if (chat) {
        chat.unreadCount += 1;
      }
    },
    resetUnread(state, action: PayloadAction<string>) {
      const chat = state.chats.find((c) => c.id === action.payload);
      if (chat) {
        chat.unreadCount = 0;
      }
    },
    addChat(state, action: PayloadAction<Chat>) {
      const exists = state.chats.find((c) => c.id === action.payload.id);
      if (!exists) {
        state.chats.unshift(action.payload);
      }
    },
    updateChatParticipants(state, action: PayloadAction<{ chatId: string; participants: Chat['participants'] }>) {
      const chat = state.chats.find((c) => c.id === action.payload.chatId);
      if (chat) {
        chat.participants = action.payload.participants;
      }
    },
    sortChats(state) {
      state.chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createPrivateChat.fulfilled, (state, action) => {
        const exists = state.chats.find((c) => c.id === action.payload.id);
        if (!exists) {
          state.chats.unshift(action.payload);
        }
        state.activeChat = action.payload;
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        state.chats.unshift(action.payload);
        state.activeChat = action.payload;
      });
  },
});

export const {
  setActiveChat,
  updateLastMessage,
  incrementUnread,
  resetUnread,
  addChat,
  updateChatParticipants,
  sortChats,
} = chatSlice.actions;
export default chatSlice.reducer;
