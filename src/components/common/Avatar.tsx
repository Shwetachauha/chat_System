import { Avatar as MuiAvatar, Badge } from '@mui/material';
import { memo } from 'react';
import { getInitials } from '@/utils/helpers';

// Generate consistent color from name string
function stringToColor(str: string): string {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
    '#eab308', '#10b981', '#14b8a6', '#06b6d4', '#3b82f6',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  online?: boolean;
}

export const Avatar = memo(function Avatar({ name, src, size = 40, online }: AvatarProps) {
  const bgColor = stringToColor(name);

  const avatar = (
    <MuiAvatar
      src={src}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        fontWeight: 600,
        background: src ? undefined : `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
        border: '2px solid',
        borderColor: 'background.paper',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
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
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: '50%',
            backgroundColor: online ? '#10b981' : '#94a3b8',
            boxShadow: (theme) => `0 0 0 2.5px ${theme.palette.background.paper}`,
            '&::after': {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              animation: online ? 'ripple 1.4s infinite ease-in-out' : 'none',
              border: '1px solid currentColor',
              content: '""',
            },
          },
          '@keyframes ripple': {
            '0%': { transform: 'scale(.8)', opacity: 1 },
            '100%': { transform: 'scale(2.2)', opacity: 0 },
          },
        }}
      >
        {avatar}
      </Badge>
    );
  }

  return avatar;
});
