import { memo } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
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
  const otherUserId = !chat.isGroupChat ? getOtherUserId(chat, userId) : '';
  const isOnline = useAppSelector(selectIsUserOnline(otherUserId));

  const handleHeaderClick = () => {
    if (!chat.isGroupChat && onOpenProfile) {
      onOpenProfile();
    } else if (chat.isGroupChat && onOpenGroupInfo) {
      onOpenGroupInfo();
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      px={2.5}
      py={1.5}
      sx={{
        background: '#e8dff5',
        boxShadow: '0 2px 8px rgba(124, 92, 191, 0.1)',
      }}
    >
      {onBack && (
        <IconButton onClick={onBack} sx={{ mr: 1, color: '#7c5cbf' }}>
          <ArrowBack />
        </IconButton>
      )}

      <Box
        display="flex"
        alignItems="center"
        flex={1}
        overflow="hidden"
        onClick={handleHeaderClick}
        sx={{
          cursor: 'pointer',
          borderRadius: 2,
          p: 0.5,
          mx: -0.5,
          transition: 'background-color 0.2s',
          '&:hover': { bgcolor: 'rgba(124,92,191,0.08)' },
        }}
      >
        <Avatar
          name={chatName}
          src={chatAvatar}
          size={42}
          online={!chat.isGroupChat ? isOnline : undefined}
        />

        <Box ml={1.5} overflow="hidden">
          <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ letterSpacing: '-0.01em', color: '#2d1b69' }}>
            {chatName}
          </Typography>
          {!chat.isGroupChat && otherUserId && <LastSeen userId={otherUserId} />}
          {chat.isGroupChat && (
            <Typography variant="caption" sx={{ color: '#7c5cbf' }} fontWeight={500}>
              {chat.members.length} members
            </Typography>
          )}
        </Box>
      </Box>

      <Box display="flex" gap={0.5}>
        <Tooltip title="Voice call">
          <IconButton
            size="small"
            sx={{ color: '#7c5cbf', '&:hover': { color: '#667eea', bgcolor: 'rgba(124,92,191,0.1)' } }}
          >
            <Call fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Video call">
          <IconButton
            size="small"
            sx={{ color: '#7c5cbf', '&:hover': { color: '#667eea', bgcolor: 'rgba(124,92,191,0.1)' } }}
          >
            <Videocam fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="More">
          <IconButton
            size="small"
            sx={{ color: '#7c5cbf', '&:hover': { color: '#667eea', bgcolor: 'rgba(124,92,191,0.1)' } }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
});
