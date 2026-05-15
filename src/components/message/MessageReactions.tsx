import { memo } from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { Reaction } from '@/types';

interface MessageReactionsProps {
  reactions: Reaction[];
  currentUserId: string;
  onToggleReaction: (emoji: string) => void;
}

export const MessageReactions = memo(function MessageReactions({
  reactions,
  currentUserId,
  onToggleReaction,
}: MessageReactionsProps) {
  if (!reactions || reactions.length === 0) return null;

  // Group reactions by emoji
  const grouped = reactions.reduce<Record<string, { count: number; users: string[]; hasOwn: boolean }>>((acc, r) => {
    if (!acc[r.emoji]) {
      acc[r.emoji] = { count: 0, users: [], hasOwn: false };
    }
    acc[r.emoji].count++;
    acc[r.emoji].users.push(r.username);
    if (r.userId === currentUserId) {
      acc[r.emoji].hasOwn = true;
    }
    return acc;
  }, {});

  return (
    <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
      {Object.entries(grouped).map(([emoji, data]) => (
        <Tooltip key={emoji} title={data.users.join(', ')}>
          <Chip
            label={`${emoji} ${data.count}`}
            size="small"
            variant={data.hasOwn ? 'filled' : 'outlined'}
            color={data.hasOwn ? 'primary' : 'default'}
            onClick={() => onToggleReaction(emoji)}
            sx={{
              height: 24,
              fontSize: 12,
              cursor: 'pointer',
              '& .MuiChip-label': { px: 0.8 },
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
});
