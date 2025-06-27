import React, { useState, useEffect, useCallback } from 'react';
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
  FlatList,
  TextInput,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
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
import { Search } from 'lucide-react-native';
import ChatListItem from '@/components/chat/ChatListItem';
import { getChats, ChatListItem as ChatListItemType } from '@/utils/api';
import { useUserRole } from '@/utils/UserContext';

const airports = ['New York Airport', 'London Heathrow', 'Dubai International'];
const radiusOptions = ['5 km', '10 km', '15 km', '20 km'];
const { width, height } = Dimensions.get('window');

export default function ChatTab() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [chats, setChats] = useState<ChatListItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = useUserRole();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChats();
      setChats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [])
  );

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

  // Map backend roleInChat to app userRole
  const mapRoleInChatToUserRole = (roleInChat: string) => {
    if (roleInChat === 'SENDER') return 'TRAVELLER';
    if (roleInChat === 'RECEIVER') return 'SHIPMENT_OWNER';
    return roleInChat;
  };

  const filteredChats = chats
    .filter(chat => {
      // Only show chats where the mapped role matches the current user role
      return mapRoleInChatToUserRole(chat.roleInChat) === userRole;
    })
    .filter(chat => {
      // Filter by the other party's name
      const otherUser = userRole === 'SHIPMENT_OWNER'
        ? chat.match.trip.user
        : chat.match.shipment.user;
      return otherUser.username.toLowerCase().includes(searchText.toLowerCase());
    });

  // Render chat item using the ChatListItem component
  const renderChatItem = ({ item }: { item: ChatListItemType }) => {
    // Determine the other user and avatar
    const otherUser = userRole === 'SHIPMENT_OWNER'
      ? item.match.trip.user
      : item.match.shipment.user;
    // Use package image for shipment owner, or a default avatar for traveler
    const avatar = userRole === 'SHIPMENT_OWNER'
      ? require('@/assets/images/traveller.png')
      : item.match.shipment.packageImageUrl
        ? { uri: `http://194.164.150.61:3000${item.match.shipment.packageImageUrl}` }
        : require('@/assets/images/avatar1.png');
    // Get last message
    const lastMsg = item.match.chats.length > 0 ? item.match.chats[item.match.chats.length - 1] : null;
    const lastMessage = lastMsg ? lastMsg.messageContent : '';
    const lastTime = lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
    const type: 'direct' = 'direct';
    return (
      <TouchableOpacity 
         onPress={() => { router.push({ pathname: '/chat', params: { matchId: item.matchId } }) }}
         activeOpacity={1}
         style={{ flex: 1 }}
      >
        <ChatListItem
          chat={{
            id: item.id,
            type,
            name: otherUser.username,
            avatar,
            lastMessage,
            time: lastTime,
            unreadCount: 0, // You can update this if you have unread logic
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <ImageBackground
            source={require('@/assets/images/travellerBanner.png')}
            style={styles.banner}
            resizeMode="cover"
          >
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <BackButton size={24} color={Colors.secondary} />
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.title} color="secondary" semiBold>
                  Chats
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.searchContainerWrapper}>
          <View style={styles.searchContainer}>
            <Search size={20} color='#586377' opacity={0.6}/>
            <TextInput
              style={styles.searchInput}
              placeholder="Search message..."
              placeholderTextColor='#586377'
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        <View style={styles.chatListWrapper}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
              <Text>Loading chats...</Text>
            </View>
          ) : error ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: 'red' }}>{error}</Text>
            </View>
          ) : filteredChats.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
              <Text>No chats available</Text>
            </View>
          ) : (
            <FlatList
              data={filteredChats}
              keyExtractor={item => item.id}
              renderItem={renderChatItem}
              contentContainerStyle={styles.chatListContent}
              showsVerticalScrollIndicator={false}
            />
          )}
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
  headerContainer: {
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
  headerContent: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    gap: 0,
    marginTop: 35,
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
  searchContainerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 16
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  chatListWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatListContent: {
    paddingBottom: 16,
  },
});
