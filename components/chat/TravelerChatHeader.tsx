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
  isConnected?: boolean;
  isTyping?: boolean;
  typingUsers?: string[];
  onlineUsers?: string[];
  otherUserName?: string;
}

export default function TravelerChatHeader({
  onBack,
  onDeliveryInfo,
  chatUnlocked,
  isConnected = true,
  isTyping = false,
  typingUsers = [],
  onlineUsers = [],
  otherUserName = 'Shipment Owner'
}: TravelerChatHeaderProps) {
  const renderStatusText = () => {
    if (isTyping && typingUsers.length > 0) {
      const typingNames = typingUsers.join(', ');
      return (
        <Text style={styles.typingText}>
          {typingNames} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </Text>
      );
    }
    
    if (isConnected) {
      return (
        <View style={styles.onlineStatus}>
          <View style={[styles.onlineDot, { backgroundColor: Colors.success }]} />
          <Text style={[styles.onlineText, { color: Colors.success }]}>Online</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.onlineStatus}>
        <View style={[styles.onlineDot, { backgroundColor: Colors.error }]} />
        <Text style={[styles.onlineText, { color: Colors.error }]}>Offline</Text>
      </View>
    );
  };

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
              {otherUserName}
            </Text>
            {renderStatusText()}
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
  },
  onlineText: {
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold'
  },
  typingText: {
    fontSize: 14,
    color: Colors.mainTheme,
    fontFamily: 'OpenSans_400Regular',
    fontStyle: 'italic',
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
