export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  isOnline?: boolean;
  lastSeen?: string | null;
  createdAt?: string;
}

export interface UserProfile extends User {
  bio?: string;
  phone?: string;
}
