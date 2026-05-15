import { Avatar as MuiAvatar, Badge } from '@mui/material';
import { memo } from 'react';
import { getInitials } from '@/utils/helpers';

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  online?: boolean;
}

export const Avatar = memo(function Avatar({ name, src, size = 40, online }: AvatarProps) {
  const avatar = (
    <MuiAvatar
      src={src}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        bgcolor: 'primary.main',
      }}
    >
      {getInitials(name)}
    </MuiAvatar>
  );

  if (online !== undefined) {
    return (
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: online ? '#44b700' : '#bdbdbd',
            color: online ? '#44b700' : '#bdbdbd',
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              animation: online ? 'ripple 1.2s infinite ease-in-out' : 'none',
              border: '1px solid currentColor',
              content: '""',
            },
          },
          '@keyframes ripple': {
            '0%': { transform: 'scale(.8)', opacity: 1 },
            '100%': { transform: 'scale(2.4)', opacity: 0 },
          },
        }}
      >
        {avatar}
      </Badge>
    );
  }

  return avatar;
});
