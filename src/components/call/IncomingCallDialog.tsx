import { Box, Typography, IconButton, Avatar } from '@mui/material';
import { Call, CallEnd } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCall } from '@/hooks/useCall';

export function IncomingCallDialog() {
  const { callState, acceptCall, rejectCall } = useCall();

  if (callState.status !== 'incoming') return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <Box
          sx={{
            textAlign: 'center',
            p: 5,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            minWidth: 320,
          }}
        >
          {/* Pulsing avatar */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Avatar
              sx={{
                width: 96,
                height: 96,
                mx: 'auto',
                mb: 3,
                fontSize: 40,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 0 30px rgba(102,126,234,0.4)',
              }}
            >
              {callState.remoteUserName?.[0]?.toUpperCase() || '?'}
            </Avatar>
          </motion.div>

          <Typography variant="h5" fontWeight={700} color="white" mb={0.5}>
            {callState.remoteUserName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
            Incoming {callState.callType} call...
          </Typography>

          <Box display="flex" justifyContent="center" gap={4}>
            {/* Reject */}
            <Box textAlign="center">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  onClick={rejectCall}
                  sx={{
                    bgcolor: '#ef4444',
                    color: 'white',
                    width: 64,
                    height: 64,
                    '&:hover': { bgcolor: '#dc2626' },
                    boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
                  }}
                >
                  <CallEnd fontSize="large" />
                </IconButton>
              </motion.div>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1, display: 'block' }}>
                Decline
              </Typography>
            </Box>

            {/* Accept */}
            <Box textAlign="center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <IconButton
                  onClick={acceptCall}
                  sx={{
                    bgcolor: '#22c55e',
                    color: 'white',
                    width: 64,
                    height: 64,
                    '&:hover': { bgcolor: '#16a34a' },
                    boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
                  }}
                >
                  <Call fontSize="large" />
                </IconButton>
              </motion.div>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1, display: 'block' }}>
                Accept
              </Typography>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
