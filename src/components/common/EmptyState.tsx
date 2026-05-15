import { Box, Typography } from '@mui/material';
import { ChatBubbleOutline, GroupOutlined } from '@mui/icons-material';
import { memo } from 'react';

interface EmptyStateProps {
  variant?: 'no-chats' | 'no-messages' | 'no-chat-selected';
  message?: string;
}

export const EmptyState = memo(function EmptyState({
  variant = 'no-chat-selected',
  message,
}: EmptyStateProps) {
  const getIcon = () => {
    switch (variant) {
      case 'no-chats':
        return <GroupOutlined sx={{ fontSize: 64, color: 'text.disabled' }} />;
      case 'no-messages':
        return <ChatBubbleOutline sx={{ fontSize: 64, color: 'text.disabled' }} />;
      default:
        return <ChatBubbleOutline sx={{ fontSize: 64, color: 'text.disabled' }} />;
    }
  };

  const getMessage = () => {
    if (message) return message;
    switch (variant) {
      case 'no-chats':
        return 'No conversations yet. Start chatting!';
      case 'no-messages':
        return 'No messages yet. Send the first message!';
      default:
        return 'Select a conversation to start chatting';
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      gap={2}
      p={3}
    >
      {getIcon()}
      <Typography variant="body1" color="text.secondary" textAlign="center">
        {getMessage()}
      </Typography>
    </Box>
  );
});
