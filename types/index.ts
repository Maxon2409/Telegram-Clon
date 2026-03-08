export interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
  isGroup?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  isOutgoing: boolean;
  isRead?: boolean;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  phone?: string;
}
