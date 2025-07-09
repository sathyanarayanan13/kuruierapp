import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { Alert, Platform } from 'react-native';

interface PermissionStatus {
  location: boolean;
  camera: boolean;
  mediaLibrary: boolean;
  microphone: boolean;
  notifications: boolean;
}

interface PermissionRequest {
  name: string;
  request: () => Promise<boolean>;
  isMandatory: boolean;
  description: string;
}

export function useAppPermissions() {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    location: false,
    camera: false,
    mediaLibrary: false,
    microphone: false,
    notifications: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mandatoryPermissionsDenied, setMandatoryPermissionsDenied] = useState<string[]>([]);

  const permissionRequests: PermissionRequest[] = [
    {
      name: 'location',
      request: async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const granted = status === 'granted';
        setPermissions(prev => ({ ...prev, location: granted }));
        return granted;
      },
      isMandatory: true,
      description: 'Location access is required for package delivery tracking and to find nearby travelers/couriers.'
    },
    {
      name: 'camera',
      request: async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        const granted = status === 'granted';
        setPermissions(prev => ({ ...prev, camera: granted }));
        return granted;
      },
      isMandatory: false,
      description: 'Camera access is needed to take photos of packages and documents.'
    },
    {
      name: 'mediaLibrary',
      request: async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const granted = status === 'granted';
        setPermissions(prev => ({ ...prev, mediaLibrary: granted }));
        return granted;
      },
      isMandatory: false,
      description: 'Media library access is needed to select photos and documents.'
    },
    {
      name: 'microphone',
      request: async () => {
        // Use Audio.requestPermissionsAsync from Audio namespace
        const { status } = await Audio.requestPermissionsAsync();
        const granted = status === 'granted';
        setPermissions(prev => ({ ...prev, microphone: granted }));
        return granted;
      },
      isMandatory: false,
      description: 'Microphone access is needed for voice notes and calls.'
    },
    {
      name: 'notifications',
      request: async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        const granted = status === 'granted';
        setPermissions(prev => ({ ...prev, notifications: granted }));
        return granted;
      },
      isMandatory: false,
      description: 'Push notifications are needed to receive real-time updates about your packages and chats.'
    }
  ];

  const requestAllPermissions = async () => {
    setIsLoading(true);
    const deniedMandatory: string[] = [];

    try {
      for (const permission of permissionRequests) {
        const granted = await permission.request();
        
        if (!granted && permission.isMandatory) {
          deniedMandatory.push(permission.name);
        }
      }

      setMandatoryPermissionsDenied(deniedMandatory);

      // If mandatory permissions are denied, show alert
      if (deniedMandatory.length > 0) {
        const deniedPermissions = deniedMandatory.map(name => {
          const perm = permissionRequests.find(p => p.name === name);
          return perm?.description || name;
        });

        Alert.alert(
          'Required Permissions',
          `The following permissions are required for the app to function properly:\n\n${deniedPermissions.join('\n\n')}\n\nPlease enable these permissions in your device settings to continue using the app.`,
          [
            {
              text: 'Open Settings',
              onPress: () => {
                // On iOS, we can't programmatically open settings
                // On Android, we could use Linking.openSettings()
                if (Platform.OS === 'ios') {
                  Alert.alert(
                    'Settings',
                    'Please go to Settings > Privacy & Security > Location Services and enable location access for this app.',
                    [{ text: 'OK' }]
                  );
                }
              }
            },
            {
              text: 'Continue Anyway',
              onPress: () => {
                // User can continue but with limited functionality
                setMandatoryPermissionsDenied([]);
              }
            }
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCurrentPermissions = async () => {
    setIsLoading(true);
    try {
      const [locationStatus, cameraStatus, mediaLibraryStatus, microphoneStatus, notificationStatus] = await Promise.all([
        Location.getForegroundPermissionsAsync(),
        ImagePicker.getCameraPermissionsAsync(),
        ImagePicker.getMediaLibraryPermissionsAsync(),
        Audio.getPermissionsAsync(),
        Notifications.getPermissionsAsync(),
      ]);

      setPermissions({
        location: locationStatus.status === 'granted',
        camera: cameraStatus.status === 'granted',
        mediaLibrary: mediaLibraryStatus.status === 'granted',
        microphone: microphoneStatus.status === 'granted',
        notifications: notificationStatus.status === 'granted',
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestSpecificPermission = async (permissionName: keyof PermissionStatus): Promise<boolean> => {
    const permission = permissionRequests.find(p => p.name === permissionName);
    if (!permission) return false;

    const granted = await permission.request();
    
    if (!granted && permission.isMandatory) {
      setMandatoryPermissionsDenied(prev => [...prev, permissionName]);
    }

    return granted;
  };

  return {
    permissions,
    isLoading,
    mandatoryPermissionsDenied,
    requestAllPermissions,
    checkCurrentPermissions,
    requestSpecificPermission,
  };
} 