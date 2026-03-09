import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import {
  loadSettings,
  saveSettings,
  type AllSettings,
  type NotificationsSettings,
  type PrivacySettings,
  type DataSettings,
  type ChatsSettings,
  type AppearanceSettings,
  type LanguageSettings,
} from '@/services/settingsStorage';

const sectionTitles: Record<string, string> = {
  '1': 'Редактировать профиль',
  '2': 'Уведомления и звуки',
  '3': 'Конфиденциальность',
  '4': 'Данные и память',
  '5': 'Чаты',
  '6': 'Оформление',
  '7': 'Язык',
  '8': 'Вопросы о Telegram',
  '9': 'Сообщить о проблеме',
};

export default function SettingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const sectionId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
  const title = (sectionId && sectionTitles[sectionId]) || 'Настройка';

  useEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  if (!sectionId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Неизвестный раздел</Text>
      </View>
    );
  }

  switch (sectionId) {
    case '1':
      return <EditProfileScreen />;
    case '2':
      return <NotificationsScreen />;
    case '3':
      return <PrivacyScreen />;
    case '4':
      return <DataScreen />;
    case '5':
      return <ChatsScreen />;
    case '6':
      return <AppearanceScreen />;
    case '7':
      return <LanguageScreen />;
    case '8':
      return <TelegramHelpScreen />;
    case '9':
      return <ReportProblemScreen />;
    default:
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Раздел ещё не реализован</Text>
        </View>
      );
  }
}

function SectionContainer({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {children}
    </ScrollView>
  );
}

function Row({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle?: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function EditProfileScreen() {
  const { user, login } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const phone = user?.phone ?? '';
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const fName = firstName.trim();
    const lName = lastName.trim();
    if (!user || !fName) return;
    setSaving(true);
    try {
      await login({
        ...user,
        firstName: fName,
        lastName: lName,
      });
      Alert.alert('Профиль', 'Изменения сохранены');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionContainer>
      <Text style={styles.label}>Имя</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Имя"
        placeholderTextColor="#999"
        autoCapitalize="words"
      />
      <Text style={styles.label}>Фамилия</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Фамилия (необязательно)"
        placeholderTextColor="#999"
        autoCapitalize="words"
      />
      <Text style={styles.label}>Номер телефона</Text>
      <Text style={styles.phoneValue}>{phone || 'Не указан'}</Text>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          (!firstName.trim() || saving) && styles.primaryButtonDisabled,
        ]}
        onPress={handleSave}
        disabled={!firstName.trim() || saving}
      >
        <Text style={styles.primaryButtonText}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Text>
      </TouchableOpacity>
    </SectionContainer>
  );
}

function NotificationsScreen() {
  const [settings, setSettings] = useState<NotificationsSettings | null>(null);

  useEffect(() => {
    loadSettings().then((s) => setSettings(s.notifications));
  }, []);

  const update = (patch: Partial<NotificationsSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings({ notifications: next } as Partial<AllSettings>);
  };

  if (!settings) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Загрузка настроек...</Text>
      </View>
    );
  }

  return (
    <SectionContainer>
      <Row
        title="Уведомления"
        subtitle="Показывать уведомления о новых сообщениях"
        value={settings.enabled}
        onChange={(v) => update({ enabled: v })}
      />
      <Row
        title="Звук уведомлений"
        subtitle="Проигрывать звук при входящих сообщениях"
        value={settings.sounds}
        onChange={(v) => update({ sounds: v })}
      />
      <Row
        title="Звуки в приложении"
        subtitle="Клики клавиатуры и другие звуки"
        value={settings.inAppSounds}
        onChange={(v) => update({ inAppSounds: v })}
      />
      <Row
        title="Предпросмотр"
        subtitle="Показывать текст сообщения в уведомлении"
        value={settings.previews}
        onChange={(v) => update({ previews: v })}
      />
    </SectionContainer>
  );
}

function PrivacyScreen() {
  const [settings, setSettings] = useState<PrivacySettings | null>(null);

  useEffect(() => {
    loadSettings().then((s) => setSettings(s.privacy));
  }, []);

  const update = (patch: Partial<PrivacySettings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings({ privacy: next } as Partial<AllSettings>);
  };

  if (!settings) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Загрузка настроек...</Text>
      </View>
    );
  }

  return (
    <SectionContainer>
      <Row
        title="Последняя активность"
        subtitle="Показывать другим, когда вы были онлайн"
        value={settings.showLastSeen}
        onChange={(v) => update({ showLastSeen: v })}
      />
      <Row
        title="Статус «в сети»"
        subtitle="Показывать, когда вы онлайн"
        value={settings.showOnlineStatus}
        onChange={(v) => update({ showOnlineStatus: v })}
      />
      <Row
        title="Показывать номер телефона"
        subtitle="Ваш номер виден вашим контактам"
        value={settings.showPhoneNumber}
        onChange={(v) => update({ showPhoneNumber: v })}
      />
    </SectionContainer>
  );
}

function DataScreen() {
  const [settings, setSettings] = useState<DataSettings | null>(null);

  useEffect(() => {
    loadSettings().then((s) => setSettings(s.data));
  }, []);

  const update = (patch: Partial<DataSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings({ data: next } as Partial<AllSettings>);
  };

  if (!settings) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Загрузка настроек...</Text>
      </View>
    );
  }

  return (
    <SectionContainer>
      <Row
        title="Автозагрузка по Wi‑Fi"
        subtitle="Фото и видео автоматически загружаются по Wi‑Fi"
        value={settings.autoDownloadWifi}
        onChange={(v) => update({ autoDownloadWifi: v })}
      />
      <Row
        title="Автозагрузка по мобильной сети"
        subtitle="Может расходовать мобильный трафик"
        value={settings.autoDownloadMobile}
        onChange={(v) => update({ autoDownloadMobile: v })}
      />
      <Row
        title="Сохранять в галерею"
        subtitle="Новые медиа автоматически появляются в галерее"
        value={settings.saveToGallery}
        onChange={(v) => update({ saveToGallery: v })}
      />
    </SectionContainer>
  );
}

function ChatsScreen() {
  const [settings, setSettings] = useState<ChatsSettings | null>(null);

  useEffect(() => {
    loadSettings().then((s) => setSettings(s.chats));
  }, []);

  const update = (patch: Partial<ChatsSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings({ chats: next } as Partial<AllSettings>);
  };

  if (!settings) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Загрузка настроек...</Text>
      </View>
    );
  }

  const setTextSize = (size: ChatsSettings['textSize']) => {
    update({ textSize: size });
  };

  return (
    <SectionContainer>
      <Text style={styles.label}>Размер текста в чатах</Text>
      <View style={styles.segmentRow}>
        {(['small', 'normal', 'large'] as const).map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.segmentButton,
              settings.textSize === size && styles.segmentButtonActive,
            ]}
            onPress={() => setTextSize(size)}
          >
            <Text
              style={[
                styles.segmentButtonText,
                settings.textSize === size && styles.segmentButtonTextActive,
              ]}
            >
              {size === 'small' ? 'Маленький' : size === 'normal' ? 'Обычный' : 'Крупный'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Row
        title="Архивированные чаты сверху"
        value={settings.archiveOnTop}
        onChange={(v) => update({ archiveOnTop: v })}
      />
      <Row
        title="Системные уведомления в чате"
        subtitle="Показывать служебные сообщения (присоединился, вышел и т.п.)"
        value={settings.showServiceNotifications}
        onChange={(v) => update({ showServiceNotifications: v })}
      />
    </SectionContainer>
  );
}

function AppearanceScreen() {
  const [settings, setSettings] = useState<AppearanceSettings | null>(null);

  useEffect(() => {
    loadSettings().then((s) => setSettings(s.appearance));
  }, []);

  const update = (patch: Partial<AppearanceSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings({ appearance: next } as Partial<AllSettings>);
  };

  if (!settings) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Загрузка настроек...</Text>
      </View>
    );
  }

  const setTheme = (theme: AppearanceSettings['theme']) => {
    update({ theme });
  };

  return (
    <SectionContainer>
      <Text style={styles.label}>Тема оформления</Text>
      <View style={styles.segmentRow}>
        {(['system', 'light', 'dark'] as const).map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.segmentButton,
              settings.theme === mode && styles.segmentButtonActive,
            ]}
            onPress={() => setTheme(mode)}
          >
            <Text
              style={[
                styles.segmentButtonText,
                settings.theme === mode && styles.segmentButtonTextActive,
              ]}
            >
              {mode === 'system'
                ? 'Системная'
                : mode === 'light'
                ? 'Светлая'
                : 'Тёмная'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.helperText}>
        Сейчас эта настройка влияет только на будущие экраны. Для настоящей смены темы
        потребуется доработка приложения.
      </Text>
    </SectionContainer>
  );
}

function LanguageScreen() {
  const [settings, setSettings] = useState<LanguageSettings | null>(null);

  useEffect(() => {
    loadSettings().then((s) => setSettings(s.language));
  }, []);

  const update = (patch: Partial<LanguageSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings({ language: next } as Partial<AllSettings>);
  };

  if (!settings) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Загрузка настроек...</Text>
      </View>
    );
  }

  const setLang = (code: LanguageSettings['code']) => {
    update({ code });
    Alert.alert('Язык', 'Язык интерфейса будет изменён в будущих версиях приложения.');
  };

  return (
    <SectionContainer>
      <TouchableOpacity
        style={styles.languageRow}
        onPress={() => setLang('ru')}
        activeOpacity={0.7}
      >
        <View style={styles.languageText}>
          <Text style={styles.rowTitle}>Русский</Text>
          <Text style={styles.rowSubtitle}>Текущий язык интерфейса</Text>
        </View>
        {settings.code === 'ru' && (
          <Ionicons name="checkmark" size={20} color="#0088CC" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.languageRow}
        onPress={() => setLang('en')}
        activeOpacity={0.7}
      >
        <View style={styles.languageText}>
          <Text style={styles.rowTitle}>English</Text>
          <Text style={styles.rowSubtitle}>Интерфейс на английском языке</Text>
        </View>
        {settings.code === 'en' && (
          <Ionicons name="checkmark" size={20} color="#0088CC" />
        )}
      </TouchableOpacity>
    </SectionContainer>
  );
}

function TelegramHelpScreen() {
  const openFaq = () => {
    Linking.openURL('https://telegram.org/faq').catch(() => {
      Alert.alert('Ошибка', 'Не удалось открыть сайт Telegram.');
    });
  };

  const openSupport = () => {
    Linking.openURL('https://t.me/telegram').catch(() => {
      Alert.alert('Ошибка', 'Не удалось открыть поддержку Telegram.');
    });
  };

  return (
    <SectionContainer>
      <Text style={styles.helperText}>
        Здесь вы можете быстро перейти к официальной справке Telegram или в чат поддержки.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={openFaq} activeOpacity={0.8}>
        <Text style={styles.primaryButtonText}>Открыть FAQ Telegram</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={openSupport}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryButtonText}>Открыть поддержку в Telegram</Text>
      </TouchableOpacity>
    </SectionContainer>
  );
}

function ReportProblemScreen() {
  const [text, setText] = useState('');

  const handleSend = () => {
    const body = encodeURIComponent(text || '');
    const subject = encodeURIComponent('Отчёт о проблеме в Telegram Clon');
    const mailto = `mailto:support@telegram-clon.app?subject=${subject}&body=${body}`;

    Linking.openURL(mailto).catch(() => {
      Alert.alert('Спасибо', 'Отчёт о проблеме сохранён (демо-режим).');
    });
  };

  return (
    <SectionContainer>
      <Text style={styles.helperText}>
        Опишите, что пошло не так. Мы постараемся исправить это в будущих версиях.
      </Text>
      <TextInput
        style={styles.textArea}
        value={text}
        onChangeText={setText}
        placeholder="Опишите проблему..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />
      <TouchableOpacity
        style={[styles.primaryButton, !text.trim() && styles.primaryButtonDisabled]}
        onPress={handleSend}
        disabled={!text.trim()}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Отправить</Text>
      </TouchableOpacity>
    </SectionContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  rowText: {
    flex: 1,
    paddingRight: 8,
  },
  rowTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
    marginTop: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingVertical: 8,
    fontSize: 16,
    color: '#000',
  },
  phoneValue: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  primaryButton: {
    marginTop: 24,
    backgroundColor: '#0088CC',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0088CC',
  },
  secondaryButtonText: {
    color: '#0088CC',
    fontSize: 16,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 14,
    color: '#707579',
    lineHeight: 20,
    marginTop: 8,
  },
  segmentRow: {
    flexDirection: 'row',
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  segmentButtonActive: {
    backgroundColor: '#0088CC',
  },
  segmentButtonText: {
    fontSize: 14,
    color: '#0088CC',
  },
  segmentButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  languageText: {
    flex: 1,
    paddingRight: 8,
  },
  textArea: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#000',
  },
});
