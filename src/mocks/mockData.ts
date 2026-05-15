import { User, Chat, Message } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  username: 'John Doe',
  email: 'john@example.com',
  avatar: undefined,
  isOnline: true,
  lastSeen: null,
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const mockUsers: User[] = [
  mockUser,
  { id: 'user-2', username: 'Sarah Connor', email: 'sarah@example.com', isOnline: true, lastSeen: null, createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 'user-3', username: 'Mike Johnson', email: 'mike@example.com', isOnline: false, lastSeen: '2026-05-15T08:30:00.000Z', createdAt: '2024-02-01T00:00:00.000Z' },
  { id: 'user-4', username: 'Emily Watson', email: 'emily@example.com', isOnline: true, lastSeen: null, createdAt: '2024-03-01T00:00:00.000Z' },
  { id: 'user-5', username: 'Alex Turner', email: 'alex@example.com', isOnline: false, lastSeen: '2026-05-14T22:15:00.000Z', createdAt: '2024-03-15T00:00:00.000Z' },
  { id: 'user-6', username: 'Jessica Lee', email: 'jessica@example.com', isOnline: true, lastSeen: null, createdAt: '2024-04-01T00:00:00.000Z' },
];

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    type: 'private',
    participants: [mockUser, mockUsers[1]],
    lastMessage: { id: 'msg-1', content: 'Hey! How are you doing?', senderId: 'user-2', createdAt: '2026-05-15T10:30:00.000Z', type: 'text' },
    unreadCount: 2,
    createdAt: '2024-06-01T00:00:00.000Z',
    updatedAt: '2026-05-15T10:30:00.000Z',
  },
  {
    id: 'chat-2',
    type: 'private',
    participants: [mockUser, mockUsers[2]],
    lastMessage: { id: 'msg-2', content: 'See you tomorrow!', senderId: 'user-1', createdAt: '2026-05-15T09:15:00.000Z', type: 'text' },
    unreadCount: 0,
    createdAt: '2024-06-02T00:00:00.000Z',
    updatedAt: '2026-05-15T09:15:00.000Z',
  },
  {
    id: 'chat-3',
    type: 'group',
    name: 'Project Team',
    participants: [mockUser, mockUsers[1], mockUsers[2], mockUsers[3]],
    lastMessage: { id: 'msg-3', content: 'The deployment is ready 🚀', senderId: 'user-4', createdAt: '2026-05-15T08:00:00.000Z', type: 'text' },
    unreadCount: 5,
    createdAt: '2024-05-01T00:00:00.000Z',
    updatedAt: '2026-05-15T08:00:00.000Z',
  },
  {
    id: 'chat-4',
    type: 'private',
    participants: [mockUser, mockUsers[3]],
    lastMessage: { id: 'msg-4', content: 'Thanks for the help!', senderId: 'user-4', createdAt: '2026-05-14T18:45:00.000Z', type: 'text' },
    unreadCount: 1,
    createdAt: '2024-07-01T00:00:00.000Z',
    updatedAt: '2026-05-14T18:45:00.000Z',
  },
  {
    id: 'chat-5',
    type: 'group',
    name: 'Weekend Plans',
    participants: [mockUser, mockUsers[1], mockUsers[4], mockUsers[5]],
    lastMessage: { id: 'msg-5', content: 'Who is coming to the party?', senderId: 'user-5', createdAt: '2026-05-14T15:20:00.000Z', type: 'text' },
    unreadCount: 0,
    createdAt: '2024-08-01T00:00:00.000Z',
    updatedAt: '2026-05-14T15:20:00.000Z',
  },
  {
    id: 'chat-6',
    type: 'private',
    participants: [mockUser, mockUsers[4]],
    lastMessage: { id: 'msg-6', content: 'Check out this file', senderId: 'user-5', createdAt: '2026-05-13T11:00:00.000Z', type: 'file' },
    unreadCount: 0,
    createdAt: '2024-09-01T00:00:00.000Z',
    updatedAt: '2026-05-13T11:00:00.000Z',
  },
];

export const mockMessagesByChat: Record<string, Message[]> = {
  'chat-1': [
    { id: 'msg-1-1', chatId: 'chat-1', senderId: 'user-2', senderName: 'Sarah Connor', content: 'Hey John!', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-1', readAt: '2026-05-15T09:01:00.000Z' }], createdAt: '2026-05-15T09:00:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-1-2', chatId: 'chat-1', senderId: 'user-1', senderName: 'John Doe', content: 'Hi Sarah! What\'s up?', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-2', readAt: '2026-05-15T09:05:00.000Z' }], createdAt: '2026-05-15T09:02:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-1-3', chatId: 'chat-1', senderId: 'user-2', senderName: 'Sarah Connor', content: 'Did you finish the project report?', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-1', readAt: '2026-05-15T09:10:00.000Z' }], createdAt: '2026-05-15T09:05:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-1-4', chatId: 'chat-1', senderId: 'user-1', senderName: 'John Doe', content: 'Yes! Just submitted it 10 minutes ago. Let me know if you need any changes.', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-2', readAt: '2026-05-15T09:12:00.000Z' }], createdAt: '2026-05-15T09:10:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-1-5', chatId: 'chat-1', senderId: 'user-2', senderName: 'Sarah Connor', content: 'Perfect! I\'ll review it this afternoon.', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-1', readAt: '2026-05-15T09:15:00.000Z' }], createdAt: '2026-05-15T09:12:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-1-6', chatId: 'chat-1', senderId: 'user-1', senderName: 'John Doe', content: 'Sounds good 👍', type: 'text', status: 'seen', reactions: [{ emoji: '❤️', userId: 'user-2', username: 'Sarah Connor' }], readBy: [{ userId: 'user-2', readAt: '2026-05-15T10:00:00.000Z' }], createdAt: '2026-05-15T09:15:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-1-7', chatId: 'chat-1', senderId: 'user-2', senderName: 'Sarah Connor', content: 'By the way, the team meeting is at 3pm today', type: 'text', status: 'delivered', reactions: [], readBy: [], createdAt: '2026-05-15T10:25:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-1-8', chatId: 'chat-1', senderId: 'user-2', senderName: 'Sarah Connor', content: 'Hey! How are you doing?', type: 'text', status: 'delivered', reactions: [], readBy: [], createdAt: '2026-05-15T10:30:00.000Z', isEdited: false, isDeleted: false },
  ],
  'chat-2': [
    { id: 'msg-2-1', chatId: 'chat-2', senderId: 'user-3', senderName: 'Mike Johnson', content: 'Are we still on for lunch tomorrow?', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-1', readAt: '2026-05-15T09:00:00.000Z' }], createdAt: '2026-05-15T08:50:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-2-2', chatId: 'chat-2', senderId: 'user-1', senderName: 'John Doe', content: 'Absolutely! 12:30 at the usual place?', type: 'text', status: 'delivered', reactions: [], readBy: [], createdAt: '2026-05-15T09:00:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-2-3', chatId: 'chat-2', senderId: 'user-3', senderName: 'Mike Johnson', content: 'Works for me!', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-1', readAt: '2026-05-15T09:10:00.000Z' }], createdAt: '2026-05-15T09:05:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-2-4', chatId: 'chat-2', senderId: 'user-1', senderName: 'John Doe', content: 'See you tomorrow!', type: 'text', status: 'sent', reactions: [], readBy: [], createdAt: '2026-05-15T09:15:00.000Z', isEdited: false, isDeleted: false },
  ],
  'chat-3': [
    { id: 'msg-3-1', chatId: 'chat-3', senderId: 'user-2', senderName: 'Sarah Connor', content: 'Team standup: What did everyone work on yesterday?', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-1', readAt: '2026-05-15T07:35:00.000Z' }], createdAt: '2026-05-15T07:30:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-3-2', chatId: 'chat-3', senderId: 'user-1', senderName: 'John Doe', content: 'I completed the API integration for the payment module', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-2', readAt: '2026-05-15T07:40:00.000Z' }], createdAt: '2026-05-15T07:35:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-3-3', chatId: 'chat-3', senderId: 'user-3', senderName: 'Mike Johnson', content: 'Fixed the login bug and added unit tests', type: 'text', status: 'seen', reactions: [], readBy: [], createdAt: '2026-05-15T07:40:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-3-4', chatId: 'chat-3', senderId: 'user-4', senderName: 'Emily Watson', content: 'I finished the UI redesign mockups. Sharing the Figma link now:', type: 'text', status: 'seen', reactions: [], readBy: [], createdAt: '2026-05-15T07:45:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-3-5', chatId: 'chat-3', senderId: 'user-4', senderName: 'Emily Watson', content: 'https://figma.com/file/example-design', type: 'text', status: 'seen', reactions: [], readBy: [], createdAt: '2026-05-15T07:46:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-3-6', chatId: 'chat-3', senderId: 'user-2', senderName: 'Sarah Connor', content: 'Great work everyone! The sprint is looking good.', type: 'text', status: 'seen', reactions: [], readBy: [], createdAt: '2026-05-15T07:50:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-3-7', chatId: 'chat-3', senderId: 'user-4', senderName: 'Emily Watson', content: 'The deployment is ready 🚀', type: 'text', status: 'delivered', reactions: [{ emoji: '🎉', userId: 'user-1', username: 'John Doe' }, { emoji: '🚀', userId: 'user-2', username: 'Sarah Connor' }, { emoji: '🎉', userId: 'user-3', username: 'Mike Johnson' }], readBy: [], createdAt: '2026-05-15T08:00:00.000Z', isEdited: false, isDeleted: false },
  ],
  'chat-4': [
    { id: 'msg-4-1', chatId: 'chat-4', senderId: 'user-1', senderName: 'John Doe', content: 'Emily, do you need help with the CSS animations?', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-4', readAt: '2026-05-14T18:30:00.000Z' }], createdAt: '2026-05-14T18:20:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-4-2', chatId: 'chat-4', senderId: 'user-4', senderName: 'Emily Watson', content: 'Yes please! I\'m stuck on the transition timing.', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-1', readAt: '2026-05-14T18:35:00.000Z' }], createdAt: '2026-05-14T18:30:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-4-3', chatId: 'chat-4', senderId: 'user-1', senderName: 'John Doe', content: 'Try using cubic-bezier(0.4, 0, 0.2, 1) for a smooth ease-in-out effect', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-4', readAt: '2026-05-14T18:40:00.000Z' }], createdAt: '2026-05-14T18:35:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-4-4', chatId: 'chat-4', senderId: 'user-4', senderName: 'Emily Watson', content: 'That worked perfectly! Thanks for the help!', type: 'text', status: 'delivered', reactions: [], readBy: [], createdAt: '2026-05-14T18:45:00.000Z', isEdited: false, isDeleted: false },
  ],
  'chat-5': [
    { id: 'msg-5-1', chatId: 'chat-5', senderId: 'user-1', senderName: 'John Doe', content: 'So Saturday at 7pm?', type: 'text', status: 'seen', reactions: [], readBy: [], createdAt: '2026-05-14T14:00:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-5-2', chatId: 'chat-5', senderId: 'user-6', senderName: 'Jessica Lee', content: 'I\'m in! Should I bring anything?', type: 'text', status: 'seen', reactions: [], readBy: [], createdAt: '2026-05-14T14:30:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-5-3', chatId: 'chat-5', senderId: 'user-2', senderName: 'Sarah Connor', content: 'Maybe some snacks? I\'ll bring drinks', type: 'text', status: 'seen', reactions: [], readBy: [], createdAt: '2026-05-14T15:00:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-5-4', chatId: 'chat-5', senderId: 'user-5', senderName: 'Alex Turner', content: 'Who is coming to the party?', type: 'text', status: 'delivered', reactions: [], readBy: [], createdAt: '2026-05-14T15:20:00.000Z', isEdited: false, isDeleted: false },
  ],
  'chat-6': [
    { id: 'msg-6-1', chatId: 'chat-6', senderId: 'user-5', senderName: 'Alex Turner', content: 'Here\'s the document you requested', type: 'text', status: 'seen', reactions: [], readBy: [{ userId: 'user-1', readAt: '2026-05-13T11:05:00.000Z' }], createdAt: '2026-05-13T10:55:00.000Z', isEdited: false, isDeleted: false },
    { id: 'msg-6-2', chatId: 'chat-6', senderId: 'user-5', senderName: 'Alex Turner', content: 'Check out this file', type: 'file', status: 'seen', fileUrl: '#', fileName: 'project-specs.pdf', fileSize: 2458624, reactions: [], readBy: [{ userId: 'user-1', readAt: '2026-05-13T11:05:00.000Z' }], createdAt: '2026-05-13T11:00:00.000Z', isEdited: false, isDeleted: false },
  ],
};
