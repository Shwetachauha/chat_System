import { User } from './user';

export interface CallLog {
  id: string;
  callerId: string;
  receiverId: string;
  type: 'AUDIO' | 'VIDEO';
  status: 'MISSED' | 'ANSWERED' | 'REJECTED';
  duration: number;
  startedAt: string;
  endedAt: string | null;
  caller: User;
  receiver: User;
}
