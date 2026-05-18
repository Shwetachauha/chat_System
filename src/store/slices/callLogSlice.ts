import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CallLog } from '@/types/callLog';
import { callService } from '@/services/callService';

interface CallLogState {
  logs: CallLog[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CallLogState = {
  logs: [],
  isLoading: false,
  error: null,
};

export const fetchCallLogs = createAsyncThunk('callLogs/fetch', async () => {
  const response = await callService.getCallLogs();
  return response;
});

export const deleteCallLog = createAsyncThunk('callLogs/delete', async (id: string) => {
  await callService.deleteCallLog(id);
  return id;
});

const callLogSlice = createSlice({
  name: 'callLogs',
  initialState,
  reducers: {
    prependCallLog(state, action: PayloadAction<CallLog>) {
      if (!Array.isArray(state.logs)) state.logs = [];
      // Avoid duplicates
      if (!state.logs.find((l) => l.id === action.payload.id)) {
        state.logs.unshift(action.payload);
      }
    },
    updateCallLog(state, action: PayloadAction<CallLog>) {
      if (!Array.isArray(state.logs)) state.logs = [];
      const index = state.logs.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) {
        state.logs[index] = action.payload;
      } else {
        state.logs.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCallLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCallLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logs = action.payload;
      })
      .addCase(fetchCallLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch call logs';
      })
      .addCase(deleteCallLog.fulfilled, (state, action) => {
        state.logs = state.logs.filter((l) => l.id !== action.payload);
      });
  },
});

export const { prependCallLog, updateCallLog } = callLogSlice.actions;
export default callLogSlice.reducer;
