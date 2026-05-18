import { useState, useRef, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
  Badge,
  CircularProgress,
} from '@mui/material';
import { CameraAlt, Logout } from '@mui/icons-material';
import { AnimatedDialog } from '@/components/common/AnimatedDialog';
import { Avatar } from '@/components/common/Avatar';
import { useAppSelector, useAppDispatch } from '@/hooks/useAuth';
import { setUser } from '@/store/slices/authSlice';
import { userService } from '@/services/userService';
import { uploadService } from '@/services/uploadService';

interface MyProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function MyProfileDialog({ open, onClose, onLogout }: MyProfileDialogProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch fresh profile from API when dialog opens
  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    userService.getProfile()
      .then((profile) => {
        dispatch(setUser(profile));
        setName(profile.name || '');
        setBio(profile.bio || '');
        setAvatarUrl(profile.avatar || '');
      })
      .catch(() => {
        // fallback to Redux state
        if (user) {
          setName(user.name || '');
          setBio(user.bio || '');
          setAvatarUrl(user.avatar || '');
        }
      })
      .finally(() => setIsLoading(false));
  }, [open]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setIsUploadingAvatar(true);
    try {
      const result = await uploadService.uploadFile(file);
      setAvatarUrl(result.url);
    } catch {
      // silently fail
    }
    setIsUploadingAvatar(false);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        avatar: avatarUrl,
      });
      dispatch(setUser(updated));
      onClose();
    } catch {
      // silently fail
    }
    setIsSaving(false);
  };

  const hasChanges = name !== (user?.name || '') || bio !== (user?.bio || '') || avatarUrl !== (user?.avatar || '');

  return (
    <AnimatedDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, color: '#2d1b69' }}>
        My Profile
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress sx={{ color: '#7c5cbf' }} />
          </Box>
        ) : (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} pt={1}>
          {/* Avatar with upload */}
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                sx={{
                  bgcolor: '#7c5cbf',
                  color: 'white',
                  width: 32,
                  height: 32,
                  '&:hover': { bgcolor: '#667eea' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                {isUploadingAvatar ? <CircularProgress size={16} color="inherit" /> : <CameraAlt sx={{ fontSize: 16 }} />}
              </IconButton>
            }
          >
            <Avatar name={name || 'User'} src={avatarUrl} size={100} />
          </Badge>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarUpload}
          />

          {/* Email (read-only) */}
          <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)' }}>
            {user?.email}
          </Typography>

          {/* Name */}
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            sx={{ mt: 1 }}
          />

          {/* Bio */}
          <TextField
            fullWidth
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            size="small"
            multiline
            maxRows={3}
            placeholder="Write something about yourself..."
          />
        </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Button
          startIcon={<Logout />}
          onClick={onLogout}
          color="error"
          size="small"
        >
          Logout
        </Button>
        <Box display="flex" gap={1}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!name.trim() || isSaving || !hasChanges}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #5a6fe0 0%, #6a3d96 100%)' },
            }}
          >
            {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </Box>
      </DialogActions>
    </AnimatedDialog>
  );
}
