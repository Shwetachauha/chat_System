import { memo } from 'react';
import { Box } from '@mui/material';
import { DoneAll, Done, Schedule, ErrorOutline } from '@mui/icons-material';
import { MessageStatus as MessageStatusType } from '@/types';

interface MessageStatusProps {
  status: MessageStatusType;
}

export const MessageStatus = memo(function MessageStatus({ status }: MessageStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Schedule sx={{ fontSize: 14, color: 'text.disabled' }} />;
      case 'sent':
        return <Done sx={{ fontSize: 14, color: 'text.disabled' }} />;
      case 'delivered':
        return <DoneAll sx={{ fontSize: 14, color: 'text.disabled' }} />;
      case 'seen':
        return <DoneAll sx={{ fontSize: 14, color: 'primary.main' }} />;
      case 'failed':
        return <ErrorOutline sx={{ fontSize: 14, color: 'error.main' }} />;
      default:
        return null;
    }
  };

  return <Box display="inline-flex" ml={0.5}>{getStatusIcon()}</Box>;
});
