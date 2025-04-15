import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function LoadingScreen() {
  const { loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If we have a user, go to the protected routes
      if (user) {
        router.replace('/(protected)/(tabs)');
      } else {
        // Otherwise, go to welcome screen
        router.replace('/welcome');
      }
    }
  }, [loading, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
});
