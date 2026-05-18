import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CallType = 'audio' | 'video';
export type CallStatus = 'idle' | 'outgoing' | 'incoming' | 'connecting' | 'connected' | 'ended';

interface CallState {
  status: CallStatus;
  callType: CallType | null;
  remoteUserId: string | null;
  remoteUserName: string | null;
  isMuted: boolean;
  isVideoOff: boolean;
  callStartedAt: string | null;
}

const initialState: CallState = {
  status: 'idle',
  callType: null,
  remoteUserId: null,
  remoteUserName: null,
  isMuted: false,
  isVideoOff: false,
  callStartedAt: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    startOutgoingCall(state, action: PayloadAction<{ targetUserId: string; targetUserName: string; callType: CallType }>) {
      state.status = 'outgoing';
      state.callType = action.payload.callType;
      state.remoteUserId = action.payload.targetUserId;
      state.remoteUserName = action.payload.targetUserName;
      state.isMuted = false;
      state.isVideoOff = false;
      state.callStartedAt = null;
    },
    setIncomingCall(state, action: PayloadAction<{ callerId: string; callerName: string; callType: CallType }>) {
      state.status = 'incoming';
      state.callType = action.payload.callType;
      state.remoteUserId = action.payload.callerId;
      state.remoteUserName = action.payload.callerName;
      state.isMuted = false;
      state.isVideoOff = false;
      state.callStartedAt = null;
    },
    setConnecting(state) {
      state.status = 'connecting';
    },
    setConnected(state) {
      state.status = 'connected';
      state.callStartedAt = new Date().toISOString();
    },
    endCall(state) {
      state.status = 'idle';
      state.callType = null;
      state.remoteUserId = null;
      state.remoteUserName = null;
      state.isMuted = false;
      state.isVideoOff = false;
      state.callStartedAt = null;
    },
    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },
    toggleVideo(state) {
      state.isVideoOff = !state.isVideoOff;
    },
  },
});

export const {
  startOutgoingCall,
  setIncomingCall,
  setConnecting,
  setConnected,
  endCall,
  toggleMute,
  toggleVideo,
} = callSlice.actions;
export default callSlice.reducer;
