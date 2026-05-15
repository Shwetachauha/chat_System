import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './useAuth';
import { addPendingMessage, markMessageFailed, retryMessage } from '@/store/slices/messageSlice';
import { selectMessagesByChatId } from '@/store/selectors/messageSelectors';
import { messageEmitters } from '@/socket/emitters/messageEmitters';
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
    (content: string, type: MessageType = 'text', fileUrl?: string, fileName?: string, replyTo?: string) => {
      if (!user || !chatId) return;

      const sanitizedContent = sanitizeInput(content);
      const tempId = uuidv4();

      const optimisticMessage: Message = {
        id: tempId,
        tempId,
        chatId,
        senderId: user.id,
        senderName: user.username,
        senderAvatar: user.avatar,
        content: sanitizedContent,
        type,
        status: 'sending',
        fileUrl,
        fileName,
        replyTo,
        reactions: [],
        readBy: [],
        createdAt: new Date().toISOString(),
        isEdited: false,
        isDeleted: false,
      };

      // Optimistic update
      dispatch(addPendingMessage(optimisticMessage));

      // Emit via socket
      messageEmitters.sendMessage({
        chatId,
        content: sanitizedContent,
        type,
        tempId,
      });

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
    },
    [user, chatId, dispatch]
  );

  const retrySend = useCallback(
    (messageId: string) => {
      const currentState = store.getState();
      const msg = currentState.messages.failedMessages.find((m) => m.id === messageId);

      dispatch(retryMessage(messageId));

      if (msg) {
        messageEmitters.sendMessage({
          chatId: msg.chatId,
          content: msg.content,
          type: msg.type,
          tempId: msg.id,
        });
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
