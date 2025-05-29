import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ChevronLeft, Star, Plane } from 'lucide-react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/assets/svgs/BackButton';
import DatePicker from '@/assets/svgs/DatePicker';
import FlightRight from '@/assets/svgs/FlightRight';
import ReviewIcon from '@/assets/svgs/ReviewIcon';
import ReviewBack from '@/assets/svgs/ReviewBack';

type TabType = 'overview' | 'ratings' | 'history';

interface Rating {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  route: {
    from: string;
    to: string;
  };
  comment: string;
  date: string;
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

const ratings: Rating[] = [
  {
    id: '1',
    user: {
      name: 'Sanjai Kumar',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
    rating: 4,
    route: {
      from: 'New York',
      to: 'London',
    },
    comment:
      'My courier package was delivered to me on time by my courier service, and in a safe and timely manner as well. Thank you so much.',
    date: '23/03/2025',
  },
  {
    id: '2',
    user: {
      name: 'Sanjai Kumar',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
    rating: 3,
    route: {
      from: 'New York',
      to: 'London',
    },
    comment:
      'In good condition and on time, the courier package that I ordered from my courier service arrived at its destination. Thank you.',
    date: '23/03/2025',
  },
];

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
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
    },
  },
  {
    id: '2',
    date: '21/03/2025',
    status: 'ongoing',
    route: {
      from: 'New York',
      to: 'London',
    },
    package: {
      name: 'Mobile Phone',
      weight: '<2kg',
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
    },
  },
  {
    id: '3',
    date: '03/03/2025',
    status: 'completed',
    route: {
      from: 'New York',
      to: 'London',
    },
    package: {
      name: 'Mobile Phone',
      weight: '<2kg',
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
    },
  },
];

export default function TravelerDetailsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('history');
  const router = useRouter();

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? Colors.warning : 'none'}
            color={star <= rating ? Colors.warning : Colors.border}
          />
        ))}
        <Text style={styles.ratingText}>{rating}</Text>{' '}
        <Text style={styles.ratingConst}> / 5 </Text>
      </View>
    );
  };

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.overviewContainer}>
            <Text style={styles.overviewText}>
              Overview content will be implemented in future updates.
            </Text>
          </View>
        );
      case 'ratings':
        return (
          <View style={styles.ratingsContainer}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.line} />
              <View style={styles.dateContainer}>
                <DatePicker width={20} height={20} stroke="#75758E" />
                <Text style={styles.date}>23/05/2025</Text>
              </View>
              <View style={styles.line} />
            </View>
            {ratings.map((rating) => (
              <View key={rating.id} style={styles.ratingCard}>
                <View style={styles.ratingHeader}>
                  <View style={styles.userInfo}>
                    <Image
                      source={{ uri: rating.user.avatar }}
                      style={styles.userAvatar}
                    />
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.userName} semiBold>
                        {rating.user.name}
                      </Text>
                      {renderStars(rating.rating)}
                    </View>
                  </View>
                </View>

                <View style={styles.routeContainer}>
                  <View style={styles.route}>
                    <Text style={styles.city}>{rating.route.from}</Text>
                    <View style={styles.dashedLine} />
                    <FlightRight stroke="#55559D" width={25} height={25} />
                    <View style={styles.dashedLine} />
                    <Text style={styles.city}>{rating.route.to}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                  <ReviewIcon width={20} height={20} />
                  <Text style={styles.comment}>
                    {rating.comment} {' '}
                    <TouchableOpacity>
                      <Text style={styles.readMore}>Read more</Text>
                    </TouchableOpacity>
                  </Text>
                </View>
              </View>
            ))}
            
            <TouchableOpacity style={styles.rateButton} >
              <Text style={styles.rateButtonText} color="secondary" semiBold>
                Rate your experience
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 'history':
        return (
          <View style={styles.historyContainer}>
            {['UPCOMING', 'ONGOING', 'COMPLETED'].map((section) => {
              const items = historyItems.filter(
                (item) => item.status === section.toLowerCase()
              );

              if (items.length === 0) return null;

              return (
                <View key={section} style={styles.historySection}>
                  <View style={styles.sectionTitleContainer}>
                    <View style={styles.line} />
                    <Text style={styles.sectionTitle}>{section}</Text>
                    <View style={styles.line} />
                  </View>
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
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ReviewBack />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName} semiBold>
                Lenin Maria Joseph
              </Text>
              <Text style={styles.userStatus}>Online</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          {(['overview', 'ratings', 'history'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
                semiBold={activeTab === tab}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.content}>{renderTabContent()}</ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
  },
  userName: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold'
  },
  userStatus: {
    fontSize: 14,
    color: Colors.success,
    fontFamily: 'OpenSans_600SemiBold'
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: '#DBDFEE',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 0,
    height: 40,
    justifyContent: 'center',
  },
  activeTab: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#1C33FF',
  },
  tabText: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.4,
    fontFamily: 'OpenSans_600SemiBold'
  },
  activeTabText: {
    color: Colors.mainTheme,
    opacity: 1,
  },
  content: {
    flex: 1,
  },
  overviewContainer: {
    padding: 16,
  },
  overviewText: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.7,
    fontFamily: 'OpenSans_500Medium'
  },
  ratingsContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  ratingCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  ratingDate: {
    fontSize: 12,
    color: Colors.primary,
    opacity: 0.7,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
    fontFamily: 'OpenSans_600SemiBold'
  },
  ratingConst: {
    fontSize: 12,
    color: '#75758E',
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
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    fontSize: 14,
    color: Colors.primary,
  },
  comment: {
    fontSize: 14,
    color: Colors.primary,
    lineHeight: 22,
    fontFamily: 'OpenSans_400Regular'
  },
  readMore: {
    fontSize: 14,
    color: Colors.mainTheme,
    height: 17.8
  },
  rateButton: {
    backgroundColor: Colors.mainTheme,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    position: 'fixed',
    bottom: 0,
  },
  rateButtonText: {
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
  },
  historyContainer: {
    padding: 16,
    gap: 24,
  },
  historySection: {
    gap: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    fontFamily: 'OpenSans_600SemiBold',
    opacity: 0.4
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E5F9',
    opacity: 0.3,
  },
  sectionTitle: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.7,
    textAlign: 'center',
    marginHorizontal: 8,
    fontFamily: 'OpenSans_600SemiBold',
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
  dateIcon: {
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_400Regular',
    opacity: 0.5
  },
  status: {
    fontSize: 14,
    fontFamily: 'OpenSans_500Medium',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  city: {
    fontSize: 14,
    color: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: '#E7EAFF',
    borderRadius: 40,
    fontFamily: 'OpenSans_600SemiBold'
  },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  packageImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  packageName: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 4,
    fontFamily: 'OpenSans_600SemiBold'
  },
  packageWeight: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.7,
    fontFamily: 'OpenSans_500Medium'
  },
});
