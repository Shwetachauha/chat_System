import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Link,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { register, clearError } from '@/store/slices/authSlice';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setLocalError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    dispatch(register({ username: username.trim(), email: email.trim(), password, confirmPassword }));
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" textAlign="center" mb={3} fontWeight={600}>
        Create Account
      </Typography>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        {(error || localError) && (
          <Typography color="error" variant="body2" textAlign="center">
            {localError || error}
          </Typography>
        )}

        <TextField
          label="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) dispatch(clearError());
          }}
          fullWidth
          required
          autoComplete="username"
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) dispatch(clearError());
          }}
          fullWidth
          required
          autoComplete="email"
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          autoComplete="new-password"
        />

        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          required
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isLoading}
          sx={{ mt: 1 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
        </Button>

        <Typography variant="body2" textAlign="center" mt={1}>
          Already have an account?{' '}
          <Link component="button" type="button" onClick={onSwitchToLogin}>
            Sign In
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}
