import { useState } from 'react';
import { Box } from '@mui/material';
import { Chat, Message } from '@/types';
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
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const currentUser = useAppSelector((state) => state.auth.user);

  if (!chat) {
    return <EmptyState variant="no-chat-selected" />;
  }

  const otherUserId = chat.type === 'private' ? getOtherUserId(chat, currentUser?.id || '') : null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{
        bgcolor: '#f8fafc',
        backgroundImage: `radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.03) 2%, transparent 0%),
                          radial-gradient(circle at 75px 75px, rgba(139, 92, 246, 0.02) 2%, transparent 0%)`,
        backgroundSize: '100px 100px',
      }}
    >      <ChatHeader
        chat={chat}
        onBack={onBack}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenGroupInfo={() => setGroupInfoOpen(true)}
      />
      <MessageList chatId={chat.id} onReply={setReplyToMessage} />
      <TypingIndicator chatId={chat.id} />
      <MessageInput
        chatId={chat.id}
        replyToMessage={replyToMessage}
        onCancelReply={() => setReplyToMessage(null)}
      />

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
