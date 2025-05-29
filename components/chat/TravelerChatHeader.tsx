import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { ChevronLeft, Box } from 'lucide-react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import DeliveryIcon from '@/assets/svgs/DeliveryIcon';

interface TravelerChatHeaderProps {
  onBack: () => void;
  onDeliveryInfo: () => void;
  chatUnlocked: boolean;
}

export default function TravelerChatHeader({
  onBack,
  onDeliveryInfo,
  chatUnlocked,
}: TravelerChatHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName} semiBold>
              Shipment Owner
            </Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>
        {chatUnlocked ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onDeliveryInfo}
          >
            <DeliveryIcon size={24} color={Colors.primary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 4,
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
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  onlineText: {
    fontSize: 14,
    color: Colors.success,
    fontFamily: 'OpenSans_600SemiBold'
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
