import { useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { setIsMobile } from '@/store/slices/uiSlice';
import { fetchChats } from '@/store/slices/chatSlice';
import { Sidebar } from './Sidebar';
import { CreateGroupDialog } from '@/components/chat/CreateGroupDialog';
import { MOCK_MODE } from '@/mocks/config';

export function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();

  // Initialize socket connection
  useSocket();

  useEffect(() => {
    dispatch(setIsMobile(isMobile));
  }, [isMobile, dispatch]);

  useEffect(() => {
    if (!MOCK_MODE) {
      dispatch(fetchChats());
    }
  }, [dispatch]);

  return (
    <Box display="flex" height="100vh" overflow="hidden">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
        <Outlet />
      </Box>
      <CreateGroupDialog />
    </Box>
  );
}
