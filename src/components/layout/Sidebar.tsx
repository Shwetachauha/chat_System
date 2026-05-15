import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/hooks/useAuth';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { ChatList } from '@/components/chat/ChatList';

const SIDEBAR_WIDTH = 380;

export function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  if (isMobile) {
    return (
      <Drawer
        open={sidebarOpen}
        onClose={() => dispatch(setSidebarOpen(false))}
        sx={{
          '& .MuiDrawer-paper': {
            width: '85vw',
            maxWidth: SIDEBAR_WIDTH,
            border: 'none',
            bgcolor: '#f3eefa',
          },
        }}
      >
        <ChatList />
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f3eefa',
        borderRight: '1px solid rgba(124,92,191,0.12)',
      }}
    >
      <ChatList />
    </Box>
  );
}
