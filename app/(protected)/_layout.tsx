import { ActivityIndicator, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/auth/AuthContext';
import { useEffect } from 'react';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  // If not authenticated, redirect to welcome screen
  if (!loading && !user) {
    return <Redirect href="/welcome" />;
  }

  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // User is authenticated, render protected routes
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
