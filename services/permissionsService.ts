import { Platform } from 'react-native';

export type PermissionType = 'camera' | 'microphone' | 'contacts';

export interface PermissionResult {
  type: PermissionType;
  granted: boolean;
  error?: string;
}

/**
 * Запрашивает разрешения: камера, микрофон, контакты (как в Telegram).
 * На веб-платформе часть разрешений может быть недоступна — ошибки перехватываются.
 */
export async function requestAppPermissions(): Promise<PermissionResult[]> {
  const results: PermissionResult[] = [];
  const isWeb = Platform.OS === 'web';

  try {
    const cam = await import('expo-camera');
    const requestCam = (cam as any).requestCameraPermissionsAsync ?? (cam as any).Camera?.requestCameraPermissionsAsync;
    const camStatus = requestCam ? await requestCam() : { status: 'undetermined' };
    results.push({ type: 'camera', granted: camStatus?.status === 'granted' });
  } catch (e) {
    results.push({
      type: 'camera',
      granted: false,
      error: isWeb ? 'Недоступно в браузере' : String(e),
    });
  }

  try {
    const cam = await import('expo-camera');
    const micReq =
      (cam as any).requestMicrophonePermissionsAsync ??
      (cam as any).Camera?.requestMicrophonePermissionsAsync;
    if (micReq) {
      const micStatus = await (typeof micReq === 'function' ? micReq() : micReq.call?.((cam as any).Camera));
      const status = micStatus?.status ?? micStatus?.granted;
      results.push({
        type: 'microphone',
        granted: status === 'granted' || status === true,
      });
    } else {
      results.push({ type: 'microphone', granted: false, error: 'Не поддерживается' });
    }
  } catch (e) {
    results.push({
      type: 'microphone',
      granted: false,
      error: isWeb ? 'Недоступно в браузере' : String(e),
    });
  }

  try {
    const contacts = await import('expo-contacts');
    const { status } = await contacts.requestPermissionsAsync();
    results.push({ type: 'contacts', granted: status === 'granted' });
  } catch (e) {
    results.push({
      type: 'contacts',
      granted: false,
      error: isWeb ? 'Недоступно в браузере' : String(e),
    });
  }

  return results;
}
