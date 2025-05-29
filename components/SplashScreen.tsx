import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  withSequence,
  withDelay,
  useSharedValue, 
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useEffect, useRef } from 'react';
import Text from './Text';
import Colors from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const translateY = useSharedValue(20);

  useEffect(() => {
    // Initial animations
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSpring(1, { damping: 15 });
    translateY.value = withSpring(0, { damping: 12 });

    // Trigger onAnimationComplete after animations
    const timeoutId = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(onAnimationComplete)();
      });
    }, 2000);

    // Cleanup function to prevent state updates after unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Image
        source={{ uri: 'https://images.pexels.com/photos/2469122/pexels-photo-2469122.jpeg' }}
        style={styles.backgroundMap}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <Animated.View style={[styles.content, contentStyle]}>
        <View style={styles.logoRow}>
          <Image
            source={require('@/assets/images/kuruierIconWithText.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width,
    height,
    backgroundColor: Colors.mainTheme,
    zIndex: 999,
  },
  backgroundMap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.mainTheme,
    opacity: 0.85,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  logo: {
    width: 128,
    height: 128,
  },
  title: {
    fontSize: 32,
    fontFamily: 'OpenSans_300Light',
  },
});