import { useState, useMemo, memo } from 'react';
import {
  Box,
  TextField,
  List,
  Typography,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { Search, GroupAdd, ChatBubble } from '@mui/icons-material';
import { useChat } from '@/hooks/useChat';
import { useAppDispatch } from '@/hooks/useAuth';
import { setCreateGroupDialogOpen } from '@/store/slices/uiSlice';
import { ChatListItem } from './ChatListItem';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';

export const ChatList = memo(function ChatList() {
  const { chats, activeChat, isLoading, openChat } = useChat();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const query = searchQuery.toLowerCase();
    return chats.filter((chat) => {
      const name = chat.name || chat.participants.map((p) => p.username).join(', ');
      return name.toLowerCase().includes(query);
    });
  }, [chats, searchQuery]);

  if (isLoading) return <LoadingSkeleton variant="chat-list" />;

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Header */}
      <Box px={2.5} pt={3} pb={1.5}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChatBubble sx={{ fontSize: 18, color: 'white' }} />
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.03em' }}>
              Messages
            </Typography>
          </Box>
          <Tooltip title="New Group">
            <IconButton
              onClick={() => dispatch(setCreateGroupDialogOpen(true))}
              size="small"
              sx={{
                bgcolor: 'action.hover',
                '&:hover': { bgcolor: 'action.selected' },
              }}
            >
              <GroupAdd fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Chat list */}
      <List sx={{ flex: 1, overflow: 'auto', px: 1, pt: 1 }}>
        {filteredChats.length === 0 ? (
          <EmptyState variant="no-chats" />
        ) : (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={activeChat?.id === chat.id}
              onSelect={openChat}
            />
          ))
        )}
      </List>
    </Box>
  );
});
