import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const { pendingPhone, login } = useAuth();
  const router = useRouter();

  const handleComplete = async () => {
    const fName = firstName.trim();
    const lName = lastName.trim();
    if (!fName) return;

    setLoading(true);
    try {
      await login({
        phone: pendingPhone || '',
        firstName: fName,
        lastName: lName.trim(),
      });
      router.replace('/(tabs)/chats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Ваше имя</Text>
        <Text style={styles.subtitle}>
          Укажите ваше имя и фамилию. Вы сможете изменить их позже в настройках.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Имя"
          placeholderTextColor="#999"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          editable={!loading}
        />
        <TextInput
          style={[styles.input, styles.inputSecond]}
          placeholder="Фамилия (необязательно)"
          placeholderTextColor="#999"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
          editable={!loading}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, (loading || !firstName.trim()) && styles.buttonDisabled]}
        onPress={handleComplete}
        disabled={loading || !firstName.trim()}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Готово</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#707579',
    marginBottom: 32,
    lineHeight: 22,
  },
  input: {
    fontSize: 18,
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#0088CC',
    color: '#000',
  },
  inputSecond: {
    marginTop: 24,
  },
  button: {
    backgroundColor: '#0088CC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
