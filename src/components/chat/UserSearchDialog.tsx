import { useState, useCallback, useRef } from 'react';
import {
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  InputAdornment,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { AnimatedDialog } from '@/components/common/AnimatedDialog';
import { Avatar } from '@/components/common/Avatar';
import { userService } from '@/services/userService';
import { useAppDispatch } from '@/hooks/useAuth';
import { createPrivateChat } from '@/store/slices/chatSlice';
import { User } from '@/types';

interface UserSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onChatCreated?: () => void;
}

export function UserSearchDialog({ open, onClose, onChatCreated }: UserSearchDialogProps) {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setSearched(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const users = await userService.searchUsers(value.trim());
        setResults(users);
        setSearched(true);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }, []);

  const handleSelectUser = async (user: User) => {
    const result = await dispatch(createPrivateChat({ userId: user.id, user }));
    if (createPrivateChat.fulfilled.match(result)) {
      onChatCreated?.();
      handleClose();
    }
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
    onClose();
  };

  return (
    <AnimatedDialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Search Users</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          size="small"
          autoFocus
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {isSearching && (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={28} />
          </Box>
        )}

        {!isSearching && results.length > 0 && (
          <List disablePadding sx={{ maxHeight: 300, overflow: 'auto' }}>
            {results.map((user) => (
              <ListItemButton
                key={user.id}
                onClick={() => handleSelectUser(user)}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <Avatar name={user.name} src={user.avatar} size={40} />
                <ListItemText
                  primary={user.name}
                  secondary={user.email}
                  sx={{ ml: 1.5 }}
                />
              </ListItemButton>
            ))}
          </List>
        )}

        {!isSearching && searched && results.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
            No users found
          </Typography>
        )}

        {!isSearching && !searched && (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
            Type at least 2 characters to search
          </Typography>
        )}
      </DialogContent>
    </AnimatedDialog>
  );
}
