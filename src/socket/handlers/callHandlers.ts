import { Socket } from 'socket.io-client';
import { store } from '@/store';
import { ServerEvent } from '@/types/socket';
import { setIncomingCall, endCall } from '@/store/slices/callSlice';
import { CallType } from '@/store/slices/callSlice';
import { prependCallLog, updateCallLog } from '@/store/slices/callLogSlice';
import { CallLog } from '@/types/callLog';

interface CallIncomingEvent {
  callerId: string;
  callerName: string;
  callType: 'audio' | 'video';
}

interface CallOfferEvent {
  callerId: string;
  offer: RTCSessionDescriptionInit;
}

interface CallAnswerEvent {
  calleeId: string;
  answer: RTCSessionDescriptionInit;
}

interface CallIceCandidateEvent {
  from: string;
  candidate: RTCIceCandidateInit;
}

interface CallEndedEvent {
  by: string;
}

// These will be set by useCall hook so socket handlers can forward WebRTC signals
let onOfferReceived: ((callerId: string, offer: RTCSessionDescriptionInit) => void) | null = null;
let onAnswerReceived: ((answer: RTCSessionDescriptionInit) => void) | null = null;
let onIceCandidateReceived: ((candidate: RTCIceCandidateInit) => void) | null = null;

export function setCallSignalHandlers(handlers: {
  onOffer: (callerId: string, offer: RTCSessionDescriptionInit) => void;
  onAnswer: (answer: RTCSessionDescriptionInit) => void;
  onIceCandidate: (candidate: RTCIceCandidateInit) => void;
}) {
  onOfferReceived = handlers.onOffer;
  onAnswerReceived = handlers.onAnswer;
  onIceCandidateReceived = handlers.onIceCandidate;
}

export function clearCallSignalHandlers() {
  onOfferReceived = null;
  onAnswerReceived = null;
  onIceCandidateReceived = null;
}

export function registerCallHandlers(socket: Socket): void {
  socket.on(ServerEvent.CALL_INCOMING, (event: CallIncomingEvent) => {
    console.log('[CallHandler] call:incoming', event);
    store.dispatch(setIncomingCall({
      callerId: event.callerId,
      callerName: event.callerName,
      callType: event.callType as CallType,
    }));
  });

  socket.on(ServerEvent.CALL_OFFER, (event: CallOfferEvent) => {
    console.log('[CallHandler] call:offer received');
    if (onOfferReceived) {
      onOfferReceived(event.callerId, event.offer);
    }
  });

  socket.on(ServerEvent.CALL_ANSWER, (event: CallAnswerEvent) => {
    console.log('[CallHandler] call:answer received');
    if (onAnswerReceived) {
      onAnswerReceived(event.answer);
    }
  });

  socket.on(ServerEvent.CALL_ICE_CANDIDATE, (event: CallIceCandidateEvent) => {
    console.log('[CallHandler] call:ice-candidate received');
    if (onIceCandidateReceived) {
      onIceCandidateReceived(event.candidate);
    }
  });

  socket.on(ServerEvent.CALL_REJECTED, (event: CallEndedEvent) => {
    console.log('[CallHandler] call:rejected by', event.by);
    store.dispatch(endCall());
  });

  socket.on(ServerEvent.CALL_ENDED, (event: CallEndedEvent) => {
    console.log('[CallHandler] call:ended by', event.by);
    store.dispatch(endCall());
  });

  // Call log events
  socket.on(ServerEvent.CALL_LOG_CREATED, (event: { callLog: CallLog }) => {
    console.log('[CallHandler] call_log_created', event.callLog);
    store.dispatch(prependCallLog(event.callLog));
  });

  socket.on(ServerEvent.CALL_LOG_UPDATED, (event: { callLog: CallLog }) => {
    console.log('[CallHandler] call_log_updated', event.callLog);
    store.dispatch(updateCallLog(event.callLog));
  });
}
