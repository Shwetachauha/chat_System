import { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';

interface OnlineIndicatorProps {
  isOnline: boolean;
  size?: 'small' | 'medium';
}

export const OnlineIndicator = memo(function OnlineIndicator({
  isOnline,
  size = 'small',
}: OnlineIndicatorProps) {
  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <FiberManualRecord
        sx={{
          fontSize: size === 'small' ? 8 : 12,
          color: isOnline ? '#44b700' : '#bdbdbd',
        }}
      />
      <Typography
        variant="caption"
        color={isOnline ? 'success.main' : 'text.secondary'}
        fontSize={size === 'small' ? 11 : 12}
      >
        {isOnline ? 'Online' : 'Offline'}
      </Typography>
    </Box>
  );
});
