import { socketManager } from '@/socket/socketManager';
import { ClientEvent } from '@/types/socket';

export const callEmitters = {
  initiateCall(targetUserId: string, callType: 'audio' | 'video'): void {
    console.log('[CallEmit] call:initiate', { targetUserId, callType });
    socketManager.emit(ClientEvent.CALL_INITIATE, { targetUserId, callType });
  },

  sendOffer(targetUserId: string, offer: RTCSessionDescriptionInit): void {
    console.log('[CallEmit] call:offer', { targetUserId });
    socketManager.emit(ClientEvent.CALL_OFFER, { targetUserId, offer });
  },

  sendAnswer(targetUserId: string, answer: RTCSessionDescriptionInit): void {
    console.log('[CallEmit] call:answer', { targetUserId });
    socketManager.emit(ClientEvent.CALL_ANSWER, { targetUserId, answer });
  },

  sendIceCandidate(targetUserId: string, candidate: RTCIceCandidateInit): void {
    console.log('[CallEmit] call:ice-candidate');
    socketManager.emit(ClientEvent.CALL_ICE_CANDIDATE, { targetUserId, candidate });
  },

  rejectCall(targetUserId: string): void {
    console.log('[CallEmit] call:reject', { targetUserId });
    socketManager.emit(ClientEvent.CALL_REJECT, { targetUserId });
  },

  endCall(targetUserId: string): void {
    console.log('[CallEmit] call:end', { targetUserId });
    socketManager.emit(ClientEvent.CALL_END, { targetUserId });
  },
};
