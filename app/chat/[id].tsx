import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockChats } from '@/data/mockData';
import { mockMessages } from '@/data/mockData';
import type { Message } from '@/types';

function MessageBubble({ message }: { message: Message }) {
  return (
    <View
      style={[
        styles.messageBubble,
        message.isOutgoing ? styles.outgoingBubble : styles.incomingBubble,
      ]}
    >
      <Text style={styles.messageText}>{message.text}</Text>
      <View style={styles.messageFooter}>
        <Text style={styles.messageTime}>{message.timestamp}</Text>
        {message.isOutgoing && (
          message.isRead ? (
            <Ionicons name="checkmark-done" size={16} color="#54A9EB" />
          ) : (
            <Ionicons name="checkmark-done" size={16} color="#8E8E93" />
          )
        )}
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [inputText, setInputText] = useState('');

  const chat = mockChats.find((c) => c.id === id);
  const messages = (id && mockMessages[id]) || [];

  const chatName = chat?.name ?? 'Чат';

  const sendMessage = () => {
    if (!inputText.trim()) return;
    // TODO: add real message sending
    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <SafeAreaView style={styles.safeHeader} edges={['top']}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
              {chatName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{chatName}</Text>
            {chat?.isOnline && (
              <Text style={styles.headerSubtitle}>в сети</Text>
            )}
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="videocam" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        </View>
      </SafeAreaView>

      <View style={styles.chatBackground}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageRow,
                item.isOutgoing ? styles.messageRowOutgoing : styles.messageRowIncoming,
              ]}
            >
              <MessageBubble message={item} />
            </View>
          )}
          contentContainerStyle={styles.messagesList}
          inverted={false}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle" size={32} color="#0088CC" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Сообщение"
            placeholderTextColor="#8E8E93"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={4096}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={22}
              color={inputText.trim() ? '#0088CC' : '#8E8E93'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0088CC',
  },
  safeHeader: {
    backgroundColor: '#0088CC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: '#0088CC',
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  headerButton: {
    padding: 8,
  },
  chatBackground: {
    flex: 1,
    backgroundColor: '#E4DDD6',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  messagesList: {
    padding: 12,
    paddingBottom: 8,
  },
  messageRow: {
    marginBottom: 8,
  },
  messageRowIncoming: {
    alignItems: 'flex-start',
  },
  messageRowOutgoing: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    paddingBottom: 6,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  outgoingBubble: {
    backgroundColor: '#EFFEDE',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 18,
  },
  incomingBubble: {
    backgroundColor: '#fff',
    borderBottomRightRadius: 18,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: '#F0F0F0',
    gap: 8,
  },
  attachButton: {
    marginBottom: 4,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    maxHeight: 120,
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    padding: 6,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
