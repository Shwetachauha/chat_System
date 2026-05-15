import { memo } from 'react';
import { Typography, Box, keyframes } from '@mui/material';
import { useTyping } from '@/hooks/useTyping';

const bounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
`;

interface TypingIndicatorProps {
  chatId: string;
}

export const TypingIndicator = memo(function TypingIndicator({ chatId }: TypingIndicatorProps) {
  const { typingUsers, getTypingText } = useTyping(chatId);
  const text = getTypingText();

  if (typingUsers.length === 0) return null;

  return (
    <Box display="flex" alignItems="center" gap={0.5} px={2} py={0.5}>
      <Box display="flex" gap={0.3}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: 'text.secondary',
              animation: `${bounce} 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary" fontStyle="italic">
        {text}
      </Typography>
    </Box>
  );
});
