import { Box, Typography, keyframes } from '@mui/material';
import { ChatBubbleOutline, GroupOutlined, Forum } from '@mui/icons-material';
import { memo } from 'react';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

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
        return <GroupOutlined sx={{ fontSize: 56, color: '#8b5cf6' }} />;
      case 'no-messages':
        return <ChatBubbleOutline sx={{ fontSize: 56, color: '#6366f1' }} />;
      default:
        return <Forum sx={{ fontSize: 56, color: '#6366f1' }} />;
    }
  };

  const getMessage = () => {
    if (message) return message;
    switch (variant) {
      case 'no-chats':
        return 'No conversations yet';
      case 'no-messages':
        return 'No messages yet';
      default:
        return 'Select a conversation to start chatting';
    }
  };

  const getSubMessage = () => {
    switch (variant) {
      case 'no-chats':
        return 'Create a group or start a direct message';
      case 'no-messages':
        return 'Send the first message to get started';
      default:
        return 'Choose from your existing conversations or start a new one';
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      gap={1.5}
      p={4}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
          animation: `${float} 3s ease-in-out infinite`,
        }}
      >
        {getIcon()}
      </Box>
      <Typography variant="h6" fontWeight={700} color="text.primary" textAlign="center" sx={{ animation: `${pulse} 4s ease-in-out infinite` }}>
        {getMessage()}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={280}>
        {getSubMessage()}
      </Typography>
    </Box>
  );
});
