import * as SplashScreen from 'expo-splash-screen';

import { useEffect, useState } from 'react';

import { Platform } from 'react-native';

/**
 * Hook to handle framework initialization
 * @returns boolean indicating if the framework is ready
 */
export function useFrameworkReady(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we prepare resources
        await SplashScreen.preventAutoHideAsync();

        // Add any additional initialization logic here
        // For example:
        // - Load resources
        // - Initialize services
        // - Prepare caches

        // Mark as ready
        setIsReady(true);

        // Hide splash screen
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Error preparing app:', e);
        // Still mark as ready to prevent infinite loading
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  return isReady;
}
