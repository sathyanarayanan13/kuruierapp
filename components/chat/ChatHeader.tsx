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
  isConnected?: boolean;
  isTyping?: boolean;
  typingUsers?: string[];
  onlineUsers?: string[];
  otherUserName?: string;
}

export default function ChatHeader({ 
  isGroupChat, 
  onBack, 
  onInvite, 
  onDeliveryInfo,
  onShowMembers,
  isPaid,
  isConnected = true,
  isTyping = false,
  typingUsers = [],
  onlineUsers = [],
  otherUserName = 'Traveller 1'
}: ChatHeaderProps) {
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
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName} semiBold>
              {isGroupChat ? 'Dubai Courier' : otherUserName}
            </Text>
            {isGroupChat ? (
              <TouchableOpacity onPress={onShowMembers}>
                <Text style={styles.memberCount}>3 Members</Text>
              </TouchableOpacity>
            ) : (
              renderStatusText()
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
  },
  onlineText: {
    fontSize: 13,
    fontFamily: 'OpenSans_600SemiBold'
  },
  typingText: {
    fontSize: 13,
    color: Colors.mainTheme,
    fontFamily: 'OpenSans_400Regular',
    fontStyle: 'italic',
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