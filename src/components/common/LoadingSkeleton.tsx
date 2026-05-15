import { Box, Skeleton } from '@mui/material';
import { memo } from 'react';

interface LoadingSkeletonProps {
  variant?: 'chat-list' | 'messages' | 'profile';
  count?: number;
}

export const LoadingSkeleton = memo(function LoadingSkeleton({
  variant = 'chat-list',
  count = 5,
}: LoadingSkeletonProps) {
  if (variant === 'chat-list') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} display="flex" alignItems="center" p={2} gap={2}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box flex={1}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={16} />
            </Box>
            <Skeleton variant="text" width={40} height={14} />
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === 'messages') {
    return (
      <Box p={2}>
        {Array.from({ length: count }).map((_, i) => (
          <Box
            key={i}
            display="flex"
            justifyContent={i % 2 === 0 ? 'flex-start' : 'flex-end'}
            mb={2}
          >
            <Skeleton
              variant="rounded"
              width={`${Math.random() * 30 + 30}%`}
              height={40}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Skeleton variant="circular" width={80} height={80} />
      <Skeleton variant="text" width={150} height={24} />
      <Skeleton variant="text" width={200} height={16} />
    </Box>
  );
});
