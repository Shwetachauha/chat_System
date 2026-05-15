import { Socket } from 'socket.io-client';

export function registerGroupHandlers(_socket: Socket): void {
  // Group management (create, add/remove member) is handled via REST API.
  // Socket only handles real-time messaging and presence.
}
