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
import DatePicker from '@/assets/svgs/DatePicker';
import FlightRight from '@/assets/svgs/FlightRight';
import AddIcon from '@/assets/svgs/AddIcon';
import People from '@/assets/svgs/People';
import TravelerSelectIcon from '@/assets/svgs/TravelerSelectIcon';

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

interface HistoryItem {
  id: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  route: {
    from: string;
    to: string;
  };
  package: {
    name: string;
    weight: string;
    image: string;
  };
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

export default function PackageDetailsTab() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleChat = () => {
    router.push('/chat');
  };

  const historyItems: HistoryItem[] = [
    {
      id: '1',
      date: '23/03/2025',
      status: 'upcoming',
      route: {
        from: 'New York',
        to: 'London',
      },
      package: {
        name: 'Mobile Phone',
        weight: '<2kg',
        image:
          'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
      },
    }
  ];

  const getStatusColor = (status: HistoryItem['status']) => {
    switch (status) {
      case 'upcoming':
        return Colors.primary;
      case 'ongoing':
        return Colors.warning;
      case 'completed':
        return Colors.success;
      default:
        return Colors.primary;
    }
  };

  const getStatusBgColor = (status: HistoryItem['status']) => {
    switch (status) {
      case 'upcoming':
        return '#F1F4FF';
      case 'ongoing':
        return '#FFF6ED';
      case 'completed':
        return '#DDFFF3';
      default:
        return Colors.primary;
    }
  };

  const getStatusText = (status: HistoryItem['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Yet to start';
      case 'ongoing':
        return 'Travelling';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
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
                  Packages List
                </Text>
              </View>
              <TouchableOpacity style={styles.filterButton} onPress={() => router.push('/package-details')}>
                <AddIcon width={32} height={32} color="#5059A5" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.historyContainer}>
            {['UPCOMING', 'ONGOING', 'COMPLETED'].map((section) => {
              const items = historyItems.filter(
                (item) => item.status === section.toLowerCase()
              );

              if (items.length === 0) return null;

              return (
                <View key={section} style={styles.historySection}>
                  {items.map((item) => (
                    <View key={item.id} style={styles.historyCard}>
                      <View style={styles.historyHeader}>
                        <View style={styles.dateContainer}>
                          <DatePicker width={20} height={20} stroke="#75758E" />
                          <Text style={styles.date}>{item.date}</Text>
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
                        <Text style={styles.city}>{item.route.from}</Text>
                        <View style={styles.dashedLine} />
                        <FlightRight stroke="#55559D" width={25} height={25} />
                        <View style={styles.dashedLine} />
                        <Text style={styles.city}>{item.route.to}</Text>
                      </View>

                      <View style={styles.packageInfo}>
                        <Image
                          source={{ uri: item.package.image }}
                          style={styles.packageImage}
                        />
                        <View>
                          <Text style={styles.packageName} semiBold>
                            {item.package.name}
                          </Text>
                          <Text style={styles.packageWeight}>
                            Weight : {item.package.weight}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.actionButton}
                      >
                        <TravelerSelectIcon width={20} height={20} />
                        <Text style={styles.buttonText}>Select Traveler</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
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
  packageImage: {
    width: 68,
    height: 68,
    borderRadius: 8,
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
});
