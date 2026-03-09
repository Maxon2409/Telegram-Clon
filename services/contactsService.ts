import * as Contacts from 'expo-contacts';
import { Platform } from 'react-native';

export interface AppContact {
  id: string;
  name: string;
  phone?: string;
}

/**
 * Запрашивает разрешение и загружает контакты с телефона.
 * На веб возвращает пустой массив.
 */
export async function loadDeviceContacts(): Promise<AppContact[]> {
  if (Platform.OS === 'web') return [];

  try {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') return [];

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.FirstName, Contacts.Fields.LastName, Contacts.Fields.PhoneNumbers],
      sort: Contacts.SortTypes.FirstName,
    });

    return data
      .filter((c) => c.firstName || c.lastName || c.name)
      .map((c) => {
        const name = [c.firstName, c.lastName].filter(Boolean).join(' ') || c.name || 'Без имени';
        const phone = c.phoneNumbers?.[0]?.number;
        return {
          id: c.id,
          name,
          phone,
        };
      });
  } catch (e) {
    console.warn('Failed to load contacts:', e);
    return [];
  }
}
