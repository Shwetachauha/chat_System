import { useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useAuth';
import {
  startOutgoingCall,
  setConnecting,
  setConnected,
  endCall as endCallAction,
  toggleMute,
  toggleVideo,
  CallType,
} from '@/store/slices/callSlice';
import { callEmitters } from '@/socket/emitters/callEmitters';
import { setCallSignalHandlers, clearCallSignalHandlers } from '@/socket/handlers/callHandlers';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

// ── Module-level singletons (shared across all useCall instances) ──
let peerConnection: RTCPeerConnection | null = null;
let localStream: MediaStream | null = null;
let remoteStream: MediaStream | null = null;

// Buffer for incoming offer — held until user accepts
let pendingOffer: { callerId: string; offer: RTCSessionDescriptionInit } | null = null;

// Subscribers for stream changes — CallScreen registers here
type StreamListener = () => void;
const streamListeners = new Set<StreamListener>();

function notifyStreamChange() {
  streamListeners.forEach((fn) => fn());
}

/** Get the shared local MediaStream (or null) */
export function getLocalStream(): MediaStream | null {
  return localStream;
}
/** Get the shared remote MediaStream (or null) */
export function getRemoteStream(): MediaStream | null {
  return remoteStream;
}

function cleanupCall() {
  console.log('[Call] Cleaning up');
  pendingOffer = null;
  if (localStream) {
    localStream.getTracks().forEach((t) => t.stop());
    localStream = null;
  }
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  remoteStream = null;
  clearCallSignalHandlers();
  notifyStreamChange();
}

export function useCall() {
  const dispatch = useAppDispatch();
  const callState = useAppSelector((state) => state.call);

  // Get user media
  const getMedia = useCallback(async (callType: CallType): Promise<MediaStream> => {
    console.log('[Call] Getting media for', callType);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === 'video',
    });
    localStream = stream;
    notifyStreamChange();
    return stream;
  }, []);

  // Create peer connection with ICE handling
  const createPeerConnection = useCallback((targetUserId: string): RTCPeerConnection => {
    console.log('[Call] Creating peer connection');
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnection = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        callEmitters.sendIceCandidate(targetUserId, event.candidate.toJSON());
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[Call] ICE state:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected') {
        dispatch(setConnected());
      } else if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        dispatch(endCallAction());
        cleanupCall();
      }
    };

    pc.ontrack = (event) => {
      console.log('[Call] Remote track received');
      remoteStream = event.streams[0];
      notifyStreamChange();
    };

    // Add local tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream!);
      });
    }

    return pc;
  }, [dispatch]);

  // Register WebRTC signal handlers from socket
  useEffect(() => {
    setCallSignalHandlers({
      onOffer: async (callerId: string, offer: RTCSessionDescriptionInit) => {
        console.log('[Call] Offer received from', callerId, '— buffering until user accepts');
        // Buffer the offer — don't process until user clicks Accept
        pendingOffer = { callerId, offer };
      },
      onAnswer: async (answer: RTCSessionDescriptionInit) => {
        console.log('[Call] Processing answer');
        try {
          if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          }
        } catch (err) {
          console.error('[Call] Error handling answer:', err);
        }
      },
      onIceCandidate: async (candidate: RTCIceCandidateInit) => {
        try {
          if (peerConnection) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (err) {
          console.error('[Call] Error adding ICE candidate:', err);
        }
      },
    });

    return () => {
      clearCallSignalHandlers();
    };
  }, [callState.callType, createPeerConnection, dispatch, getMedia]);

  // Initiate an outgoing call
  const initiateCall = useCallback(async (targetUserId: string, targetUserName: string, callType: CallType) => {
    console.log('[Call] Initiating', callType, 'call to', targetUserName);
    try {
      dispatch(startOutgoingCall({ targetUserId, targetUserName, callType }));
      await getMedia(callType);
      const pc = createPeerConnection(targetUserId);
      callEmitters.initiateCall(targetUserId, callType);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      callEmitters.sendOffer(targetUserId, offer);
    } catch (err) {
      console.error('[Call] Failed to initiate call:', err);
      dispatch(endCallAction());
      cleanupCall();
    }
  }, [createPeerConnection, dispatch, getMedia]);

  // Accept an incoming call — process buffered offer now
  const acceptCall = useCallback(async () => {
    if (!callState.remoteUserId) return;
    console.log('[Call] Accepting call from', callState.remoteUserName);
    dispatch(setConnecting());

    if (!pendingOffer) {
      console.warn('[Call] No pending offer to process');
      return;
    }

    const { callerId, offer } = pendingOffer;
    pendingOffer = null;

    try {
      const callType = callState.callType || 'audio';
      await getMedia(callType);
      const pc = createPeerConnection(callerId);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      callEmitters.sendAnswer(callerId, answer);
    } catch (err) {
      console.error('[Call] Error accepting call:', err);
      dispatch(endCallAction());
      cleanupCall();
    }
  }, [callState.remoteUserId, callState.remoteUserName, callState.callType, createPeerConnection, dispatch, getMedia]);

  const rejectCall = useCallback(() => {
    if (!callState.remoteUserId) return;
    console.log('[Call] Rejecting call from', callState.remoteUserName);
    pendingOffer = null;
    callEmitters.rejectCall(callState.remoteUserId);
    dispatch(endCallAction());
    cleanupCall();
  }, [callState.remoteUserId, callState.remoteUserName, dispatch]);

  const hangUp = useCallback(() => {
    if (!callState.remoteUserId) return;
    console.log('[Call] Hanging up');
    callEmitters.endCall(callState.remoteUserId);
    dispatch(endCallAction());
    cleanupCall();
  }, [callState.remoteUserId, dispatch]);

  const handleToggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = callState.isMuted; // will flip
      }
    }
    dispatch(toggleMute());
  }, [callState.isMuted, dispatch]);

  const handleToggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = callState.isVideoOff; // will flip
      }
    }
    dispatch(toggleVideo());
  }, [callState.isVideoOff, dispatch]);

  return {
    callState,
    initiateCall,
    acceptCall,
    rejectCall,
    hangUp,
    toggleMute: handleToggleMute,
    toggleVideo: handleToggleVideo,
  };
}

/** Subscribe to stream changes — returns unsubscribe function */
export function onStreamChange(listener: StreamListener): () => void {
  streamListeners.add(listener);
  return () => streamListeners.delete(listener);
}
