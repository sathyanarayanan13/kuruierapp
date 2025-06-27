import React from 'react';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from '@/hooks/useFonts';
import SplashScreen from '@/components/SplashScreen';
import { UserProvider } from '@/utils/UserContext';
import { StripeProvider } from '@stripe/stripe-react-native';
import WebSocketService from '@/utils/WebSocketService';
import NotificationService from '@/utils/NotificationService';
import { isAuthenticated } from '@/utils/api';

export default function RootLayout() {
  useFrameworkReady();
  const { fontsLoaded, fontError } = useFonts();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Check if user is authenticated
        const authenticated = await isAuthenticated();
        
        if (authenticated) {
          // Initialize WebSocket connection
          await WebSocketService.connect();
          
          // Initialize notifications
          await NotificationService.registerForPushNotificationsAsync();
          
          // Setup notification listeners
          const notificationListener = NotificationService.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
          });
          
          const responseListener = NotificationService.addNotificationResponseReceivedListener(response => {
            console.log('Notification response:', response);
            // Handle notification tap - navigate to chat if needed
            const data = response.notification.request.content.data;
            if (data?.matchId) {
              // Navigate to chat screen with matchId
              // This will be handled by the navigation system
            }
          });
          
          return () => {
            notificationListener?.remove();
            responseListener?.remove();
          };
        }
      } catch (error) {
        console.error('Error initializing services:', error);
      }
    };

    initializeServices();
  }, []);

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