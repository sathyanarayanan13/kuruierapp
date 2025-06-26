import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Filter,
  MessageCircle,
  Send,
  Scale,
  Calendar,
} from 'lucide-react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import BackButton from '@/assets/svgs/BackButton';
import FilterIcon from '@/assets/svgs/FilterIcon';
import WeightIcon from '@/assets/svgs/WeightIcon';
import DatePicker from '@/assets/svgs/DatePicker';
import MessageIcon from '@/assets/svgs/MessageIcon';
import SendIcon from '@/assets/svgs/SendIcon';
import { useState, useEffect } from 'react';
import { getShipments } from '@/utils/api';
import type { Shipment } from '@/utils/api';
import { formatDate } from '@/utils/dateUtils';

export default function CourierListScreen() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getShipments();
      setShipments(data);
    } catch (err) {
      setError('Failed to fetch courier list');
      console.error('Error fetching shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleChat = () => {
    router.push('/traveler-chat');
  };

  const formatWeight = (weightGrams: number) => {
    if (weightGrams < 1000) {
      return `<${weightGrams}g`;
    }
    return `<${Math.round(weightGrams / 1000)}kg`;
  };

  const renderContent = () => {
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

    if (shipments.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>No courier's list found</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {shipments.map((shipment) => (
          <View key={shipment.id} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.shipmentInfo}>
                <Image
                  source={{ uri: `http://194.164.150.61:3000${shipment.packageImageUrl}` }}
                  style={styles.shipmentImage}
                />
                <View style={styles.shipmentDetails}>
                  <Text style={styles.shipmentTitle} semiBold>
                    {shipment.packageType}
                  </Text>
                  <View style={styles.infoRow}>
                    <WeightIcon width={20} height={20} />
                    <Text style={styles.infoText}>
                      Weight : {formatWeight(shipment.weightGrams)}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <DatePicker width={20} height={20} pathFill='#FFFCDD' />
                    <Text style={styles.infoText}>
                      Expected date : {formatDate(shipment.estimatedDeliveryDate)}
                    </Text>
                  </View>
                </View>
              </View>

              {shipment.status === 'IN_TRANSIT' ? (
                <View style={styles.sentStatus}>
                  <SendIcon width={22} height={22}/>
                  <Text style={styles.sentStatusText}>Request Sent</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={handleChat}
                >
                  <MessageIcon  />
                  <Text style={styles.chatButtonText}>
                    Chat with the Shipment Owner
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    );
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
                  Courier's List
                </Text>
              </View>
              <TouchableOpacity style={styles.filterButton}>
                <FilterIcon width={32} height={32} color="#5059A5" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        {renderContent()}
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
    marginTop: 40,
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
    marginTop: -70,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardContent: {
    padding: 16,
    gap: 16,
  },
  shipmentInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  shipmentImage: {
    width: 68,
    height: 68,
    borderRadius: 8,
    marginTop: 10
  },
  shipmentDetails: {
    flex: 1,
    gap: 4,
  },
  shipmentTitle: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 4,
    fontFamily: 'OpenSans_600SemiBold'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.7,
    fontFamily: 'OpenSans_400Regular'
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 40,
    height: 36,
    borderWidth: 1,
    borderColor: Colors.mainTheme,
  },
  chatButtonText: {
    fontSize: 14,
    color: Colors.mainTheme,
    fontFamily: 'OpenSans_600SemiBold'
  },
  sentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D4FFF0',
    borderRadius: 40,
    height: 36
  },
  sentStatusText: {
    fontSize: 14,
    color: '#07875B',
    fontFamily: 'OpenSans_600SemiBold'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -70,
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
});
