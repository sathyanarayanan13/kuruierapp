import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import BackButton from '@/assets/svgs/BackButton';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import DatePicker from '@/assets/svgs/DatePicker';
import FlightRight from '@/assets/svgs/FlightRight';
import AddIcon from '@/assets/svgs/AddIcon';
import { getMyTrips } from '@/utils/api';

interface Trip {
  id: string;
  userId: string;
  pnrNumber: string;
  fromCountry: string;
  toCountry: string;
  departureDate: string;
  status: 'ACCEPTING' | 'IN_TRANSIT' | 'COMPLETED';
  flightInfo: string;
  lat_coordinates: string;
  long_coordinates: string;
  createdAt: string;
  updatedAt: string;
}

export default function TravelDetailsTab() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await getMyTrips();
      setTrips(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'ACCEPTING':
        return Colors.primary;
      case 'IN_TRANSIT':
        return Colors.warning;
      case 'COMPLETED':
        return Colors.success;
      default:
        return Colors.primary;
    }
  };

  const getStatusBgColor = (status: Trip['status']) => {
    switch (status) {
      case 'ACCEPTING':
        return '#F1F4FF';
      case 'IN_TRANSIT':
        return '#FFF6ED';
      case 'COMPLETED':
        return '#DDFFF3';
      default:
        return Colors.primary;
    }
  };

  const getStatusText = (status: Trip['status']) => {
    switch (status) {
      case 'ACCEPTING':
        return 'Accepting';
      case 'IN_TRANSIT':
        return 'In Transit';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
              <View style={styles.headerText}>
                <Text style={styles.title} color="secondary" semiBold>
                  Travelling List
                </Text>
              </View>
              <TouchableOpacity style={styles.filterButton} onPress={() => router.push('/travel-details')}>
                <AddIcon width={32} height={32} color="#5059A5" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          contentContainerStyle={{
            paddingBottom: insets.bottom + 80,
          }}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : trips.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No trips available</Text>
            </View>
          ) : (
            <View style={styles.historyContainer}>
              {['ACCEPTING', 'IN_TRANSIT', 'COMPLETED'].map((section) => {
                const items = trips.filter(
                  (item) => item.status === section
                );

                if (items.length === 0) return null;

                return (
                  <View key={section} style={styles.historySection}>
                    {items.map((item) => (
                      <View key={item.id} style={styles.historyCard}>
                        <View style={styles.historyHeader}>
                          <View style={styles.dateContainer}>
                            <DatePicker width={20} height={20} stroke="#75758E" />
                            <Text style={styles.date}>{formatDate(item.departureDate)}</Text>
                          </View>
                          <Text
                            style={[
                              styles.status,
                              {
                                color: getStatusColor(item.status),
                                backgroundColor: getStatusBgColor(item.status),
                              },
                            ]}
                          >
                            {getStatusText(item.status)}
                          </Text>
                        </View>

                        <View style={styles.routeContainer}>
                          <Text style={styles.city}>{item.fromCountry}</Text>
                          <View style={styles.dashedLine} />
                          <FlightRight stroke="#55559D" width={25} height={25} />
                          <View style={styles.dashedLine} />
                          <Text style={styles.city}>{item.toCountry}</Text>
                        </View>

                        <View style={styles.packageInfo}>
                          <View>
                            <Text style={styles.packageName} semiBold>
                              PNR: {item.pnrNumber}
                            </Text>
                            <Text style={styles.packageWeight}>
                              Flight: {item.flightInfo}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.mainTheme,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    gap: 5,
    marginTop: 15,
    alignItems: 'flex-end',
  },
  backButton: {
    flex: 1,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 4,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'OpenSans_600SemiBold',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans_600SemiBold',
    letterSpacing: 0.5,
  },
  filterButton: {
    flex: 1,
    width: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    position: 'relative',
    top: 5,
    marginLeft: 30,
  },
  content: {
    flex: 1,
  },
  historyContainer: {
    padding: 16,
    gap: 24,
  },
  historySection: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    gap: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_400Regular',
    opacity: 0.5,
  },
  status: {
    fontSize: 14,
    fontFamily: 'OpenSans_500Medium',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dashedLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    opacity: 0.3,
  },
  city: {
    fontSize: 14,
    color: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: '#E7EAFF',
    borderRadius: 40,
    fontFamily: 'OpenSans_600SemiBold',
  },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  packageName: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 4,
    fontFamily: 'OpenSans_600SemiBold',
  },
  packageWeight: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.7,
    fontFamily: 'OpenSans_500Medium',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: Colors.primary,
    fontSize: 16,
    textAlign: 'center',
  },
});
