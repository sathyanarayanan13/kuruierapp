import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Package, Plane, User, Clock } from 'lucide-react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/assets/svgs/BackButton';
import BoxIcon from '@/assets/svgs/BoxIcon';
import FlightTopRightIcon from '@/assets/svgs/FlightTopRightIcon';
import FlightBottomRight from '@/assets/svgs/FlightBottomRight';
import Delivered from '@/assets/svgs/Delivered';

interface TrackingStep {
  id: string;
  date: string;
  time: string;
  title: string;
  status: 'completed' | 'pending';
  icon: any;
}

const trackingSteps: TrackingStep[] = [
  {
    id: '1',
    date: '17/03/2025',
    time: '07:32 PM',
    title: 'Gets product',
    status: 'completed',
    icon: BoxIcon,
  },
  {
    id: '2',
    date: '17/03/2025',
    time: '07:32 PM',
    title: 'Flights Departs',
    status: 'completed',
    icon: FlightTopRightIcon,
  },
  {
    id: '3',
    date: '17/03/2025',
    time: '07:32 PM',
    title: 'Flight Arrived',
    status: 'pending',
    icon: FlightBottomRight,
  },
  {
    id: '4',
    date: '17/03/2025',
    time: '07:32 PM',
    title: 'Delivered',
    status: 'pending',
    icon: Delivered,
  },
];

export default function ShipmentStatusScreen() {
  const router = useRouter();

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
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <BackButton size={24} color={Colors.secondary} />
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.title} color="secondary" semiBold>
                  Shipment Current Status
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.content}>
          <View style={styles.contentContainer}>
            {trackingSteps.map((step, index) => (
              <View key={step.id} style={[styles.stepContainer, index === 0 ? {marginTop: 20} : '' ]}>
                <View style={styles.timelineLeft}>
                  <Text style={styles.date}>{step.date}</Text>
                  <Text style={styles.time}>{step.time}</Text>
                </View>

                <View style={styles.timelineCenter}>
                  <View
                    style={[
                      styles.stepIcon,
                      step.status === 'completed' && styles.stepIconCompleted,
                    ]}
                  >
                    <step.icon
                      size={20}
                      color={
                        step.status === 'completed'
                          ? Colors.secondary
                          : Colors.primary
                      }
                    />
                  </View>
                  {index < trackingSteps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        step.status === 'completed' &&
                          styles.timelineLineCompleted,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.stepInfo}>
                  <Text style={styles.stepTitle} semiBold>
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.stepStatus,
                      step.status === 'completed' && styles.stepStatusCompleted,
                    ]}
                  >
                    {step.status === 'completed' ? 'Completed' : '- - - - - -'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
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
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backButton: {
    flex: 1,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.primary,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    marginTop: -100,
    padding: 24,
    position: 'relative',
    zIndex: 3,
  },
  headerText: {
    flex: 4,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'OpenSans_600SemiBold'
  },
  contentContainer: {
    flex: 1,
    gap: 15,
    backgroundColor: Colors.secondary,
    borderRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'web' ? 24 : 12,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 0,
    marginLeft: 10,
    marginTop: -20
  },
  timelineLeft: {
    width: 100,
    paddingRight: 16,
    alignItems: 'flex-end'
  },
  date: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 4,
    fontFamily: 'OpenSans_600SemiBold'
  },
  time: {
    fontSize: 12,
    color: Colors.primary,
    opacity: 0.6,
    fontFamily: 'OpenSans_400Regular'
  },
  timelineCenter: {
    alignItems: 'center',
    width: 40,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepIconCompleted: {
    backgroundColor: '#1C33FF',
    borderColor: '#1C33FF',
  },
  timelineLine: {
    width: 2,
    height: 80,
    backgroundColor: Colors.border,
    marginTop: 0,
  },
  timelineLineCompleted: {
    backgroundColor: '#1C33FF',
  },
  stepInfo: {
    flex: 1,
    paddingLeft: 16,
  },
  stepTitle: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 4,
    fontFamily: 'OpenSans_600SemiBold'
  },
  stepStatus: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.7,
  },
  stepStatusCompleted: {
    color: Colors.success,
    backgroundColor: '#DDFFF3',
    width: '70%',
    textAlign: 'center',
    fontFamily: 'OpenSans_600SemiBold'
  },
});
