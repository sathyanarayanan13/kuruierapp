import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

interface PermissionStatus {
  camera: boolean;
  microphone: boolean;
  mediaLibrary: boolean;
  storage: boolean;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: false,
    microphone: false,
    mediaLibrary: false,
    storage: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check all permissions on mount
  useEffect(() => {
    checkAllPermissions();
  }, []);

  const checkAllPermissions = async () => {
    setIsLoading(true);
    try {
      const [cameraStatus, mediaLibraryStatus] = await Promise.all([
        ImagePicker.getCameraPermissionsAsync(),
        ImagePicker.getMediaLibraryPermissionsAsync(),
      ]);

      setPermissions({
        camera: cameraStatus.status === 'granted',
        microphone: true, // Will be checked when needed for voice recording
        mediaLibrary: mediaLibraryStatus.status === 'granted',
        storage: Platform.OS === 'ios' ? true : true, // Android storage permission is handled differently
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      const granted = status === 'granted';
      setPermissions(prev => ({ ...prev, camera: granted }));
      
      if (!granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in your device settings to take photos.',
          [{ text: 'OK' }]
        );
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  };

  const requestMediaLibraryPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const granted = status === 'granted';
      setPermissions(prev => ({ ...prev, mediaLibrary: granted }));
      
      if (!granted) {
        Alert.alert(
          'Media Library Permission Required',
          'Please enable media library access in your device settings to select files.',
          [{ text: 'OK' }]
        );
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting media library permission:', error);
      return false;
    }
  };

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync(); // This includes microphone
      const granted = status === 'granted';
      setPermissions(prev => ({ ...prev, microphone: granted }));
      
      if (!granted) {
        Alert.alert(
          'Microphone Permission Required',
          'Please enable microphone access in your device settings to record voice notes.',
          [{ text: 'OK' }]
        );
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
    }
  };

  return {
    permissions,
    isLoading,
    requestCameraPermission,
    requestMediaLibraryPermission,
    requestMicrophonePermission,
    checkAllPermissions,
  };
} 