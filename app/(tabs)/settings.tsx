import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

const settingsSections: SettingsItem[][] = [
  [
    { id: '1', icon: 'person', title: 'Редактировать профиль' },
    { id: '2', icon: 'notifications', title: 'Уведомления и звуки' },
    { id: '3', icon: 'lock-closed', title: 'Конфиденциальность' },
    { id: '4', icon: 'phone-portrait', title: 'Данные и память' },
    { id: '5', icon: 'chatbubble', title: 'Чаты' },
  ],
  [
    { id: '6', icon: 'brush', title: 'Оформление' },
    { id: '7', icon: 'language', title: 'Язык' },
  ],
  [
    { id: '8', icon: 'help-circle', title: 'Вопросы о Telegram' },
    { id: '9', icon: 'bug', title: 'Сообщить о проблеме' },
  ],
  [
    { id: '10', icon: 'log-out', title: 'Выйти из аккаунта' },
  ],
];

function SettingsSection({ items, onLogout }: { items: SettingsItem[]; onLogout?: () => void }) {
  return (
    <View style={styles.section}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.settingItem, item.id === '10' && styles.logoutItem]}
          activeOpacity={0.7}
          onPress={item.id === '10' ? onLogout : undefined}
        >
          <View style={styles.settingLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={22} color="#0088CC" />
            </View>
            <View>
              <Text style={styles.settingTitle}>{item.title}</Text>
              {item.subtitle && (
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              )}
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Выйти из аккаунта',
      'Вы уверены?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0] || ''}`.toUpperCase()
    : '?';
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Мой аккаунт';
  const displayPhone = user?.phone || '+7 *** *** ** **';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitials}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profilePhone}>{displayPhone}</Text>
        </View>
      </View>

      {settingsSections.map((section, index) => (
        <SettingsSection
          key={index}
          items={section}
          onLogout={section.some((i) => i.id === '10') ? handleLogout : undefined}
        />
      ))}

      <Text style={styles.version}>Telegram Clon v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0088CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 16,
    color: '#8E8E93',
  },
  section: {
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 17,
    color: '#000',
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: 20,
  },
  settingSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 2,
  },
  version: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 24,
  },
});
