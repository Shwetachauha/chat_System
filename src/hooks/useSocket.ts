import { useEffect, useRef, useCallback } from 'react';
import { useAppSelector } from './useAuth';
import { socketManager } from '@/socket';
import { MOCK_MODE } from '@/mocks/config';

export function useSocket() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isConnected = useAppSelector((state) => state.ui.isConnected);
  const isReconnecting = useAppSelector((state) => state.ui.isReconnecting);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (MOCK_MODE) return; // Skip socket in mock mode
    if (isAuthenticated && accessToken && !connectedRef.current) {
      socketManager.connect(accessToken);
      connectedRef.current = true;
    }

    return () => {
      if (!isAuthenticated && connectedRef.current) {
        socketManager.disconnect();
        connectedRef.current = false;
      }
    };
  }, [isAuthenticated, accessToken]);

  // Cleanup on unmount
  useEffect(() => {
    if (MOCK_MODE) return;
    return () => {
      if (connectedRef.current) {
        socketManager.disconnect();
        connectedRef.current = false;
      }
    };
  }, []);

  const joinChat = useCallback((chatId: string) => {
    if (MOCK_MODE) return;
    socketManager.joinChat(chatId);
  }, []);

  const leaveChat = useCallback((chatId: string) => {
    if (MOCK_MODE) return;
    socketManager.leaveChat(chatId);
  }, []);

  return {
    isConnected,
    isReconnecting,
    joinChat,
    leaveChat,
  };
}
