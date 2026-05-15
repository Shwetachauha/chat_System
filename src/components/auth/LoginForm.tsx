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
import { login, clearError } from '@/store/slices/authSlice';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    dispatch(login({ email: email.trim(), password }));
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" textAlign="center" mb={3} fontWeight={600}>
        Welcome Back
      </Typography>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        {error && (
          <Typography color="error" variant="body2" textAlign="center">
            {error}
          </Typography>
        )}

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
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) dispatch(clearError());
          }}
          fullWidth
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isLoading}
          sx={{ mt: 1 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>

        <Typography variant="body2" textAlign="center" mt={1}>
          Don&apos;t have an account?{' '}
          <Link component="button" type="button" onClick={onSwitchToRegister}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}
