import React from 'react';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from '@/hooks/useFonts';
import SplashScreen from '@/components/SplashScreen';

export default function RootLayout() {
  useFrameworkReady();
  const { fontsLoaded, fontError } = useFonts();
  const [showSplash, setShowSplash] = useState(true);

  if (!fontsLoaded && !fontError) {
    return <SplashScreen onAnimationComplete={() => {}} />;
  }

  return (
    <>
      {showSplash ? (
        <SplashScreen onAnimationComplete={() => setShowSplash(false)} />
      ) : (
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
          </Stack>
          <StatusBar style="light" />
        </>
      )}
    </>
  );
}