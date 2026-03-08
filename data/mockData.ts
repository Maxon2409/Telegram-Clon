import { Chat, Message } from '@/types';

export const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Мама',
    lastMessage: 'Привет! Как дела?',
    lastMessageTime: '12:30',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Рабочий чат',
    lastMessage: 'Алексей: Ок, встреча в 15:00',
    lastMessageTime: '11:45',
    isGroup: true,
  },
  {
    id: '3',
    name: 'Иван Петров',
    lastMessage: 'Отправил фото',
    lastMessageTime: 'Вчера',
  },
  {
    id: '4',
    name: 'Tech News',
    lastMessage: 'Новости: Вышел React Native 0.76',
    lastMessageTime: '09:00',
    isGroup: true,
  },
];

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      chatId: '1',
      text: 'Привет! Как дела?',
      senderId: 'other',
      senderName: 'Мама',
      timestamp: '12:30',
      isOutgoing: false,
    },
    {
      id: 'm2',
      chatId: '1',
      text: 'Привет! Всё отлично, работаю над проектом',
      senderId: 'me',
      senderName: 'Я',
      timestamp: '12:31',
      isOutgoing: true,
      isRead: true,
    },
    {
      id: 'm3',
      chatId: '1',
      text: 'Это здорово! Не забудь позвонить вечером',
      senderId: 'other',
      senderName: 'Мама',
      timestamp: '12:32',
      isOutgoing: false,
    },
  ],
  '2': [
    {
      id: 'm4',
      chatId: '2',
      text: 'Ок, встреча в 15:00 у конференц-зала',
      senderId: 'alexey',
      senderName: 'Алексей',
      timestamp: '11:45',
      isOutgoing: false,
    },
  ],
  '3': [
    {
      id: 'm5',
      chatId: '3',
      text: 'Смотри какое фото с отпуска!',
      senderId: 'other',
      senderName: 'Иван',
      timestamp: 'Вчера',
      isOutgoing: false,
    },
  ],
  '4': [
    {
      id: 'm6',
      chatId: '4',
      text: 'Вышел React Native 0.76 с новыми возможностями',
      senderId: 'channel',
      senderName: 'Tech News',
      timestamp: '09:00',
      isOutgoing: false,
    },
  ],
};
