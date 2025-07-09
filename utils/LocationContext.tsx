import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationContextType {
  locationLabel: string;
  setLocationLabel: (label: string) => void;
  coordinates: Coordinates | null;
  setCoordinates: (coords: Coordinates | null) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCATION_LABEL_KEY = 'location_label';
const LOCATION_COORDS_KEY = 'location_coordinates';

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locationLabel, setLocationLabelState] = useState<string>('');
  const [coordinates, setCoordinatesState] = useState<Coordinates | null>(null);

  useEffect(() => {
    loadLocationData();
  }, []);

  const loadLocationData = async () => {
    try {
      const [savedLabel, savedCoords] = await AsyncStorage.multiGet([
        LOCATION_LABEL_KEY,
        LOCATION_COORDS_KEY,
      ]);

      if (savedLabel[1]) {
        setLocationLabelState(savedLabel[1]);
      }

      if (savedCoords[1]) {
        setCoordinatesState(JSON.parse(savedCoords[1]));
      }
    } catch (error) {
      console.error('Error loading location data:', error);
    }
  };

  const setLocationLabel = async (label: string) => {
    try {
      setLocationLabelState(label);
      await AsyncStorage.setItem(LOCATION_LABEL_KEY, label);
    } catch (error) {
      console.error('Error saving location label:', error);
    }
  };

  const setCoordinates = async (coords: Coordinates | null) => {
    try {
      setCoordinatesState(coords);
      if (coords) {
        await AsyncStorage.setItem(LOCATION_COORDS_KEY, JSON.stringify(coords));
      } else {
        await AsyncStorage.removeItem(LOCATION_COORDS_KEY);
      }
    } catch (error) {
      console.error('Error saving coordinates:', error);
    }
  };

  const clearLocation = async () => {
    try {
      setLocationLabelState('');
      setCoordinatesState(null);
      await AsyncStorage.multiRemove([LOCATION_LABEL_KEY, LOCATION_COORDS_KEY]);
    } catch (error) {
      console.error('Error clearing location data:', error);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        locationLabel,
        setLocationLabel,
        coordinates,
        setCoordinates,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
} 