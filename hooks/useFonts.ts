import { useEffect } from 'react';
import { SplashScreen } from 'expo-router';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export function useFonts() {
  useEffect(() => {
    // Hide splash screen immediately since we're using system fonts
    SplashScreen.hideAsync();
  }, []);

  return { fontsLoaded: true, fontError: null };
}