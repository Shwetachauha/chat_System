import { useMediaQuery, useTheme } from '@mui/material';
import { useChat } from '@/hooks/useChat';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useAppDispatch } from '@/hooks/useAuth';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { EmptyState } from '@/components/common/EmptyState';

export function ChatPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { activeChat, closeChat } = useChat();
  const dispatch = useAppDispatch();

  const handleBack = () => {
    closeChat();
    if (isMobile) {
      dispatch(setSidebarOpen(true));
    }
  };

  if (!activeChat) {
    return <EmptyState variant="no-chat-selected" />;
  }

  return (
    <ChatWindow
      chat={activeChat}
      onBack={isMobile ? handleBack : undefined}
    />
  );
}
