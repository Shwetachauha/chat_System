import { useState, useMemo, memo } from 'react';
import {
  Box,
  TextField,
  List,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Search, GroupAdd } from '@mui/icons-material';
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
      <Box px={2} pt={2} pb={1}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            Chats
          </Typography>
          <IconButton onClick={() => dispatch(setCreateGroupDialogOpen(true))} size="small">
            <GroupAdd />
          </IconButton>
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
                <Search fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', px: 0 }}>
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
