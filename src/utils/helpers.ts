export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getChatName(chat: import('@/types').Chat, currentUserId: string): string {
  if (chat.type === 'group') return chat.name || 'Group Chat';
  const otherUser = chat.participants.find((p) => p.id !== currentUserId);
  return otherUser?.username || 'Unknown User';
}

export function getChatAvatar(chat: import('@/types').Chat, currentUserId: string): string | undefined {
  if (chat.type === 'group') return chat.avatar;
  const otherUser = chat.participants.find((p) => p.id !== currentUserId);
  return otherUser?.avatar;
}

export function getOtherUserId(chat: import('@/types').Chat, currentUserId: string): string {
  const otherUser = chat.participants.find((p) => p.id !== currentUserId);
  return otherUser?.id || '';
}

export function debounce<T extends (...args: string[]) => void>(fn: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: string[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  }) as T;
}
