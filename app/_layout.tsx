import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Linking, Text, View } from 'react-native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { useCallback, useEffect } from 'react';

import { AuthProvider } from '@/auth/AuthContext';
import { BalanceProvider } from '@/contexts/BalanceContext';
import Constants from 'expo-constants';
import { RecordingsProvider } from '@/contexts/RecordingsContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

const STRIPE_PUBLISHABLE_KEY =
  Constants.expoConfig?.extra?.STRIPE_PUBLISHABLE_KEY;

function StripeUrlHandler({ children }: { children: React.ReactNode }) {
  const { handleURLCallback } = useStripe();

  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          // This was a Stripe URL - you can add extra handling here if needed
          console.log('Handled Stripe URL:', url);
        }
      }
    },
    [handleURLCallback]
  );

  useEffect(() => {
    // Handle URLs when the app is not open
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    getUrlAsync();

    // Handle URLs when the app is running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleDeepLink]);

  return children;
}

export default function RootLayout() {
  const isFrameworkReady = useFrameworkReady();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!isFrameworkReady || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as string}
      merchantIdentifier="merchant.com.landonkleinbrodt.speechcoach"
      urlScheme="speechCoach"
    >
      <StripeUrlHandler>
        <BalanceProvider>
          <RecordingsProvider>
            <AuthProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(protected)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="+not-found"
                  options={{ presentation: 'modal' }}
                />
              </Stack>
              <StatusBar style="dark" />
            </AuthProvider>
          </RecordingsProvider>
        </BalanceProvider>
      </StripeUrlHandler>
    </StripeProvider>
  );
}
