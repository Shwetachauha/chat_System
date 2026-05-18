import { memo } from 'react';
import { Box, ListItemButton, ListItemText, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Chat } from '@/types';
import { Avatar } from '@/components/common/Avatar';
import { formatTime, getChatName, getChatAvatar, getOtherUserId } from '@/utils/helpers';
import { useAppSelector } from '@/hooks/useAuth';
import { selectIsUserOnline } from '@/store/selectors/presenceSelectors';

const MotionListItem = motion.create(ListItemButton as any);

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
  const otherUserId = !chat.isGroupChat ? getOtherUserId(chat, userId) : '';
  const isOnline = useAppSelector(selectIsUserOnline(otherUserId));

  return (
    <MotionListItem
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      selected={isActive}
      onClick={() => onSelect(chat)}
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: '14px',
        mx: 0.5,
        mb: 0.8,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&.Mui-selected': {
          background: 'rgba(124,92,191,0.1)',
          border: '1px solid rgba(124,92,191,0.2)',
          '&:hover': {
            background: 'rgba(124,92,191,0.15)',
          },
        },
        '&:not(.Mui-selected)': {
          border: '1px solid transparent',
          '&:hover': {
            bgcolor: 'rgba(124,92,191,0.06)',
            border: '1px solid rgba(124,92,191,0.1)',
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
        online={!chat.isGroupChat ? isOnline : undefined}
      />

      <ListItemText
        sx={{ ml: 2, overflow: 'hidden' }}
        primary={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="subtitle2"
              noWrap
              fontWeight={chat.unreadCount > 0 ? 700 : 500}
              sx={{ color: '#2d1b69' }}
            >
              {chatName}
            </Typography>
            {chat.latestMessage && (
              <Typography
                variant="caption"
                sx={{
                  flexShrink: 0,
                  ml: 1,
                  color: chat.unreadCount > 0 ? '#7c5cbf' : 'rgba(0,0,0,0.4)' ,
                  fontWeight: chat.unreadCount > 0 ? 600 : 400,
                }}
              >
                {formatTime(chat.latestMessage.createdAt)}
              </Typography>
            )}
          </Box>
        }
        secondary={
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.3}>
            <Typography
              variant="body2"
              noWrap
              sx={{
                color: 'rgba(0,0,0,0.5)',
                fontWeight: chat.unreadCount > 0 ? 500 : 400,
                fontSize: '0.82rem',
              }}
            >
              {chat.latestMessage
                ? chat.latestMessage.type === 'IMAGE'
                  ? '📷 Photo'
                  : chat.latestMessage.type === 'FILE'
                    ? '📎 ' + (chat.latestMessage.content || 'File')
                    : chat.latestMessage.content
                : 'No messages yet'}
            </Typography>
            {chat.unreadCount > 0 && (
              <Box
                sx={{
                  ml: 1,
                  minWidth: 20,
                  height: 20,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    </MotionListItem>
  );
});
