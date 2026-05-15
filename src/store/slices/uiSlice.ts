import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface UiState {
  sidebarOpen: boolean;
  isMobile: boolean;
  toasts: Toast[];
  isConnected: boolean;
  isReconnecting: boolean;
  createGroupDialogOpen: boolean;
}

const initialState: UiState = {
  sidebarOpen: true,
  isMobile: false,
  toasts: [],
  isConnected: false,
  isReconnecting: false,
  createGroupDialogOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setIsMobile(state, action: PayloadAction<boolean>) {
      state.isMobile = action.payload;
    },
    addToast(state, action: PayloadAction<Toast>) {
      state.toasts.push(action.payload);
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setReconnecting(state, action: PayloadAction<boolean>) {
      state.isReconnecting = action.payload;
    },
    setCreateGroupDialogOpen(state, action: PayloadAction<boolean>) {
      state.createGroupDialogOpen = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setIsMobile,
  addToast,
  removeToast,
  setConnected,
  setReconnecting,
  setCreateGroupDialogOpen,
} = uiSlice.actions;
export default uiSlice.reducer;
