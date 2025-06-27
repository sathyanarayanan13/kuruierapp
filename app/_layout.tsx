import React from 'react';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from '@/hooks/useFonts';
import SplashScreen from '@/components/SplashScreen';
import { UserProvider } from '@/utils/UserContext';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function RootLayout() {
  useFrameworkReady();
  const { fontsLoaded, fontError } = useFonts();
  const [showSplash, setShowSplash] = useState(true);

  if (!fontsLoaded && !fontError) {
    return <SplashScreen onAnimationComplete={() => {}} />;
  }

  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISH_KEY!}>
      <UserProvider>
        {showSplash ? (
          <SplashScreen onAnimationComplete={() => setShowSplash(false)} />
        ) : (
          <>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="chat" />
              <Stack.Screen name="EditProfileScreen" />
              <Stack.Screen name="courier-list" />
              <Stack.Screen name="package-details" />
              <Stack.Screen name="travel-details" />
              <Stack.Screen name="traveler-details" />
              <Stack.Screen name="traveler-chat" />
              <Stack.Screen name="shipment-status" />
              <Stack.Screen name="package-delivery" />
            </Stack>
            <StatusBar style="light" />
          </>
        )}
      </UserProvider>
    </StripeProvider>
  );
}