import { memo } from 'react';
import { Box, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Chat } from '@/types';
import { Avatar } from '@/components/common/Avatar';
import { formatTime, getChatName, getChatAvatar, getOtherUserId } from '@/utils/helpers';
import { useAppSelector } from '@/hooks/useAuth';
import { selectIsUserOnline } from '@/store/selectors/presenceSelectors';

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: (chat: Chat) => void;
}

export const ChatListItem = memo(function ChatListItem({
  chat,
  isActive,
  onSelect,
}: ChatListItemProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const userId = currentUser?.id || '';
  const chatName = getChatName(chat, userId);
  const chatAvatar = getChatAvatar(chat, userId);
  const otherUserId = chat.type === 'private' ? getOtherUserId(chat, userId) : '';
  const isOnline = useAppSelector(selectIsUserOnline(otherUserId));

  return (
    <ListItemButton
      selected={isActive}
      onClick={() => onSelect(chat)}
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 2,
        mx: 1,
        mb: 0.5,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&.Mui-selected': {
          bgcolor: 'rgba(99, 102, 241, 0.08)',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '20%',
            bottom: '20%',
            width: 3,
            borderRadius: 2,
            bgcolor: 'primary.main',
          },
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
        position: 'relative',
      }}
    >
      <Avatar
        name={chatName}
        src={chatAvatar}
        size={50}
        online={chat.type === 'private' ? isOnline : undefined}
      />

      <ListItemText
        sx={{ ml: 2, overflow: 'hidden' }}
        primary={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="subtitle2"
              noWrap
              fontWeight={chat.unreadCount > 0 ? 700 : 500}
              sx={{ color: 'text.primary' }}
            >
              {chatName}
            </Typography>
            {chat.lastMessage && (
              <Typography
                variant="caption"
                sx={{
                  flexShrink: 0,
                  ml: 1,
                  color: chat.unreadCount > 0 ? 'primary.main' : 'text.secondary',
                  fontWeight: chat.unreadCount > 0 ? 600 : 400,
                }}
              >
                {formatTime(chat.lastMessage.createdAt)}
              </Typography>
            )}
          </Box>
        }
        secondary={
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.3}>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{
                fontWeight: chat.unreadCount > 0 ? 500 : 400,
                fontSize: '0.82rem',
              }}
            >
              {chat.lastMessage?.content || 'No messages yet'}
            </Typography>
            {chat.unreadCount > 0 && (
              <Box
                sx={{
                  ml: 1,
                  minWidth: 20,
                  height: 20,
                  borderRadius: '10px',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 0.6,
                }}
              >
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: 10, lineHeight: 1 }}>
                  {chat.unreadCount}
                </Typography>
              </Box>
            )}
          </Box>
        }
      />
    </ListItemButton>
  );
});
