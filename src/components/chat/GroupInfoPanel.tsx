import { useState } from 'react';
import {
  Drawer,
  Box,
  Avatar,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Button,
  Chip,
} from '@mui/material';
import { Close, Edit, Group, Circle } from '@mui/icons-material';
import { useAppSelector } from '@/hooks/useAuth';
import { Chat } from '@/types';

interface GroupInfoPanelProps {
  open: boolean;
  chat: Chat | null;
  onClose: () => void;
  onUpdateName?: (newName: string) => void;
}

export function GroupInfoPanel({ open, chat, onClose, onUpdateName }: GroupInfoPanelProps) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(chat?.groupName || '');
  const currentUser = useAppSelector((state) => state.auth.user);
  const onlineUsers = useAppSelector((state) => state.presence.onlineUsers);

  if (!chat || !chat.isGroupChat) return null;

  const isAdmin = chat.groupAdmin?.id === currentUser?.id;

  const handleSaveName = () => {
    if (newName.trim() && newName.trim() !== chat.groupName) {
      onUpdateName?.(newName.trim());
    }
    setEditing(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 340 } }}>
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Group Info</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Group avatar & name */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar sx={{ width: 80, height: 80, mb: 1.5, bgcolor: 'primary.main' }}>
            <Group sx={{ fontSize: 40 }} />
          </Avatar>

          {editing ? (
            <Box display="flex" gap={1} alignItems="center">
              <TextField
                size="small"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <Button size="small" variant="contained" onClick={handleSaveName}>
                Save
              </Button>
              <Button size="small" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </Box>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6">{chat.groupName}</Typography>
              {isAdmin && (
                <IconButton
                  size="small"
                  onClick={() => { setNewName(chat.groupName || ''); setEditing(true); }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {chat.members?.length || 0} members
          </Typography>
          {isAdmin && <Chip label="Admin" size="small" color="primary" sx={{ mt: 0.5 }} />}
        </Box>

        <Divider />

        {/* Description */}
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Description</Typography>
          <Typography variant="body2" color="text.secondary">
            No description set
          </Typography>
        </Box>

        <Divider />

        {/* Members */}
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Members ({chat.members?.length || 0})
          </Typography>
          <List dense disablePadding>
            {chat.members?.map((member) => (
              <ListItem key={member.id} disablePadding sx={{ py: 0.5 }}>
                <ListItemAvatar>
                  <Avatar src={member.avatar} sx={{ width: 36, height: 36 }}>
                    {member.name?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {member.name}
                      {chat.groupAdmin?.id === member.id && (
                        <Chip label="Admin" size="small" sx={{ height: 18, fontSize: 10 }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Circle sx={{ fontSize: 8, color: onlineUsers[member.id] ? 'success.main' : 'text.disabled' }} />
                      {onlineUsers[member.id] ? 'Online' : 'Offline'}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}
