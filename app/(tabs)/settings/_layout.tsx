import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0088CC' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Настройки' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
