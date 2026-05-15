import { memo } from 'react';
import { Typography } from '@mui/material';
import { usePresence } from '@/hooks/usePresence';

interface LastSeenProps {
  userId: string;
}

export const LastSeen = memo(function LastSeen({ userId }: LastSeenProps) {
  const { getLastSeenText } = usePresence(userId);
  const text = getLastSeenText();

  if (!text) return null;

  return (
    <Typography variant="caption" color="text.secondary" fontSize={11}>
      {text}
    </Typography>
  );
});
