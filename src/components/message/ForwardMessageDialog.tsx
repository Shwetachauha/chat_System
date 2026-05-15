import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { useAppSelector } from '@/hooks/useAuth';
import { Chat } from '@/types';

interface ForwardMessageDialogProps {
  open: boolean;
  messageContent: string;
  onClose: () => void;
  onForward: (targetChatId: string) => void;
}

export function ForwardMessageDialog({ open, messageContent, onClose, onForward }: ForwardMessageDialogProps) {
  const [search, setSearch] = useState('');
  const chats = useAppSelector((state) => state.chat.chats);

  const filteredChats = chats.filter(
    (chat: Chat) => {
      const name = chat.isGroupChat ? (chat.groupName || '') : (chat.chatWith?.name || '');
      return name.toLowerCase().includes(search.toLowerCase());
    }
  );

  const handleSelect = (chatId: string) => {
    onForward(chatId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Forward Message</DialogTitle>
      <DialogContent>
        {/* Message preview */}
        <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'action.hover' }}>
          <Typography variant="body2" noWrap>
            {messageContent}
          </Typography>
        </Paper>

        <TextField
          fullWidth
          size="small"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 1 }}
        />

        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          <List dense disablePadding>
            {filteredChats.map((chat: Chat) => (
              <ListItemButton key={chat.id} onClick={() => handleSelect(chat.id)}>
                <ListItemAvatar>
                  <Avatar src={chat.isGroupChat ? undefined : chat.chatWith?.avatar}>{(chat.isGroupChat ? (chat.groupName || 'G') : (chat.chatWith?.name || 'C'))[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={chat.isGroupChat ? chat.groupName : chat.chatWith?.name || 'Chat'}
                  secondary={chat.isGroupChat ? 'Group' : 'Direct'}
                />
              </ListItemButton>
            ))}
            {filteredChats.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No chats found
              </Typography>
            )}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
