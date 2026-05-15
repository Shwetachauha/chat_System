import { useState, memo } from 'react';
import { Box, IconButton, Popover, Tooltip } from '@mui/material';
import {
  EmojiEmotions,
  Reply,
  Edit,
  Delete,
  Forward,
} from '@mui/icons-material';
import { Message } from '@/types';
import { useAppSelector } from '@/hooks/useAuth';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

interface MessageActionsProps {
  message: Message;
  isMine: boolean;
  onReact: (emoji: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onForward: () => void;
  onReply: () => void;
}

export const MessageActions = memo(function MessageActions({
  message,
  isMine,
  onReact,
  onEdit,
  onDelete,
  onForward,
  onReply,
}: MessageActionsProps) {
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLButtonElement | null>(null);
  const user = useAppSelector((state) => state.auth.user);

  const FULL_EMOJI_LIST = [
    '👍', '👎', '❤️', '🔥', '😂', '😮', '😢', '😡',
    '🎉', '✅', '⭐', '🚀', '💯', '🙏', '👏', '🤔',
    '😍', '🥳', '💪', '🤝', '👋', '✨', '💀', '🫡',
  ];

  if (message.isDeleted) return null;

  return (
    <Box
      className="message-actions"
      sx={{
        position: 'absolute',
        top: -36,
        [isMine ? 'left' : 'right']: 0,
        display: 'none',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        border: '1px solid',
        borderColor: 'divider',
        zIndex: 100,
        p: 0.4,
        '.message-row:hover &': { display: 'flex' },
      }}
    >
      {/* Quick reactions */}
      <Box display="flex" alignItems="center">
        {QUICK_REACTIONS.map((emoji) => (
          <Box
            key={emoji}
            onClick={() => onReact(emoji)}
            sx={{
              cursor: 'pointer',
              fontSize: 16,
              px: 0.4,
              py: 0.2,
              borderRadius: 1,
              '&:hover': { bgcolor: 'action.hover', transform: 'scale(1.3)' },
              transition: 'transform 0.1s',
            }}
          >
            {emoji}
          </Box>
        ))}

        <Tooltip title="More reactions">
          <IconButton size="small" onClick={(e) => setEmojiAnchor(e.currentTarget)} sx={{ p: 0.3 }}>
            <EmojiEmotions sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Action buttons */}
      <Box display="flex" alignItems="center" borderLeft={1} borderColor="divider" ml={0.5} pl={0.5}>
        <Tooltip title="Reply">
          <IconButton size="small" onClick={onReply} sx={{ p: 0.3 }}>
            <Reply sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Forward">
          <IconButton size="small" onClick={onForward} sx={{ p: 0.3 }}>
            <Forward sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        {isMine && user?.id === message.senderId && (
          <>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={onEdit} sx={{ p: 0.3 }}>
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton size="small" onClick={onDelete} sx={{ p: 0.3, color: 'error.main' }}>
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>

      {/* Full emoji picker popover */}
      <Popover
        open={Boolean(emojiAnchor)}
        anchorEl={emojiAnchor}
        onClose={() => setEmojiAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 0.5, p: 1.5, maxWidth: 280 }}>
          {FULL_EMOJI_LIST.map((emoji) => (
            <Box
              key={emoji}
              onClick={() => { onReact(emoji); setEmojiAnchor(null); }}
              sx={{
                fontSize: 22,
                cursor: 'pointer',
                textAlign: 'center',
                borderRadius: 1,
                p: 0.3,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              {emoji}
            </Box>
          ))}
        </Box>
      </Popover>
    </Box>
  );
});
