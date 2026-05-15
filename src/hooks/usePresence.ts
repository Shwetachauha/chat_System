import { useAppSelector } from './useAuth';
import { selectIsUserOnline, selectUserLastSeen } from '@/store/selectors/presenceSelectors';

export function usePresence(userId: string) {
  const isOnline = useAppSelector(selectIsUserOnline(userId));
  const lastSeen = useAppSelector(selectUserLastSeen(userId));

  const getLastSeenText = (): string => {
    if (isOnline) return 'Active now';
    if (!lastSeen) return '';

    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Last seen just now';
    if (diffMins < 60) return `Last seen ${diffMins} min ago`;
    if (diffHours < 24) return `Last seen ${diffHours}h ago`;
    if (diffDays < 7) return `Last seen ${diffDays}d ago`;
    return `Last seen ${lastSeenDate.toLocaleDateString()}`;
  };

  return {
    isOnline,
    lastSeen,
    getLastSeenText,
  };
}
