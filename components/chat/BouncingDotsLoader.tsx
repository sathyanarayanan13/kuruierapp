import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const BouncingDotsLoader = () => {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const animations = dots.map((dot, index) =>
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.timing(dot, {
          toValue: -6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.loop(Animated.stagger(100, animations)).start();
  }, []);

  return (
    <View style={styles.container}>
      {dots.map((dot, index) => (
        <Animated.View
          key={index}
          style={[styles.dot, { transform: [{ translateY: dot }] }]}
        />
      ))}
    </View>
  );
};

export default BouncingDotsLoader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#8E97DB',
  },
});
