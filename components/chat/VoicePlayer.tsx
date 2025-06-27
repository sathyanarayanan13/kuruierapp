import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import { Play, Pause } from 'lucide-react-native';

interface VoicePlayerProps {
  uri: string;
  fileName?: string;
}

export default function VoicePlayer({ uri, fileName }: VoicePlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const animatedValues = useRef<Animated.Value[]>([]);

  // Initialize animated values for waveform bars
  useEffect(() => {
    animatedValues.current = Array(20).fill(0).map(() => new Animated.Value(0));
  }, []);

  // Animate waveform bars when playing
  useEffect(() => {
    if (isPlaying) {
      const animations = animatedValues.current.map((value, index) => {
        const randomHeight = Math.random() * 20 + 8;
        return Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: randomHeight,
              duration: 300 + Math.random() * 400,
              useNativeDriver: false,
            }),
            Animated.timing(value, {
              toValue: 8,
              duration: 300 + Math.random() * 400,
              useNativeDriver: false,
            }),
          ])
        );
      });
      
      Animated.parallel(animations).start();
    } else {
      // Reset all animations when stopped
      animatedValues.current.forEach(value => {
        value.setValue(8);
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [uri]);

  const loadSound = async () => {
    try {
      setLoadError(false);
      
      // Handle different URL formats
      let soundUri = uri;
      
      if (uri.startsWith('file://')) {
        // Local file, use as is
        soundUri = uri;
      } else if (uri.startsWith('http://') || uri.startsWith('https://')) {
        // Remote URL, use as is
        soundUri = uri;
      } else if (uri.startsWith('/uploads/')) {
        // Backend relative path, construct full URL
        const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://194.164.150.61:3000';
        soundUri = `${baseUrl}${uri}`;
      } else {
        // Fallback: assume it's a relative path
        const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://194.164.150.61:3000';
        soundUri = `${baseUrl}/${uri}`;
      }
      
      console.log('Loading sound from:', soundUri);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: soundUri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error loading sound:', error);
      setLoadError(true);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
    }
  };

  const playSound = async () => {
    if (sound) {
      try {
        await sound.playAsync();
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  const pauseSound = async () => {
    if (sound) {
      try {
        await sound.pauseAsync();
      } catch (error) {
        console.error('Error pausing sound:', error);
      }
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  // Show fallback if file can't be loaded
  if (loadError) {
    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.fileName}>{fileName || 'Voice Message'}</Text>
          <Text style={styles.duration}>File not available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.playButton}
        onPress={isPlaying ? pauseSound : playSound}
      >
        {isPlaying ? (
          <Pause size={16} color={Colors.secondary} />
        ) : (
          <Play size={16} color={Colors.secondary} />
        )}
      </TouchableOpacity>
      
      <View style={styles.waveformContainer}>
        <View style={styles.waveform}>
          {animatedValues.current.map((animatedValue, index) => (
            <Animated.View
              key={index}
              style={[
                styles.waveformBar,
                {
                  height: animatedValue,
                  opacity: isPlaying ? 0.8 : 0.4,
                }
              ]}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.duration}>
          {formatTime(position)} / {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    gap: 12,
    minHeight: 40,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.mainTheme,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  waveformContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 24,
    paddingHorizontal: 8,
  },
  waveformBar: {
    width: 2,
    backgroundColor: Colors.secondary,
    borderRadius: 1,
    marginHorizontal: 1,
    minHeight: 6,
  },
  info: {
    alignItems: 'flex-end',
    minWidth: 50,
  },
  fileName: {
    fontSize: 12,
    fontFamily: 'OpenSans_600SemiBold',
    color: Colors.secondary,
    marginBottom: 2,
  },
  duration: {
    fontSize: 10,
    fontFamily: 'OpenSans_400Regular',
    color: Colors.secondary,
    opacity: 0.8,
  },
}); 