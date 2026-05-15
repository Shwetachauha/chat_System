import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './useAuth';
import { addPendingMessage, markMessageFailed, retryMessage, confirmMessage } from '@/store/slices/messageSlice';
import { updateLastMessage } from '@/store/slices/chatSlice';
import { selectMessagesByChatId } from '@/store/selectors/messageSelectors';
import { messageService } from '@/services/messageService';
import { Message, MessageType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeInput } from '@/utils/sanitize';
import { store } from '@/store';
import { MESSAGE_TIMEOUT_MS } from '@/utils/constants';

export function useMessages(chatId: string) {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessagesByChatId(chatId));
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector(
    (state) => state.messages.messagesByChatId[chatId]?.isLoading ?? false
  );
  const hasMore = useAppSelector(
    (state) => state.messages.messagesByChatId[chatId]?.hasMore ?? true
  );
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const sendMessage = useCallback(
    async (content: string, type: MessageType = 'TEXT', file?: File, replyTo?: string) => {
      if (!user || !chatId) return;

      const sanitizedContent = sanitizeInput(content);
      const tempId = uuidv4();

      const optimisticMessage: Message = {
        id: tempId,
        tempId,
        chatId,
        sender: { id: user.id, name: user.name, avatar: user.avatar },
        content: sanitizedContent,
        type,
        status: 'sending',
        replyTo,
        readBy: [],
        createdAt: new Date().toISOString(),
      };

      // Optimistic update
      dispatch(addPendingMessage(optimisticMessage));

      // Set timeout for message failure detection
      const timeout = setTimeout(() => {
        const currentState = store.getState();
        const pending = currentState.messages.pendingMessages.find((m) => m.id === tempId);
        if (pending) {
          dispatch(markMessageFailed(tempId));
        }
        timeoutsRef.current.delete(tempId);
      }, MESSAGE_TIMEOUT_MS);

      timeoutsRef.current.set(tempId, timeout);

      try {
        // Send via REST API
        const formData = new FormData();
        formData.append('chatId', chatId);
        formData.append('content', sanitizedContent);
        formData.append('type', type);
        if (replyTo) {
          formData.append('replyTo', replyTo);
        }
        if (file) {
          formData.append('file', file);
        }

        const confirmedMessage = await messageService.sendMessage(formData);

        // Clear timeout and confirm
        clearTimeout(timeout);
        timeoutsRef.current.delete(tempId);
        dispatch(confirmMessage({ tempId, message: confirmedMessage }));

        // Update latest message in chat list
        dispatch(updateLastMessage({
          chatId,
          latestMessage: {
            content: confirmedMessage.content,
            type: confirmedMessage.type,
            sender: { name: user.name, avatar: user.avatar },
            createdAt: confirmedMessage.createdAt,
          },
        }));
      } catch {
        clearTimeout(timeout);
        timeoutsRef.current.delete(tempId);
        dispatch(markMessageFailed(tempId));
      }
    },
    [user, chatId, dispatch]
  );

  const retrySend = useCallback(
    async (messageId: string) => {
      const currentState = store.getState();
      const msg = currentState.messages.failedMessages.find((m) => m.id === messageId);

      dispatch(retryMessage(messageId));

      if (msg) {
        try {
          const formData = new FormData();
          formData.append('chatId', msg.chatId);
          formData.append('content', msg.content);

          const confirmedMessage = await messageService.sendMessage(formData);
          dispatch(confirmMessage({ tempId: msg.id, message: confirmedMessage }));
        } catch {
          dispatch(markMessageFailed(messageId));
        }
      }
    },
    [dispatch]
  );

  return {
    messages,
    isLoading,
    hasMore,
    sendMessage,
    retrySend,
  };
}
