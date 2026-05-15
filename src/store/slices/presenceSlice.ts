import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOCK_MODE } from '@/mocks/config';

interface PresenceState {
  onlineUsers: Record<string, boolean>;
  lastSeen: Record<string, string>;
}

const initialState: PresenceState = {
  onlineUsers: MOCK_MODE ? {
    'user-2': true,
    'user-3': false,
    'user-4': true,
    'user-5': false,
    'user-6': true,
  } : {},
  lastSeen: MOCK_MODE ? {
    'user-3': '2026-05-15T08:30:00.000Z',
    'user-5': '2026-05-14T22:15:00.000Z',
  } : {},
};

const presenceSlice = createSlice({
  name: 'presence',
  initialState,
  reducers: {
    setUserOnline(state, action: PayloadAction<{ userId: string; isOnline: boolean; lastSeen?: string | null }>) {
      const { userId, isOnline, lastSeen } = action.payload;
      state.onlineUsers[userId] = isOnline;
      if (lastSeen) {
        state.lastSeen[userId] = lastSeen;
      }
    },
    setBulkOnlineStatus(state, action: PayloadAction<Record<string, boolean>>) {
      state.onlineUsers = { ...state.onlineUsers, ...action.payload };
    },
    clearPresence(state) {
      state.onlineUsers = {};
      state.lastSeen = {};
    },
  },
});

export const { setUserOnline, setBulkOnlineStatus, clearPresence } = presenceSlice.actions;
export default presenceSlice.reducer;
