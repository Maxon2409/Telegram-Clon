import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PermissionsModal, shouldShowPermissionsDialog } from '@/components/PermissionsModal';

function PermissionsGate() {
  const { user, isLoading } = useAuth();
  const [showPermissions, setShowPermissions] = useState(false);

  useEffect(() => {
    if (isLoading || !user) return;
    let cancelled = false;
    shouldShowPermissionsDialog().then((show) => {
      if (!cancelled && show) setShowPermissions(true);
    });
    return () => { cancelled = true; };
  }, [user, isLoading]);

  return (
    <PermissionsModal
      visible={showPermissions}
      onClose={() => setShowPermissions(false)}
    />
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
      <PermissionsGate />
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0088CC' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="chat/[id]"
          options={({ route }) => ({
            title: '',
            headerBackTitle: 'Назад',
          })}
        />
      </Stack>
      </AuthProvider>
    </ErrorBoundary>
  );
}
