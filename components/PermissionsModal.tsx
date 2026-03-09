import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestAppPermissions, type PermissionResult } from '@/services/permissionsService';

const PERMISSIONS_ASKED_KEY = '@telegram_clon_permissions_asked';

const permissionLabels: Record<string, string> = {
  camera: 'Камера (фото, видео)',
  microphone: 'Микрофон (голосовые сообщения, звонки)',
  contacts: 'Контакты (поиск друзей)',
};

interface PermissionsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PermissionsModal({ visible, onClose }: PermissionsModalProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PermissionResult[] | null>(null);

  const handleAllow = async () => {
    setLoading(true);
    setResults(null);
    try {
      const res = await requestAppPermissions();
      setResults(res);
      await AsyncStorage.setItem(PERMISSIONS_ASKED_KEY, 'true');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (e) {
      setResults([{ type: 'camera', granted: false, error: String(e) }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(PERMISSIONS_ASKED_KEY, 'true');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleSkip}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <View style={styles.iconWrap}>
            <Ionicons name="shield-checkmark" size={48} color="#0088CC" />
          </View>
          <Text style={styles.title}>Разрешения для Telegram Clon</Text>
          <Text style={styles.subtitle}>
            Чтобы полноценно пользоваться звонками, камерой и контактами, разрешите доступ:
          </Text>

          {!results ? (
            <View style={styles.list}>
              <Row icon="camera-outline" label={permissionLabels.camera} />
              <Row icon="mic-outline" label={permissionLabels.microphone} />
              <Row icon="people-outline" label={permissionLabels.contacts} />
            </View>
          ) : (
            <ScrollView style={styles.results} contentContainerStyle={styles.resultsContent}>
              {results.map((r) => (
                <View key={r.type} style={styles.resultRow}>
                  <Ionicons
                    name={r.granted ? 'checkmark-circle' : 'close-circle'}
                    size={22}
                    color={r.granted ? '#34C759' : '#FF3B30'}
                  />
                  <Text style={styles.resultLabel}>{permissionLabels[r.type]}</Text>
                  <Text style={styles.resultStatus}>
                    {r.granted ? 'Разрешено' : r.error || 'Не разрешено'}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}

          {loading ? (
            <ActivityIndicator size="large" color="#0088CC" style={styles.loader} />
          ) : !results ? (
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.allowButton} onPress={handleAllow} activeOpacity={0.8}>
                <Text style={styles.allowButtonText}>Разрешить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.8}>
                <Text style={styles.skipButtonText}>Позже</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.doneButton} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.doneButtonText}>Готово</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

function Row({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color="#0088CC" />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6D6D72',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  list: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  rowLabel: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  results: {
    maxHeight: 140,
    marginBottom: 20,
  },
  resultsContent: {
    paddingVertical: 4,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  resultLabel: {
    fontSize: 15,
    color: '#000',
    flex: 1,
  },
  resultStatus: {
    fontSize: 13,
    color: '#8E8E93',
  },
  buttons: {
    gap: 12,
  },
  allowButton: {
    backgroundColor: '#0088CC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  allowButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#0088CC',
    fontSize: 17,
    fontWeight: '500',
  },
  doneButton: {
    backgroundColor: '#0088CC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 16,
  },
});

/** Показывать ли окно при каждом входе (true) или только один раз (false). */
const SHOW_EVERY_TIME = false;

export async function shouldShowPermissionsDialog(): Promise<boolean> {
  if (SHOW_EVERY_TIME) return true;
  try {
    const asked = await AsyncStorage.getItem(PERMISSIONS_ASKED_KEY);
    return asked !== 'true';
  } catch {
    return true;
  }
}
