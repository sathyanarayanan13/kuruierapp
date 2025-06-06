import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  latitude: string;
  longitude: string;
  errorMsg: string | null;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: '',
    longitude: '',
    errorMsg: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocation(prev => ({
            ...prev,
            errorMsg: 'Permission to access location was denied',
          }));
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude.toString(),
          longitude: currentLocation.coords.longitude.toString(),
          errorMsg: null,
        });
      } catch (error) {
        setLocation(prev => ({
          ...prev,
          errorMsg: 'Error getting location',
        }));
      }
    })();
  }, []);

  return location;
} 