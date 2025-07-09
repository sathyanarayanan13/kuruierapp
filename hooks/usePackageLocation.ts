import { useRouter } from 'expo-router';
import { useLocationContext } from '@/utils/LocationContext';

export function usePackageLocation() {
  const { locationLabel, setLocationLabel, coordinates, setCoordinates } = useLocationContext();
  const router = useRouter();

  // Open the location selector screen based on option
  const openLocationSelector = (option: 'current' | 'search') => {
    if (option === 'current') {
      router.push('location-map' as any);
    } else {
      router.push('location-search' as any);
    }
  };

  return {
    locationLabel,
    setLocationLabel,
    coordinates,
    setCoordinates,
    openLocationSelector,
  };
} 