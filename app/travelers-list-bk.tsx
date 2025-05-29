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
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import Dropdown from '@/components/Dropdown';
import BackButton from '@/assets/svgs/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterIcon from '@/assets/svgs/FilterIcon';
import FlightIcon from '@/assets/svgs/FlightIcon';
import MessageIcon from '@/assets/svgs/MessageIcon';
import SendIcon from '@/assets/svgs/SendIcon';

const airports = ['New York Airport', 'London Heathrow', 'Dubai International'];
const radiusOptions = ['5 km', '10 km', '15 km', '20 km'];
const { width, height } = Dimensions.get('window');

interface Traveler {
  id: string;
  name: string;
  avatar: string;
  status: 'accepting' | 'maybe';
  fromDate: string;
  fromTime: string;
  fromLocation: string;
  fromAirport: string;
  toDate: string;
  toTime: string;
  toLocation: string;
  toAirport: string;
}

const travelers: Traveler[] = [
  {
    id: '1',
    name: 'Traveller 1',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    status: 'accepting',
    fromDate: '11/03/2025',
    fromTime: '11:30 AM',
    fromLocation: 'New York Del',
    fromAirport: 'New York Airport US',
    toDate: '12/03/2025',
    toTime: '02:45 PM',
    toLocation: 'London',
    toAirport: 'New York Airport US',
  },
  {
    id: '2',
    name: 'Traveller 2',
    avatar:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    status: 'maybe',
    fromDate: '11/03/2025',
    fromTime: '11:30 AM',
    fromLocation: 'New York Del',
    fromAirport: 'New York Airport US',
    toDate: '12/03/2025',
    toTime: '02:45 PM',
    toLocation: 'London',
    toAirport: 'New York Airport US',
  },
];

export default function TravelersListScreen() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState('');
  const [selectedRadius, setSelectedRadius] = useState('');
  const router = useRouter();

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

  const handleChat = () => {
    router.push('/chat');
  };

  const renderTravelerCard = (traveler: Traveler) => (
    <View key={traveler.id} style={styles.card}>
      <ImageBackground
        source={require('@/assets/images/formListBg.png')}
        style={styles.cardBackground}
        imageStyle={styles.cardBackgroundImage}
        resizeMode="cover"
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.travelerInfo}>
              <Image source={{ uri: traveler.avatar }} style={styles.avatar} />
              <Text style={styles.travelerName} semiBold>
                {traveler.name}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                traveler.status === 'accepting'
                  ? styles.statusAccepting
                  : styles.statusMaybe,
              ]}
            >
              <Text
                style={styles.statusText}
                color={traveler.status === 'accepting' ? '#13996B' : '#F1467B'}
              >
                {traveler.status === 'accepting' ? 'Accepting' : 'May be later'}
              </Text>
            </View>
          </View>

          <View style={styles.tripInfo}>
            <View style={styles.dateTimeColumn}>
              <Text style={styles.date}>{traveler.fromDate}</Text>
              <Text style={styles.time}>{traveler.fromTime}</Text>
            </View>
            <View style={styles.locationColumn}>
              <FlightIcon
                size={16}
                color={Colors.primary}
                style={styles.planeIcon}
              />
              <View>
                <Text style={styles.location} semiBold>
                  {traveler.fromLocation}
                </Text>
                <Text style={styles.airport}>{traveler.fromAirport}</Text>
              </View>
            </View>

            <View
              style={{
                borderLeftWidth: 1,
                borderLeftColor: '#ccc',
                borderStyle: 'dashed',
                height: '66%',
                position: 'absolute',
                left: 100,
                top: 25,
              }}
            ></View>
          </View>

          <View style={styles.tripInfo}>
            <View style={styles.dateTimeColumn}>
              <Text style={styles.date}>{traveler.toDate}</Text>
              <Text style={styles.time}>{traveler.toTime}</Text>
            </View>
            <View style={styles.locationColumn}>
              <FlightIcon
                size={16}
                color={Colors.primary}
                style={styles.planeIcon}
              />
              <View>
                <Text style={styles.location} semiBold>
                  {traveler.toLocation}
                </Text>
                <Text style={styles.airport}>{traveler.toAirport}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, traveler.status !== 'accepting' && { borderColor: '#009C66' }]}
            onPress={traveler.status === 'accepting' ? handleChat : undefined}
          >
            {traveler.status === 'accepting' ? (
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
          </ImageBackground>
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {travelers.map(renderTravelerCard)}
        </ScrollView>

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
    marginTop: -120,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0
  },
  card: {
    marginBottom: 0,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardBackground: {
    width: width - 35,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    height: 305
  },
  cardBackgroundImage: {
    borderRadius: 10,
  },
  cardContent: {
    padding: 25,
    paddingLeft: 20,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    paddingBottom: 12,
    marginTop: 10,
  },
  travelerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  travelerName: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
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
    marginBottom: 12,
  },
  dateTimeColumn: {
    width: 90,
  },
  date: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 2,
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
    gap: 8,
  },
  planeIcon: {
    marginTop: 2,
  },
  location: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 2,
    fontFamily: 'OpenSans_600SemiBold',
  },
  airport: {
    fontSize: 12,
    color: Colors.primary,
    opacity: 0.7,
    fontFamily: 'OpenSans_400Regular',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 40,
    backgroundColor: Colors.secondary,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.mainTheme,
    width: '100%',
  },
  buttonText: {
    fontSize: 14,
    color: Colors.mainTheme,
    fontFamily: 'OpenSans_500Medium',
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
});
