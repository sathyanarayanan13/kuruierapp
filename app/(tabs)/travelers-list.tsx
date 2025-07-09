import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Modal,
  Platform,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import Dropdown from '@/components/Dropdown';
import BackButton from '@/assets/svgs/BackButton';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import FilterIcon from '@/assets/svgs/FilterIcon';
import FlightIcon from '@/assets/svgs/FlightIcon';
import MessageIcon from '@/assets/svgs/MessageIcon';
import SendIcon from '@/assets/svgs/SendIcon';
import React from 'react';
import { getTrips, getMyShipments, initiateChat, getValidCounts } from '@/utils/api';
import { formatDate, formatTime } from '@/utils/dateUtils';
import type { Trip, Shipment } from '@/utils/api';

const airports = ['New York Airport', 'London Heathrow', 'Dubai International'];
const radiusOptions = ['5 km', '10 km', '15 km', '20 km'];
const { width, height } = Dimensions.get('window');

// Helper function to get responsive padding
const getResponsivePadding = () => {
  const baseWidth = 375; // iPhone X width as base
  const scale = width / baseWidth;
  const basePadding = 25;
  
  // Clamp the scaling between 0.8 and 1.3 to avoid extreme values
  const clampedScale = Math.max(0.8, Math.min(1.3, scale));
  
  return Math.round(basePadding * clampedScale);
};

// Alternative approach using percentage-based padding
const getPercentagePadding = () => {
  return width * 0.067; // ~6.7% of screen width (25/375 ≈ 0.067)
};

// Function to get responsive spacing
const getResponsiveSpacing = (baseSize:any) => {
  const baseWidth = 375;
  const scale = width / baseWidth;
  const clampedScale = Math.max(0.8, Math.min(1.3, scale));
  return Math.round(baseSize * clampedScale);
};

export default function TravelersListScreen() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState('');
  const [selectedRadius, setSelectedRadius] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [showPackageDrawer, setShowPackageDrawer] = useState(false);
  const [packageList, setPackageList] = useState<Shipment[]>([]);
  const [packageLoading, setPackageLoading] = useState(false);
  const [packageError, setPackageError] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [initiateLoading, setInitiateLoading] = useState(false);
  const [initiateError, setInitiateError] = useState<string | null>(null);
  const [validPackageCount, setValidPackageCount] = useState<number | null>(null);
  const [validCountLoading, setValidCountLoading] = useState(true);
  const [validCountError, setValidCountError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Shipment | null>(null);
  const [packages, setPackages] = useState<Shipment[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchValidCounts();
  }, []);

  const fetchValidCounts = async () => {
    try {
      setValidCountLoading(true);
      setValidCountError(null);
      const { validPackageCount } = await getValidCounts();
      setValidPackageCount(validPackageCount);
    } catch (err) {
      setValidCountError('Failed to check package status');
    } finally {
      setValidCountLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      setPackagesLoading(true);
      const data = await getMyShipments();
      const validPackages = data.filter(pkg => new Date(pkg.estimatedDeliveryDate) > new Date());
      setPackages(validPackages);
      
      // Select the package with earliest estimatedDeliveryDate
      if (validPackages.length > 0) {
        const sortedPackages = validPackages.sort((a, b) => 
          new Date(a.estimatedDeliveryDate).getTime() - new Date(b.estimatedDeliveryDate).getTime()
        );
        setSelectedPackage(sortedPackages[0]);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setPackagesLoading(false);
    }
  };

  const fetchTrips = async (destinationCountry?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrips(destinationCountry);
      setTrips(data);
    } catch (err) {
      setError('Failed to fetch travelers list');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchValidCounts();
      fetchPackages();
    }, [])
  );

  useEffect(() => {
    if (selectedPackage) {
      fetchTrips(selectedPackage.destinationCountry);
    }
  }, [selectedPackage]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleApplyFilter = () => {
    setShowFilter(false);
  };

  const handlePackageChange = (packageId: string) => {
    const package_ = packages.find(pkg => pkg.id === packageId);
    if (package_) {
      setSelectedPackage(package_);
    }
  };

  const openPackageDrawer = async (tripId: string) => {
    setShowPackageDrawer(true);
    setSelectedTripId(tripId);
    setPackageLoading(true);
    setPackageError(null);
    setPackageList([]);
    try {
      const pkgs = await getMyShipments();
      setPackageList(pkgs);
    } catch (err) {
      setPackageError('Failed to fetch your packages');
    } finally {
      setPackageLoading(false);
    }
  };

  const handleInitiateChat = async (shipmentId: string) => {
    if (!selectedTripId) return;
    setInitiateLoading(true);
    setInitiateError(null);
    try {
      const result = await initiateChat(shipmentId, selectedTripId);
      setShowPackageDrawer(false);
      setSelectedTripId(null);
      setInitiateLoading(false);
      setInitiateError(null);
      if (result && result.matchId) {
        router.push({ pathname: '/chat', params: { matchId: result.matchId } });
      } else {
        router.push('/chat');
      }
    } catch (err: any) {
      setInitiateError(err.message || 'Something went wrong');
      setInitiateLoading(false);
    }
  };

  const handleChat = (tripId: string) => {
    openPackageDrawer(tripId);
  };

  const renderTravelerCard = (trip: Trip) => (
    <View key={trip.id} style={styles.card}>
      <ImageBackground
        source={require('@/assets/images/formListBg.png')}
        style={styles.cardBackground}
        imageStyle={styles.cardBackgroundImage}
        resizeMode="cover"
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.travelerInfo}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }} 
                style={styles.avatar} 
              />
              <Text style={styles.travelerName} semiBold>
                {trip.pnrNumber}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                trip.status === 'ACCEPTING'
                  ? styles.statusAccepting
                  : styles.statusMaybe,
              ]}
            >
              <Text
                style={styles.statusText}
                color={trip.status === 'ACCEPTING' ? '#13996B' : '#F1467B'}
              >
                {trip.status === 'ACCEPTING' ? 'Accepting' : 'May be later'}
              </Text>
            </View>
          </View>

          <View style={styles.tripInfo}>
            <View style={styles.dateTimeColumn}>
              <Text style={styles.date}>{formatDate(trip.departureDate)}</Text>
              <Text style={styles.time}>{formatTime(trip.departureDate)}</Text>
            </View>
            <View style={styles.locationColumn}>
              <FlightIcon
                size={16}
                color={Colors.primary}
                style={styles.planeIcon}
              />
              <View>
                <Text style={styles.location} semiBold>
                  {trip.fromCountry}
                </Text>
                <Text style={styles.airport}>{trip.flightInfo}</Text>
              </View>
            </View>

            <View
              style={[
                styles.dashedLine,
                {
                  left: getResponsiveSpacing(100),
                  top: getResponsiveSpacing(25),
                }
              ]}
            />
          </View>

          <View style={styles.tripInfo}>
            <View style={styles.dateTimeColumn}>
              <Text style={styles.date}>{formatDate(trip.departureDate)}</Text>
              <Text style={styles.time}>{formatTime(trip.departureDate)}</Text>
            </View>
            <View style={styles.locationColumn}>
              <FlightIcon
                size={16}
                color={Colors.primary}
                style={styles.planeIcon}
              />
              <View>
                <Text style={styles.location} semiBold>
                  {trip.toCountry}
                </Text>
                <Text style={styles.airport}>{trip.flightInfo}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, trip.status !== 'ACCEPTING' && { borderColor: '#009C66' }]}
            onPress={trip.status === 'ACCEPTING' ? () => handleChat(trip.id) : undefined}
          >
            {trip.status === 'ACCEPTING' ? (
              <>
                <MessageIcon width={20} height={20} style={{ marginTop: 6 }}/>
                <Text style={styles.buttonText}>Chat With the Traveler</Text>
              </>
            ) : (
              <>
                <SendIcon width={20} height={20} style={{ marginTop: 6 }} />
                <Text style={[styles.buttonTextInvite]}>Sent Interest</Text>
              </>
            )}
          </TouchableOpacity>
          
        </View>
      </ImageBackground>
    </View>
  );

  const renderContent = () => {
    if (validCountLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    if (validCountError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{validCountError}</Text>
        </View>
      );
    }
    if (validPackageCount === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>Please create a package to see the traveller</Text>
          <TouchableOpacity
            style={[styles.actionButton, { marginTop: 16 }]}
            onPress={() => router.push('/(tabs)/package-detail')}
          >
            <Text style={styles.buttonText}>Go to Package List Form</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (packagesLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (packages.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>No valid packages found</Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (trips.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>No travelers found for this destination</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
          padding: 8,
          paddingTop: 0,
        }}
        showsVerticalScrollIndicator={false}
      >
        {trips.map(renderTravelerCard)}
      </ScrollView>
    );
  };

  const packageDropdownItems = packages.map(pkg => `${pkg.packageType} - ${pkg.destinationCountry}`);

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
                  Traveler's List
                </Text>
              </View>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilter(true)}
              >
                <FilterIcon width={32} height={32} color="#5059A5" />
              </TouchableOpacity>
            </View>
            {/* Package Selection Dropdown */}
            {packages.length > 0 && validPackageCount && validPackageCount > 0 && (
              <View style={styles.packageDropdownContainer}>
                <Dropdown
                  value={selectedPackage ? `${selectedPackage.packageType} - ${selectedPackage.destinationCountry}` : ''}
                  items={packageDropdownItems}
                  onChange={(selectedLabel) => {
                    const package_ = packages.find(pkg => `${pkg.packageType} - ${pkg.destinationCountry}` === selectedLabel);
                    if (package_) {
                      setSelectedPackage(package_);
                    }
                  }}
                  placeholder="Choose a package"
                />
              </View>
            )}
          </ImageBackground>
        </View>

        {renderContent()}

        <Modal
          visible={showFilter}
          animationType="slide"
          transparent
          onRequestClose={() => setShowFilter(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.filterContainer}>
              <View style={styles.filterHeader}>
                <Text style={styles.filterTitle} semiBold>
                  Apply Filter
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowFilter(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.filterContent}>
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Select Airport</Text>
                  <Dropdown
                    value={selectedAirport}
                    items={airports}
                    onChange={setSelectedAirport}
                    placeholder="Choose airport"
                  />
                </View>

                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Select Radius</Text>
                  <Dropdown
                    value={selectedRadius}
                    items={radiusOptions}
                    onChange={setSelectedRadius}
                    placeholder="Choose radius"
                  />
                </View>

                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApplyFilter}
                >
                  <Text
                    style={styles.applyButtonText}
                    color="secondary"
                    semiBold
                  >
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showPackageDrawer}
          animationType="slide"
          transparent
          onRequestClose={() => setShowPackageDrawer(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 200 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Select a Package</Text>
              {packageLoading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
              ) : packageError ? (
                <Text style={{ color: 'red', textAlign: 'center' }}>{packageError}</Text>
              ) : packageList.length === 0 ? (
                <Text style={{ textAlign: 'center' }}>No packages found</Text>
              ) : (
                <ScrollView style={{ maxHeight: 320 }}>
                  {packageList.map(pkg => (
                    <TouchableOpacity
                      key={pkg.id}
                      style={{
                        backgroundColor: '#F8F9FF',
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        borderWidth: 1,
                        borderColor: '#E7EAFF',
                      }}
                      onPress={() => handleInitiateChat(pkg.id)}
                      disabled={initiateLoading}
                    >
                      <Image
                        source={{ uri: pkg.packageImageUrl ? `http://194.164.150.61:3000${pkg.packageImageUrl}` : undefined }}
                        style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: '#eee' }}
                        resizeMode="cover"
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#242A62', marginBottom: 2 }}>{pkg.packageType}</Text>
                        <Text style={{ color: '#75758E', fontSize: 14 }}>To: {pkg.destinationCountry}</Text>
                        <Text style={{ color: '#75758E', fontSize: 14 }}>Weight: {pkg.weightGrams}g</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              {initiateError && <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{initiateError}</Text>}
              <TouchableOpacity
                style={{ marginTop: 16, alignSelf: 'center' }}
                onPress={() => setShowPackageDrawer(false)}
                disabled={initiateLoading}
              >
                <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    height: 180,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  banner: {
    flex: 1,
    height: 180,
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
    marginLeft: 30
  },
  content: {
    flex: 1,
    marginTop: -60,
  },
  scrollContent: {
    padding: 8,
    paddingTop: 0,
    paddingBottom: 0
  },
  card: {
    marginBottom: 0,
    borderRadius: 10,
  },
  cardBackground: {
    width: '100%',
    height: 'auto'
  },
  cardBackgroundImage: {
    borderRadius: 10,
  },
  // UPDATED: Dynamic padding based on screen size
  cardContent: {
    padding: getResponsivePadding(), // This will scale with device size
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: getResponsiveSpacing(16),
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    paddingBottom: getResponsiveSpacing(12),
    marginTop: getResponsiveSpacing(10),
  },
  travelerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSpacing(12),
  },
  avatar: {
    width: getResponsiveSpacing(40),
    height: getResponsiveSpacing(40),
    borderRadius: 10,
  },
  travelerName: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold',
  },
  statusBadge: {
    paddingHorizontal: getResponsiveSpacing(6),
    paddingVertical: getResponsiveSpacing(2),
    borderRadius: 5,
  },
  statusAccepting: {
    backgroundColor: '#DDFFF3',
  },
  statusMaybe: {
    backgroundColor: '#FFF0F5',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'OpenSans_600SemiBold',
  },
  tripInfo: {
    flexDirection: 'row',
    marginBottom: getResponsiveSpacing(12),
  },
  dateTimeColumn: {
    width: getResponsiveSpacing(90),
  },
  date: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold',
  },
  time: {
    fontSize: 12,
    color: Colors.primary,
    opacity: 0.7,
    fontFamily: 'OpenSans_400Regular',
  },
  locationColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: getResponsiveSpacing(8),
  },
  planeIcon: {
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold',
  },
  airport: {
    fontSize: 12,
    color: Colors.primary,
    opacity: 0.7,
    fontFamily: 'OpenSans_400Regular',
  },
  // UPDATED: Made dashed line responsive
  dashedLine: {
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
    borderStyle: 'dashed',
    height: '66%',
    position: 'absolute',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: getResponsiveSpacing(36),
    borderRadius: 40,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.mainTheme,
    marginBottom: getResponsiveSpacing(15),
    marginTop: getResponsiveSpacing(8),
  },
  buttonText: {
    fontSize: 14,
    color: Colors.mainTheme,
    fontFamily: 'OpenSans_500Medium',
    paddingHorizontal: 10,
  },
  buttonTextInvite: {
    fontSize: 14,
    color: '#009C66',
    fontFamily: 'OpenSans_500Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterContainer: {
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 20,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: Colors.background,
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.primary,
  },
  filterContent: {
    gap: 20,
  },
  filterGroup: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_500Medium',
  },
  applyButton: {
    backgroundColor: Colors.mainTheme,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -120,
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
    fontFamily: 'OpenSans_500Medium',
  },
  noDataText: {
    color: Colors.primary,
    fontSize: 16,
    fontFamily: 'OpenSans_500Medium',
  },
  packageDropdownContainer: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  packageDropdownLabel: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_500Medium',
    marginBottom: 8,
  },
});