import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { usePackageLocation } from '@/hooks/usePackageLocation';
import { useLocationContext } from '@/utils/LocationContext';
import BackButton from '@/assets/svgs/BackButton';

const GOOGLE_API_KEY = 'AIzaSyBYSysjlRcnpSWE-wz7JXbiDQFhUU3S2iM';

export default function LocationMapScreen() {
  const router = useRouter();
  const { setLocationLabel, setCoordinates } = useLocationContext();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [pinLocation, setPinLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      setRegion(newRegion);
      setPinLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Could not get current location');
      setLoading(false);
    }
  };

  const handleMarkerDragStart = () => {
    setIsDragging(true);
    console.log('Started dragging pin');
  };

  const handleMarkerDragEnd = (e: any) => {
    const newLocation = e.nativeEvent.coordinate;
    setPinLocation(newLocation);
    setIsDragging(false);
    console.log('Pin dragged to:', newLocation);
  };

  const handleMapPress = (e: any) => {
    const newLocation = e.nativeEvent.coordinate;
    setPinLocation(newLocation);
    console.log('Map pressed, new pin location:', newLocation);
  };

  const handleConfirm = async () => {
    try {
      console.log('Confirming location:', pinLocation);
      // Reverse geocode the pin location
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pinLocation.latitude},${pinLocation.longitude}&key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        console.log('Setting location:', address, pinLocation);
        await setLocationLabel(address);
        await setCoordinates({
          lat: pinLocation.latitude,
          lng: pinLocation.longitude,
        });
        router.back();
      } else {
        Alert.alert('Error', 'Could not get address for this location');
      }
    } catch (error) {
      console.error('Error confirming location:', error);
      Alert.alert('Error', 'Could not get address for this location');
    }
  };

  const handleBack = () => router.back();

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
            <ImageBackground
            source={require('@/assets/images/travellerBanner.png')}
            style={styles.banner}
            resizeMode="cover"
            >
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <BackButton size={24} color={Colors.secondary} />
                </TouchableOpacity>
                <ChevronLeft size={24} color={Colors.primary} />
                <Text style={styles.headerTitle} semiBold>Add Location</Text>
            </View>
            </ImageBackground>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Getting your location...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/travellerBanner.png')}
        style={styles.headerBg}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <BackButton size={24} color={Colors.secondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Location</Text>
        </View>
      </ImageBackground>
      
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={pinLocation}
            draggable={true}
            onDragStart={handleMarkerDragStart}
            onDragEnd={handleMarkerDragEnd}
            title="You are here"
            description="Drag to adjust location"
            pinColor={isDragging ? "red" : "blue"}
          />
        </MapView>
        
        <View style={styles.pinLabel}>
          <Text style={styles.pinLabelText} semiBold>
            {isDragging ? "Dragging pin..." : "You are here"}
          </Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText} color="secondary" semiBold>
            Confirm Location
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBg: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
  },
  imageWrapper: {
    height: 85,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  banner: {
    flex: 1,
    height: 85,
    backgroundColor: Colors.mainTheme,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.secondary,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  pinLabel: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pinLabelText: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: Colors.background,
  },
  confirmButton: {
    backgroundColor: Colors.mainTheme,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmButtonText: {
    fontSize: 16,
  },
}); 