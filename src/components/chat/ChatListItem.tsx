import { memo } from 'react';
import { Box, ListItemButton, ListItemText, Typography, Badge } from '@mui/material';
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
        borderRadius: 1,
        mx: 1,
        mb: 0.5,
        '&.Mui-selected': {
          bgcolor: 'action.selected',
        },
      }}
    >
      <Avatar
        name={chatName}
        src={chatAvatar}
        size={48}
        online={chat.type === 'private' ? isOnline : undefined}
      />

      <ListItemText
        sx={{ ml: 2, overflow: 'hidden' }}
        primary={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" noWrap fontWeight={chat.unreadCount > 0 ? 700 : 500}>
              {chatName}
            </Typography>
            {chat.lastMessage && (
              <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 1 }}>
                {formatTime(chat.lastMessage.createdAt)}
              </Typography>
            )}
          </Box>
        }
        secondary={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ fontWeight: chat.unreadCount > 0 ? 600 : 400 }}
            >
              {chat.lastMessage?.content || 'No messages yet'}
            </Typography>
            {chat.unreadCount > 0 && (
              <Badge
                badgeContent={chat.unreadCount}
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
        }
      />
    </ListItemButton>
  );
});
