import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

interface LoadingSpinnerProps {
  size?: number | 'small' | 'large';
  color?: string;
}

export default function LoadingSpinner({ 
  size = 'large', 
  color = Colors.mainTheme 
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 