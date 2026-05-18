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
  const user = useAppSelector((state) => state.auth.user);
  const [isChecking, setIsChecking] = useState(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && !user) {
      // Token exists (from localStorage) but no user — fetch profile
      authService.getMe()
        .then((u) => dispatch(setUser(u)))
        .catch(() => {})
        .finally(() => setIsChecking(false));
    } else if (!isAuthenticated) {
      // No token at all — try refresh cookie
      dispatch(refreshToken())
        .unwrap()
        .then(async () => {
          try {
            const u = await authService.getMe();
            dispatch(setUser(u));
          } catch {
            // ignore
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
