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
      px={2.5}
      py={1.5}
      bgcolor="background.paper"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
      }}
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
        sx={{
          cursor: 'pointer',
          borderRadius: 2,
          p: 0.5,
          mx: -0.5,
          transition: 'background-color 0.2s',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Avatar
          name={chatName}
          src={chatAvatar}
          size={42}
          online={chat.type === 'private' ? isOnline : undefined}
        />

        <Box ml={1.5} overflow="hidden">
          <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ letterSpacing: '-0.01em' }}>
            {chatName}
          </Typography>
          {chat.type === 'private' && otherUserId && <LastSeen userId={otherUserId} />}
          {chat.type === 'group' && (
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {chat.participants.length} members
            </Typography>
          )}
        </Box>
      </Box>

      <Box display="flex" gap={0.5}>
        <Tooltip title="Voice call">
          <IconButton
            size="small"
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'rgba(99,102,241,0.08)' } }}
          >
            <Call fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Video call">
          <IconButton
            size="small"
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'rgba(99,102,241,0.08)' } }}
          >
            <Videocam fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="More">
          <IconButton
            size="small"
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'rgba(99,102,241,0.08)' } }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
});
