import { View, StyleSheet, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';

export default function HomeScreen() {
  // Simple fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text variant="header" color="mainTheme" style={styles.title}>
          Hello World
        </Text>
        <Text variant="subtitle" color="primary" style={styles.subtitle}>
          Welcome to Kuruier
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    fontSize: 40,
  },
  subtitle: {
    opacity: 0.8,
  },
});