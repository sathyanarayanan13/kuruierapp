import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Platform, Alert } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { usePackageLocation } from '@/hooks/usePackageLocation';
import { useLocationContext } from '@/utils/LocationContext';
import BackButton from '@/assets/svgs/BackButton';

const GOOGLE_API_KEY = 'AIzaSyBYSysjlRcnpSWE-wz7JXbiDQFhUU3S2iM';

export default function LocationSearchScreen() {
  const router = useRouter();
  const { setLocationLabel, setCoordinates } = useLocationContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBack = () => router.back();

  const fetchSuggestions = async (text: string) => {
    setQuery(text);
    if (text.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.predictions || []);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (item: any) => {
    // Fetch place details for lat/lng
    try {
      console.log('Selected place:', item.description);
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      const loc = data.result.geometry.location;
      console.log('Setting location from search:', item.description, loc);
      await setLocationLabel(item.description);
      await setCoordinates({ lat: loc.lat, lng: loc.lng });
      router.back();
    } catch (e) {
      console.error('Error selecting location:', e);
      Alert.alert('Error', 'Could not get location details');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
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
      <View style={styles.card}>
        <Text style={styles.cardLabel} semiBold>Enter your area to pick product</Text>
        <TextInput
          style={styles.input}
          placeholder="Search Address"
          value={query}
          onChangeText={fetchSuggestions}
          autoFocus
        />
      </View>
      <View style={styles.resultsSection}>
        <Text style={styles.resultsTitle} semiBold>Searched Results</Text>
        <FlatList
          data={results}
          keyExtractor={item => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)}>
              <Text style={styles.resultText}>{item.description}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={!loading && query.length > 2 ? <Text style={styles.noResults}>No results found</Text> : null}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBg: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
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
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 15,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  resultsSection: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 15,
    marginBottom: 8,
  },
  resultItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultText: {
    fontSize: 15,
    color: Colors.primary,
  },
  noResults: {
    textAlign: 'center',
    color: Colors.error,
    marginTop: 16,
  },
}); 