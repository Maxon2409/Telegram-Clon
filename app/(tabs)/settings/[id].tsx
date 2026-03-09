import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
  const title = (id && sectionTitles[id]) || 'Настройка';

  useEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  return (
    <View style={styles.container}>
      <Ionicons name="construct-outline" size={64} color="#C7C7CC" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Раздел в разработке</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 8,
  },
});
