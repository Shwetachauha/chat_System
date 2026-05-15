export enum ClientEvent {
  JOIN_CHAT = 'join_chat',
  LEAVE_CHAT = 'leave_chat',
  TYPING = 'typing',
  STOP_TYPING = 'stop_typing',
  MARK_READ = 'mark_read',
  REACT_MESSAGE = 'react_message',
}

export enum ServerEvent {
  MESSAGE_RECEIVED = 'message_received',
  MESSAGE_DELETED = 'message_deleted',
  MESSAGE_REACTION = 'message_reaction',
  TYPING = 'typing',
  STOP_TYPING = 'stop_typing',
  READ_RECEIPT = 'read_receipt',
  ONLINE_STATUS = 'online_status',
  ERROR = 'socket_error',
}

export interface TypingEvent {
  chatId: string;
  userId: string;
}

export interface OnlineStatusEvent {
  userId: string;
  isOnline: boolean;
  lastSeen?: string | null;
}

export interface ReadReceiptEvent {
  chatId: string;
  userId: string;
}

export interface MessageAckEvent {
  tempId: string;
  message: import('./message').Message;
}

export interface MessageDeletedEvent {
  chatId: string;
  messageId: string;
}

export interface MessageUpdatedEvent {
  chatId: string;
  message: import('./message').Message;
}
