import { memo } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack, MoreVert, Call, Videocam } from '@mui/icons-material';
import { Chat } from '@/types';
import { Avatar } from '@/components/common/Avatar';
import { LastSeen } from '@/components/presence/LastSeen';
import { getChatName, getChatAvatar, getOtherUserId } from '@/utils/helpers';
import { useAppSelector } from '@/hooks/useAuth';
import { selectIsUserOnline } from '@/store/selectors/presenceSelectors';

interface ChatHeaderProps {
  chat: Chat;
  onBack?: () => void;
  onOpenProfile?: () => void;
  onOpenGroupInfo?: () => void;
}

export const ChatHeader = memo(function ChatHeader({ chat, onBack, onOpenProfile, onOpenGroupInfo }: ChatHeaderProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const userId = currentUser?.id || '';
  const chatName = getChatName(chat, userId);
  const chatAvatar = getChatAvatar(chat, userId);
  const otherUserId = chat.type === 'private' ? getOtherUserId(chat, userId) : '';
  const isOnline = useAppSelector(selectIsUserOnline(otherUserId));

  const handleHeaderClick = () => {
    if (chat.type === 'private' && onOpenProfile) {
      onOpenProfile();
    } else if (chat.type === 'group' && onOpenGroupInfo) {
      onOpenGroupInfo();
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      px={2}
      py={1}
      borderBottom={1}
      borderColor="divider"
      bgcolor="background.paper"
    >
      {onBack && (
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
      )}

      <Box
        display="flex"
        alignItems="center"
        flex={1}
        overflow="hidden"
        onClick={handleHeaderClick}
        sx={{ cursor: 'pointer' }}
      >
        <Avatar
          name={chatName}
          src={chatAvatar}
          size={40}
          online={chat.type === 'private' ? isOnline : undefined}
        />

        <Box ml={1.5} overflow="hidden">
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {chatName}
          </Typography>
          {chat.type === 'private' && otherUserId && <LastSeen userId={otherUserId} />}
          {chat.type === 'group' && (
            <Typography variant="caption" color="text.secondary">
              {chat.participants.length} members
            </Typography>
          )}
        </Box>
      </Box>

      <Box display="flex" gap={0.5}>
        <IconButton size="small">
          <Call />
        </IconButton>
        <IconButton size="small">
          <Videocam />
        </IconButton>
        <IconButton size="small">
          <MoreVert />
        </IconButton>
      </Box>
    </Box>
  );
});
