import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_STORAGE_KEY = '@telegram_clon_settings';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface NotificationsSettings {
  enabled: boolean;
  sounds: boolean;
  inAppSounds: boolean;
  previews: boolean;
}

export interface PrivacySettings {
  showLastSeen: boolean;
  showOnlineStatus: boolean;
  showPhoneNumber: boolean;
}

export interface DataSettings {
  autoDownloadWifi: boolean;
  autoDownloadMobile: boolean;
  saveToGallery: boolean;
}

export interface ChatsSettings {
  textSize: 'small' | 'normal' | 'large';
  archiveOnTop: boolean;
  showServiceNotifications: boolean;
}

export interface AppearanceSettings {
  theme: ThemeMode;
}

export interface LanguageSettings {
  code: 'ru' | 'en';
}

export interface AllSettings {
  notifications: NotificationsSettings;
  privacy: PrivacySettings;
  data: DataSettings;
  chats: ChatsSettings;
  appearance: AppearanceSettings;
  language: LanguageSettings;
}

export const defaultSettings: AllSettings = {
  notifications: {
    enabled: true,
    sounds: true,
    inAppSounds: true,
    previews: true,
  },
  privacy: {
    showLastSeen: true,
    showOnlineStatus: true,
    showPhoneNumber: true,
  },
  data: {
    autoDownloadWifi: true,
    autoDownloadMobile: false,
    saveToGallery: true,
  },
  chats: {
    textSize: 'normal',
    archiveOnTop: false,
    showServiceNotifications: true,
  },
  appearance: {
    theme: 'system',
  },
  language: {
    code: 'ru',
  },
};

export async function loadSettings(): Promise<AllSettings> {
  try {
    const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) {
      return defaultSettings;
    }
    const parsed = JSON.parse(stored);
    return {
      ...defaultSettings,
      ...parsed,
      notifications: {
        ...defaultSettings.notifications,
        ...(parsed.notifications ?? {}),
      },
      privacy: {
        ...defaultSettings.privacy,
        ...(parsed.privacy ?? {}),
      },
      data: {
        ...defaultSettings.data,
        ...(parsed.data ?? {}),
      },
      chats: {
        ...defaultSettings.chats,
        ...(parsed.chats ?? {}),
      },
      appearance: {
        ...defaultSettings.appearance,
        ...(parsed.appearance ?? {}),
      },
      language: {
        ...defaultSettings.language,
        ...(parsed.language ?? {}),
      },
    };
  } catch (e) {
    console.warn('Failed to load settings', e);
    return defaultSettings;
  }
}

export async function saveSettings(
  partial: Partial<AllSettings>,
): Promise<void> {
  try {
    const current = await loadSettings();
    const next: AllSettings = {
      ...current,
      ...partial,
      notifications: {
        ...current.notifications,
        ...(partial.notifications ?? {}),
      },
      privacy: {
        ...current.privacy,
        ...(partial.privacy ?? {}),
      },
      data: {
        ...current.data,
        ...(partial.data ?? {}),
      },
      chats: {
        ...current.chats,
        ...(partial.chats ?? {}),
      },
      appearance: {
        ...current.appearance,
        ...(partial.appearance ?? {}),
      },
      language: {
        ...current.language,
        ...(partial.language ?? {}),
      },
    };
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
}

