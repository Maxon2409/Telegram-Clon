import { useState, useRef } from 'react';
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
import { verifyCode, sendVerificationCode } from '@/services/smsService';

export default function CodeScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { pendingPhone, setPhone } = useAuth();
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  const fullPhone = pendingPhone || '';

  const handleVerify = async () => {
    if (code.length < 6) {
      Alert.alert('Ошибка', 'Введите код из 6 цифр');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyCode(fullPhone, code);

      if (result.success) {
        router.replace('/(auth)/profile');
      } else {
        Alert.alert('Ошибка', 'Неверный код. Попробуйте снова.');
      }
    } catch (e) {
      Alert.alert('Ошибка', 'Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    try {
      const result = await sendVerificationCode(fullPhone);
      if (result.success) {
        setResendCooldown(60);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) clearInterval(interval);
            return prev - 1;
          });
        }, 1000);
        if (result.devCode) {
          Alert.alert('Режим разработки', `Новый код: ${result.devCode}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setPhone('');
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>← Назад</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Подтвердите номер</Text>
        <Text style={styles.subtitle}>
          Код отправлен в SMS на номер{'\n'}
          <Text style={styles.phone}>{fullPhone}</Text>
        </Text>

        <TextInput
          ref={inputRef}
          style={styles.codeInput}
          placeholder="Введите код"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          editable={!loading}
          autoFocus
          selectTextOnFocus
        />

        <TouchableOpacity
          style={[styles.resendButton, resendCooldown > 0 && styles.resendDisabled]}
          onPress={handleResend}
          disabled={resendCooldown > 0 || loading}
        >
          <Text style={styles.resendText}>
            {resendCooldown > 0
              ? `Отправить снова через ${resendCooldown} сек`
              : 'Отправить код повторно'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleVerify}
        disabled={loading || code.length < 6}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Проверить</Text>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 10,
  },
  backText: {
    fontSize: 17,
    color: '#0088CC',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    marginTop: 40,
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
    lineHeight: 24,
  },
  phone: {
    color: '#0088CC',
    fontWeight: '600',
  },
  codeInput: {
    fontSize: 24,
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#0088CC',
    color: '#000',
    letterSpacing: 8,
    marginBottom: 24,
  },
  resendButton: {
    alignSelf: 'flex-start',
  },
  resendDisabled: {
    opacity: 0.5,
  },
  resendText: {
    fontSize: 16,
    color: '#0088CC',
    fontWeight: '500',
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
