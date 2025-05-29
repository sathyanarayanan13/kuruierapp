import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  SafeAreaView,
  ImageBackground,
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

interface Shipment {
  id: string;
  title: string;
  image: string;
  weight: string;
  expectedDate: string;
  status?: 'pending' | 'sent';
}

const shipments: Shipment[] = [
  {
    id: '1',
    title: 'Mobile Phone',
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
    weight: '<2kg',
    expectedDate: '01/04/2025',
  },
  {
    id: '2',
    title: 'Packed Dresses',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    weight: '<2kg',
    expectedDate: '01/04/2025',
    status: 'sent',
  },
  {
    id: '3',
    title: 'Smart Watch',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    weight: '<200g',
    expectedDate: '01/04/2025',
  },
  {
    id: '4',
    title: 'Mobile Phone',
    image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg',
    weight: '<2kg',
    expectedDate: '01/04/2025',
  },
];

export default function CourierListScreen() {
  const router = useRouter();

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
                    source={{ uri: shipment.image }}
                    style={styles.shipmentImage}
                  />
                  <View style={styles.shipmentDetails}>
                    <Text style={styles.shipmentTitle} semiBold>
                      {shipment.title}
                    </Text>
                    <View style={styles.infoRow}>
                      <WeightIcon width={20} height={20} />
                      <Text style={styles.infoText}>
                        Weight : {shipment.weight}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <DatePicker width={20} height={20} pathFill='#FFFCDD' />
                      <Text style={styles.infoText}>
                        Expected date : {shipment.expectedDate}
                      </Text>
                    </View>
                  </View>
                </View>

                {shipment.status === 'sent' ? (
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
});
