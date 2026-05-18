export enum ClientEvent {
  JOIN_CHAT = 'join_chat',
  LEAVE_CHAT = 'leave_chat',
  TYPING = 'typing',
  STOP_TYPING = 'stop_typing',
  MARK_READ = 'mark_read',
  DELETE_MESSAGE = 'delete_message',
  EDIT_MESSAGE = 'message:edit',
  REACT_MESSAGE = 'react_message',
  GROUP_UPDATE = 'group:update',
  CALL_INITIATE = 'call:initiate',
  CALL_OFFER = 'call:offer',
  CALL_ANSWER = 'call:answer',
  CALL_ICE_CANDIDATE = 'call:ice-candidate',
  CALL_REJECT = 'call:reject',
  CALL_END = 'call:end',
}

export enum ServerEvent {
  MESSAGE_RECEIVED = 'message_received',
  MESSAGE_DELETED = 'message_deleted',
  MESSAGE_EDITED = 'message_edited',
  MESSAGE_REACTION = 'message_reaction',
  TYPING = 'typing',
  STOP_TYPING = 'stop_typing',
  READ_RECEIPT = 'read_receipt',
  ONLINE_STATUS = 'online_status',
  GROUP_UPDATED = 'group_updated',
  ERROR = 'error',
  CALL_INCOMING = 'call:incoming',
  CALL_OFFER = 'call:offer',
  CALL_ANSWER = 'call:answer',
  CALL_ICE_CANDIDATE = 'call:ice-candidate',
  CALL_REJECTED = 'call:rejected',
  CALL_ENDED = 'call:ended',
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
