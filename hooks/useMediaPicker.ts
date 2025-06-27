import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

interface MediaResult {
  uri: string;
  type: 'IMAGE' | 'FILE' | 'VOICE_NOTE';
  fileName: string;
  fileSize?: number;
}

export function useMediaPicker() {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async (): Promise<MediaResult | null> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable media library access in your device settings.',
          [{ text: 'OK' }]
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: 'IMAGE',
          fileName: asset.uri.split('/').pop() || 'image.jpg',
          fileSize: asset.fileSize,
        };
      }
      return null;
    } catch (err) {
      setError('Error picking image');
      return null;
    }
  };

  const takePhoto = async (): Promise<MediaResult | null> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable camera access in your device settings.',
          [{ text: 'OK' }]
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: 'IMAGE',
          fileName: asset.uri.split('/').pop() || 'photo.jpg',
          fileSize: asset.fileSize,
        };
      }
      return null;
    } catch (err) {
      setError('Error taking photo');
      return null;
    }
  };

  const pickDocument = async (): Promise<MediaResult | null> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: 'FILE',
          fileName: asset.name,
          fileSize: asset.size,
        };
      }
      return null;
    } catch (err) {
      setError('Error picking document');
      return null;
    }
  };

  const startRecording = async (): Promise<boolean> => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable microphone access in your device settings.',
          [{ text: 'OK' }]
        );
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      return true;
    } catch (err) {
      setError('Error starting recording');
      return false;
    }
  };

  const stopRecording = async (): Promise<MediaResult | null> => {
    try {
      if (!recording) return null;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);

      if (uri) {
        // Ensure we have a proper file:// URI for local files
        const fileUri = uri.startsWith('file://') ? uri : `file://${uri}`;
        return {
          uri: fileUri,
          type: 'VOICE_NOTE',
          fileName: `voice_${Date.now()}.m4a`,
        };
      }
      return null;
    } catch (err) {
      setError('Error stopping recording');
      setIsRecording(false);
      return null;
    }
  };

  const cancelRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }
      setIsRecording(false);
    } catch (err) {
      console.error('Error canceling recording:', err);
    }
  };

  return {
    isRecording,
    error,
    pickImage,
    takePhoto,
    pickDocument,
    startRecording,
    stopRecording,
    cancelRecording,
  };
} 