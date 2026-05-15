import { User } from './user';

export interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string;
  avatar?: string;
  participants: User[];
  lastMessage: MessagePreview | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  admin?: string;
}

export interface MessagePreview {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  type: MessageType;
}

export type MessageType = 'text' | 'image' | 'file' | 'video' | 'audio' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'seen' | 'failed';

export interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  isLoading: boolean;
  error: string | null;
}
