import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TypingState {
  typingUsers: Record<string, { userId: string; username: string }[]>;
}

const initialState: TypingState = {
  typingUsers: {},
};

const typingSlice = createSlice({
  name: 'typing',
  initialState,
  reducers: {
    setUserTyping(state, action: PayloadAction<{ chatId: string; userId: string; username: string }>) {
      const { chatId, userId, username } = action.payload;
      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = [];
      }
      const exists = state.typingUsers[chatId].find((u) => u.userId === userId);
      if (!exists) {
        state.typingUsers[chatId].push({ userId, username });
      }
    },
    removeUserTyping(state, action: PayloadAction<{ chatId: string; userId: string }>) {
      const { chatId, userId } = action.payload;
      if (state.typingUsers[chatId]) {
        state.typingUsers[chatId] = state.typingUsers[chatId].filter((u) => u.userId !== userId);
      }
    },
    clearTypingForChat(state, action: PayloadAction<string>) {
      delete state.typingUsers[action.payload];
    },
  },
});

export const { setUserTyping, removeUserTyping, clearTypingForChat } = typingSlice.actions;
export default typingSlice.reducer;
