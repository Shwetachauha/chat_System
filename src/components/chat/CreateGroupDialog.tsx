import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { setCreateGroupDialogOpen } from '@/store/slices/uiSlice';
import { createGroupChat } from '@/store/slices/chatSlice';
import { userService } from '@/services/userService';
import { User } from '@/types';
import { Avatar } from '@/components/common/Avatar';
import { debounce } from '@/utils/helpers';

export function CreateGroupDialog() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.createGroupDialogOpen);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const users = await userService.searchUsers(query);
      setSearchResults(users);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleClose = () => {
    dispatch(setCreateGroupDialogOpen(false));
    setGroupName('');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedUsers([]);
  };

  const handleCreate = () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    dispatch(createGroupChat({
      name: groupName.trim(),
      participantIds: selectedUsers.map((u) => u.id),
    }));
    handleClose();
  };

  const toggleUser = (user: User) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Group Chat</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Search Users"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            fullWidth
            placeholder="Type to search users..."
          />

          {selectedUsers.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {selectedUsers.map((user) => (
                <Chip
                  key={user.id}
                  label={user.username}
                  onDelete={() => toggleUser(user)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}

          {isSearching && (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={24} />
            </Box>
          )}

          <List sx={{ maxHeight: 200, overflow: 'auto' }}>
            {searchResults.map((user) => (
              <ListItemButton
                key={user.id}
                onClick={() => toggleUser(user)}
                selected={selectedUsers.some((u) => u.id === user.id)}
              >
                <Avatar name={user.username} src={user.avatar} size={32} />
                <ListItemText primary={user.username} secondary={user.email} sx={{ ml: 1.5 }} />
              </ListItemButton>
            ))}
          </List>

          {searchQuery && searchResults.length === 0 && !isSearching && (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No users found
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={!groupName.trim() || selectedUsers.length === 0}
        >
          Create Group
        </Button>
      </DialogActions>
    </Dialog>
  );
}
