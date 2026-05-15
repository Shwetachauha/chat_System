import { Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useAuth';
import { ReactNode, useEffect, useState } from 'react';
import { refreshToken } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import { setUser } from '@/store/slices/authSlice';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isChecking, setIsChecking] = useState(!isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      // Try to restore session using refresh token cookie
      dispatch(refreshToken())
        .unwrap()
        .then(async () => {
          // Token refreshed, now get user profile
          try {
            const user = await authService.getMe();
            dispatch(setUser(user));
          } catch {
            // ignore - user will still be null but authenticated
          }
        })
        .catch(() => {
          // Refresh failed - user must log in
        })
        .finally(() => setIsChecking(false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isChecking) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
