export enum ClientEvent {
  JOIN_CHAT = 'join_chat',
  LEAVE_CHAT = 'leave_chat',
  SEND_MESSAGE = 'send_message',
  TYPING_START = 'typing_start',
  TYPING_STOP = 'typing_stop',
  MARK_READ = 'mark_read',
  USER_ONLINE = 'user_online',
  USER_OFFLINE = 'user_offline',
  CREATE_GROUP = 'create_group',
  ADD_GROUP_MEMBER = 'add_group_member',
  REMOVE_GROUP_MEMBER = 'remove_group_member',
  DELETE_MESSAGE = 'delete_message',
  EDIT_MESSAGE = 'edit_message',
}

export enum ServerEvent {
  MESSAGE_RECEIVED = 'message_received',
  MESSAGE_SENT_ACK = 'message_sent_ack',
  TYPING = 'typing',
  STOP_TYPING = 'stop_typing',
  READ_RECEIPT = 'read_receipt',
  ONLINE_STATUS = 'online_status',
  USER_JOINED_GROUP = 'user_joined_group',
  USER_REMOVED_GROUP = 'user_removed_group',
  MESSAGE_DELETED = 'message_deleted',
  MESSAGE_UPDATED = 'message_updated',
  CHAT_CREATED = 'chat_created',
  ERROR = 'socket_error',
}

export interface TypingEvent {
  chatId: string;
  userId: string;
  username: string;
}

export interface OnlineStatusEvent {
  userId: string;
  isOnline: boolean;
  lastSeen: string | null;
}

export interface ReadReceiptEvent {
  chatId: string;
  messageId: string;
  userId: string;
  readAt: string;
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
