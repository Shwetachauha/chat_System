import { useState } from 'react';
import { Box } from '@mui/material';
import { Chat } from '@/types';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList } from '@/components/message/MessageList';
import { MessageInput } from '@/components/message/MessageInput';
import { TypingIndicator } from '@/components/presence/TypingIndicator';
import { EmptyState } from '@/components/common/EmptyState';
import { UserProfilePanel } from '@/components/chat/UserProfilePanel';
import { GroupInfoPanel } from '@/components/chat/GroupInfoPanel';
import { useAppSelector } from '@/hooks/useAuth';
import { getOtherUserId } from '@/utils/helpers';

interface ChatWindowProps {
  chat: Chat | null;
  onBack?: () => void;
}

export function ChatWindow({ chat, onBack }: ChatWindowProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [groupInfoOpen, setGroupInfoOpen] = useState(false);
  const currentUser = useAppSelector((state) => state.auth.user);

  if (!chat) {
    return <EmptyState variant="no-chat-selected" />;
  }

  const otherUserId = chat.type === 'private' ? getOtherUserId(chat, currentUser?.id || '') : null;

  return (
    <Box display="flex" flexDirection="column" height="100%" bgcolor="background.default">
      <ChatHeader
        chat={chat}
        onBack={onBack}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenGroupInfo={() => setGroupInfoOpen(true)}
      />
      <MessageList chatId={chat.id} />
      <TypingIndicator chatId={chat.id} />
      <MessageInput chatId={chat.id} />

      {/* Side panels */}
      <UserProfilePanel
        open={profileOpen}
        userId={otherUserId}
        onClose={() => setProfileOpen(false)}
      />
      <GroupInfoPanel
        open={groupInfoOpen}
        chat={chat}
        onClose={() => setGroupInfoOpen(false)}
      />
    </Box>
  );
}
