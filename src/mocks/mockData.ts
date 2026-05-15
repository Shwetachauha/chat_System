import { User, Chat, Message } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: undefined,
  isOnline: true,
  lastSeen: null,
};

export const mockUsers: User[] = [
  mockUser,
  { id: 'user-2', name: 'Sarah Connor', email: 'sarah@example.com', isOnline: true, lastSeen: null },
  { id: 'user-3', name: 'Mike Johnson', email: 'mike@example.com', isOnline: false, lastSeen: '2026-05-15T08:30:00.000Z' },
  { id: 'user-4', name: 'Emily Watson', email: 'emily@example.com', isOnline: true, lastSeen: null },
  { id: 'user-5', name: 'Alex Turner', email: 'alex@example.com', isOnline: false, lastSeen: '2026-05-14T22:15:00.000Z' },
  { id: 'user-6', name: 'Jessica Lee', email: 'jessica@example.com', isOnline: true, lastSeen: null },
];

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    isGroupChat: false,
    chatWith: { id: 'user-2', name: 'Sarah Connor', avatar: undefined, isOnline: true, lastSeen: null },
    groupName: null,
    groupAdmin: null,
    members: [{ id: 'user-1', name: 'John Doe' }, { id: 'user-2', name: 'Sarah Connor' }],
    latestMessage: { content: 'Hey! How are you doing?', type: 'TEXT', sender: { name: 'Sarah Connor' }, createdAt: '2026-05-15T10:30:00.000Z' },
    unreadCount: 2,
    updatedAt: '2026-05-15T10:30:00.000Z',
  },
  {
    id: 'chat-2',
    isGroupChat: false,
    chatWith: { id: 'user-3', name: 'Mike Johnson', avatar: undefined, isOnline: false, lastSeen: '2026-05-15T08:30:00.000Z' },
    groupName: null,
    groupAdmin: null,
    members: [{ id: 'user-1', name: 'John Doe' }, { id: 'user-3', name: 'Mike Johnson' }],
    latestMessage: { content: 'See you tomorrow!', type: 'TEXT', sender: { name: 'John Doe' }, createdAt: '2026-05-15T09:15:00.000Z' },
    unreadCount: 0,
    updatedAt: '2026-05-15T09:15:00.000Z',
  },
  {
    id: 'chat-3',
    isGroupChat: true,
    chatWith: null,
    groupName: 'Project Team',
    groupAdmin: { id: 'user-2', name: 'Sarah Connor' },
    members: [{ id: 'user-1', name: 'John Doe' }, { id: 'user-2', name: 'Sarah Connor' }, { id: 'user-3', name: 'Mike Johnson' }, { id: 'user-4', name: 'Emily Watson' }],
    latestMessage: { content: 'The deployment is ready 🚀', type: 'TEXT', sender: { name: 'Emily Watson' }, createdAt: '2026-05-15T08:00:00.000Z' },
    unreadCount: 5,
    updatedAt: '2026-05-15T08:00:00.000Z',
  },
  {
    id: 'chat-4',
    isGroupChat: false,
    chatWith: { id: 'user-4', name: 'Emily Watson', avatar: undefined, isOnline: true, lastSeen: null },
    groupName: null,
    groupAdmin: null,
    members: [{ id: 'user-1', name: 'John Doe' }, { id: 'user-4', name: 'Emily Watson' }],
    latestMessage: { content: 'Thanks for the help!', type: 'TEXT', sender: { name: 'Emily Watson' }, createdAt: '2026-05-14T18:45:00.000Z' },
    unreadCount: 1,
    updatedAt: '2026-05-14T18:45:00.000Z',
  },
  {
    id: 'chat-5',
    isGroupChat: true,
    chatWith: null,
    groupName: 'Weekend Plans',
    groupAdmin: { id: 'user-1', name: 'John Doe' },
    members: [{ id: 'user-1', name: 'John Doe' }, { id: 'user-2', name: 'Sarah Connor' }, { id: 'user-5', name: 'Alex Turner' }, { id: 'user-6', name: 'Jessica Lee' }],
    latestMessage: { content: 'Who is coming to the party?', type: 'TEXT', sender: { name: 'Alex Turner' }, createdAt: '2026-05-14T15:20:00.000Z' },
    unreadCount: 0,
    updatedAt: '2026-05-14T15:20:00.000Z',
  },
  {
    id: 'chat-6',
    isGroupChat: false,
    chatWith: { id: 'user-5', name: 'Alex Turner', avatar: undefined, isOnline: false, lastSeen: '2026-05-14T22:15:00.000Z' },
    groupName: null,
    groupAdmin: null,
    members: [{ id: 'user-1', name: 'John Doe' }, { id: 'user-5', name: 'Alex Turner' }],
    latestMessage: { content: 'Check out this file', type: 'FILE', sender: { name: 'Alex Turner' }, createdAt: '2026-05-13T11:00:00.000Z' },
    unreadCount: 0,
    updatedAt: '2026-05-13T11:00:00.000Z',
  },
];

export const mockMessagesByChat: Record<string, Message[]> = {
  'chat-1': [
    { id: 'msg-1-1', chatId: 'chat-1', sender: { id: 'user-2', name: 'Sarah Connor' }, content: 'Hey John!', type: 'TEXT', readBy: [{ userId: 'user-1' }], createdAt: '2026-05-15T09:00:00.000Z' },
    { id: 'msg-1-2', chatId: 'chat-1', sender: { id: 'user-1', name: 'John Doe' }, content: 'Hi Sarah! What\'s up?', type: 'TEXT', readBy: [{ userId: 'user-2' }], createdAt: '2026-05-15T09:02:00.000Z' },
    { id: 'msg-1-3', chatId: 'chat-1', sender: { id: 'user-2', name: 'Sarah Connor' }, content: 'Did you finish the project report?', type: 'TEXT', readBy: [{ userId: 'user-1' }], createdAt: '2026-05-15T09:05:00.000Z' },
    { id: 'msg-1-4', chatId: 'chat-1', sender: { id: 'user-1', name: 'John Doe' }, content: 'Yes! Just submitted it 10 minutes ago.', type: 'TEXT', readBy: [{ userId: 'user-2' }], createdAt: '2026-05-15T09:10:00.000Z' },
    { id: 'msg-1-5', chatId: 'chat-1', sender: { id: 'user-2', name: 'Sarah Connor' }, content: 'Perfect! I\'ll review it this afternoon.', type: 'TEXT', readBy: [{ userId: 'user-1' }], createdAt: '2026-05-15T09:12:00.000Z' },
    { id: 'msg-1-6', chatId: 'chat-1', sender: { id: 'user-1', name: 'John Doe' }, content: 'Sounds good 👍', type: 'TEXT', readBy: [{ userId: 'user-2' }], createdAt: '2026-05-15T09:15:00.000Z' },
    { id: 'msg-1-7', chatId: 'chat-1', sender: { id: 'user-2', name: 'Sarah Connor' }, content: 'By the way, the team meeting is at 3pm today', type: 'TEXT', readBy: [], createdAt: '2026-05-15T10:25:00.000Z' },
    { id: 'msg-1-8', chatId: 'chat-1', sender: { id: 'user-2', name: 'Sarah Connor' }, content: 'Hey! How are you doing?', type: 'TEXT', readBy: [], createdAt: '2026-05-15T10:30:00.000Z' },
  ],
  'chat-2': [
    { id: 'msg-2-1', chatId: 'chat-2', sender: { id: 'user-3', name: 'Mike Johnson' }, content: 'Are we still on for lunch tomorrow?', type: 'TEXT', readBy: [{ userId: 'user-1' }], createdAt: '2026-05-15T08:50:00.000Z' },
    { id: 'msg-2-2', chatId: 'chat-2', sender: { id: 'user-1', name: 'John Doe' }, content: 'Absolutely! 12:30 at the usual place?', type: 'TEXT', readBy: [], createdAt: '2026-05-15T09:00:00.000Z' },
    { id: 'msg-2-3', chatId: 'chat-2', sender: { id: 'user-3', name: 'Mike Johnson' }, content: 'Works for me!', type: 'TEXT', readBy: [{ userId: 'user-1' }], createdAt: '2026-05-15T09:05:00.000Z' },
    { id: 'msg-2-4', chatId: 'chat-2', sender: { id: 'user-1', name: 'John Doe' }, content: 'See you tomorrow!', type: 'TEXT', readBy: [], createdAt: '2026-05-15T09:15:00.000Z' },
  ],
  'chat-3': [
    { id: 'msg-3-1', chatId: 'chat-3', sender: { id: 'user-2', name: 'Sarah Connor' }, content: 'Team standup: What did everyone work on yesterday?', type: 'TEXT', readBy: [{ userId: 'user-1' }], createdAt: '2026-05-15T07:30:00.000Z' },
    { id: 'msg-3-2', chatId: 'chat-3', sender: { id: 'user-1', name: 'John Doe' }, content: 'I completed the API integration for the payment module', type: 'TEXT', readBy: [{ userId: 'user-2' }], createdAt: '2026-05-15T07:35:00.000Z' },
    { id: 'msg-3-3', chatId: 'chat-3', sender: { id: 'user-3', name: 'Mike Johnson' }, content: 'Fixed the login bug and added unit tests', type: 'TEXT', readBy: [], createdAt: '2026-05-15T07:40:00.000Z' },
    { id: 'msg-3-4', chatId: 'chat-3', sender: { id: 'user-4', name: 'Emily Watson' }, content: 'The deployment is ready 🚀', type: 'TEXT', readBy: [], createdAt: '2026-05-15T08:00:00.000Z' },
  ],
  'chat-4': [
    { id: 'msg-4-1', chatId: 'chat-4', sender: { id: 'user-1', name: 'John Doe' }, content: 'Emily, do you need help with the CSS animations?', type: 'TEXT', readBy: [{ userId: 'user-4' }], createdAt: '2026-05-14T18:20:00.000Z' },
    { id: 'msg-4-2', chatId: 'chat-4', sender: { id: 'user-4', name: 'Emily Watson' }, content: 'Yes please! I\'m stuck on the transition timing.', type: 'TEXT', readBy: [{ userId: 'user-1' }], createdAt: '2026-05-14T18:30:00.000Z' },
    { id: 'msg-4-3', chatId: 'chat-4', sender: { id: 'user-1', name: 'John Doe' }, content: 'Try using cubic-bezier(0.4, 0, 0.2, 1)', type: 'TEXT', readBy: [{ userId: 'user-4' }], createdAt: '2026-05-14T18:35:00.000Z' },
    { id: 'msg-4-4', chatId: 'chat-4', sender: { id: 'user-4', name: 'Emily Watson' }, content: 'Thanks for the help!', type: 'TEXT', readBy: [], createdAt: '2026-05-14T18:45:00.000Z' },
  ],
  'chat-5': [
    { id: 'msg-5-1', chatId: 'chat-5', sender: { id: 'user-1', name: 'John Doe' }, content: 'So Saturday at 7pm?', type: 'TEXT', readBy: [], createdAt: '2026-05-14T14:00:00.000Z' },
    { id: 'msg-5-2', chatId: 'chat-5', sender: { id: 'user-6', name: 'Jessica Lee' }, content: 'I\'m in! Should I bring anything?', type: 'TEXT', readBy: [], createdAt: '2026-05-14T14:30:00.000Z' },
    { id: 'msg-5-3', chatId: 'chat-5', sender: { id: 'user-2', name: 'Sarah Connor' }, content: 'Maybe some snacks? I\'ll bring drinks', type: 'TEXT', readBy: [], createdAt: '2026-05-14T15:00:00.000Z' },
    { id: 'msg-5-4', chatId: 'chat-5', sender: { id: 'user-5', name: 'Alex Turner' }, content: 'Who is coming to the party?', type: 'TEXT', readBy: [], createdAt: '2026-05-14T15:20:00.000Z' },
  ],
  'chat-6': [
    { id: 'msg-6-1', chatId: 'chat-6', sender: { id: 'user-5', name: 'Alex Turner' }, content: 'Here\'s the document you requested', type: 'TEXT', readBy: [{ userId: 'user-1' }], createdAt: '2026-05-13T10:55:00.000Z' },
    { id: 'msg-6-2', chatId: 'chat-6', sender: { id: 'user-5', name: 'Alex Turner' }, content: 'Check out this file', type: 'FILE', fileUrl: '#', fileName: 'project-specs.pdf', readBy: [{ userId: 'user-1' }], createdAt: '2026-05-13T11:00:00.000Z' },
  ],
};
