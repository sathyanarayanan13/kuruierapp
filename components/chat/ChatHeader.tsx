import { View, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { ChevronLeft, UserPlus, Plane } from 'lucide-react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import InviteIcon from '@/assets/svgs/InviteIcon';
import DeliveryIcon from '@/assets/svgs/DeliveryIcon';

interface ChatHeaderProps {
  isGroupChat: boolean;
  onBack: () => void;
  onInvite: () => void;
  onDeliveryInfo: () => void;
  onShowMembers: () => void;
  isPaid: boolean;
}

export default function ChatHeader({ 
  isGroupChat, 
  onBack, 
  onInvite, 
  onDeliveryInfo,
  onShowMembers,
  isPaid
}: ChatHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName} semiBold>
              {isGroupChat ? 'Dubai Courier' : 'Traveller 1'}
            </Text>
            {isGroupChat ? (
              <TouchableOpacity onPress={onShowMembers}>
                <Text style={styles.memberCount}>3 Members</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.onlineStatus}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            )}
          </View>
        </View>

        {isGroupChat ? (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onDeliveryInfo}
          >
            {/* <DeliveryIcon size={24} color={Colors.primary} /> */}
          </TouchableOpacity>
        ) : (
          isPaid && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onInvite}
            >
              <InviteIcon width={32} height={32} color="#5059A5" />
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 60 : 10,
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
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: Colors.success,
  },
  onlineText: {
    fontSize: 13,
    color: Colors.success,
    fontFamily: 'OpenSans_600SemiBold'
  },
  memberCount: {
    fontSize: 12,
    color: Colors.mainTheme,
    opacity: 0.9,
    fontFamily: 'OpenSans_600SemiBold'
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});