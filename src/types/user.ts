export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: string | null;
  createdAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  phone?: string;
}
