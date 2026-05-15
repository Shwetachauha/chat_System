import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useAuth';
import { setActiveChat, resetUnread } from '@/store/slices/chatSlice';
import { fetchMessages } from '@/store/slices/messageSlice';
import { selectSortedChats, selectActiveChat } from '@/store/selectors/chatSelectors';
import { Chat } from '@/types';
import { useSocket } from './useSocket';

export function useChat() {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectSortedChats);
  const activeChat = useAppSelector(selectActiveChat);
  const isLoading = useAppSelector((state) => state.chat.isLoading);
  const { joinChat, leaveChat } = useSocket();

  const openChat = useCallback(
    (chat: Chat) => {
      if (activeChat?.id === chat.id) return;

      // Leave previous chat room
      if (activeChat) {
        leaveChat(activeChat.id);
      }

      // Set active chat
      dispatch(setActiveChat(chat));
      dispatch(resetUnread(chat.id));

      // Join new chat room
      joinChat(chat.id);

      // Fetch messages if not loaded
      dispatch(fetchMessages({ chatId: chat.id, limit: 50 }));
    },
    [activeChat, dispatch, joinChat, leaveChat]
  );

  const closeChat = useCallback(() => {
    if (activeChat) {
      leaveChat(activeChat.id);
    }
    dispatch(setActiveChat(null));
  }, [activeChat, dispatch, leaveChat]);

  return {
    chats,
    activeChat,
    isLoading,
    openChat,
    closeChat,
  };
}
