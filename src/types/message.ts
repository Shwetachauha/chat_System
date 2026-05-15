import { MessageType, MessageStatus } from './chat';

export interface Reaction {
  emoji: string;
  userId: string;
  username: string;
}

export interface MessageSender {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  tempId?: string;
  chatId: string;
  sender: MessageSender;
  content: string;
  type: MessageType;
  status?: MessageStatus;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileMimeType?: string;
  thumbnailUrl?: string;
  replyTo?: string;
  forwardedFrom?: {
    chatId: string;
    chatName: string;
    messageId: string;
  };
  reactions?: Reaction[];
  readBy: { userId: string }[];
  createdAt: string;
  updatedAt?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface ReadReceipt {
  userId: string;
  readAt?: string;
}

export interface MessagesByChatId {
  [chatId: string]: {
    ids: string[];
    entities: Record<string, Message>;
    hasMore: boolean;
    cursor: string | null;
    isLoading: boolean;
  };
}

export interface MessageState {
  messagesByChatId: MessagesByChatId;
  pendingMessages: Message[];
  failedMessages: Message[];
}

export interface SendMessagePayload {
  chatId: string;
  content: string;
  type: MessageType;
  tempId: string;
  file?: File;
  replyTo?: string;
}

export interface PaginationParams {
  chatId: string;
  cursor?: string;
  limit?: number;
}
