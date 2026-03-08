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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { sendVerificationCode } from '@/services/smsService';

export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+7');
  const [loading, setLoading] = useState(false);
  const { setPhone: setPendingPhone } = useAuth();
  const router = useRouter();

  const fullPhone = `${countryCode} ${phone.replace(/\D/g, '')}`.trim();

  const formatPhone = (text: string) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 1) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 1)} (${digits.slice(1)}`;
    if (digits.length <= 7)
      return `${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    return `${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const handleSendCode = async () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      Alert.alert('Ошибка', 'Введите полный номер телефона');
      return;
    }

    setLoading(true);
    try {
      const result = await sendVerificationCode(fullPhone);

      if (result.success) {
        setPendingPhone(fullPhone);
        router.push('/(auth)/code');
        if (result.devCode) {
          Alert.alert(
            'Режим разработки',
            `Код подтверждения: ${result.devCode}\n\nВ продакшене код придёт по SMS.`
          );
        }
      } else {
        Alert.alert('Ошибка', result.error || 'Не удалось отправить код');
      }
    } catch (e) {
      Alert.alert('Ошибка', 'Что-то пошло не так');
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
        <Text style={styles.title}>Ваш номер телефона</Text>
        <Text style={styles.subtitle}>
          Пожалуйста, подтвердите код страны и введите свой номер телефона
        </Text>

        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.countryCode}>
            <Text style={styles.countryCodeText}>{countryCode}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.phoneInput}
            placeholder="Номер телефона"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(t) => setPhone(formatPhone(t))}
            maxLength={16}
            editable={!loading}
          />
        </View>

        <Text style={styles.hint}>
          Telegram позвонит или отправит SMS для подтверждения номера. Плата за
          SMS определяется вашим оператором.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendCode}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Далее</Text>
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
  inputRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#0088CC',
    marginBottom: 24,
  },
  countryCode: {
    paddingVertical: 12,
    paddingRight: 12,
    minWidth: 50,
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
  },
  countryCodeText: {
    fontSize: 18,
    color: '#0088CC',
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
    paddingLeft: 16,
    color: '#000',
  },
  hint: {
    fontSize: 14,
    color: '#707579',
    lineHeight: 20,
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
