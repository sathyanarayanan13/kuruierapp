import React, { useState } from 'react';
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
import { Search } from 'lucide-react-native';
import ChatListItem from '@/components/chat/ChatListItem';

const airports = ['New York Airport', 'London Heathrow', 'Dubai International'];
const radiusOptions = ['5 km', '10 km', '15 km', '20 km'];
const { width, height } = Dimensions.get('window');

// Dummy data for chat list
const DUMMY_CHATS = [
  {
    id: '1',
    type: 'direct',
    name: 'Traveler 1',
    avatar: require('@/assets/images/avatar1.png'), // Use require()
    lastMessage: 'Hi 👋, Perfect will check it.',
    time: '09:34 PM',
    unreadCount: 0,
  },
  {
    id: '2',
    type: 'direct',
    name: 'Traveler 2',
    avatar: require('@/assets/images/avatar2.png'), // Use require()
    lastMessage: 'Hi 👋, Perfect will check it.',
    time: '09:34 PM',
    unreadCount: 1,
  },
  {
    id: '3',
    type: 'group',
    name: 'Group Chat 1',
    avatars: [ // Use require()
      require('@/assets/images/avatar1.png'),
      require('@/assets/images/avatar2.png'),
      require('@/assets/images/avatar3.png'),
    ],
    lastMessage: 'Hi 👋, Perfect will ...',
    time: '09:34 PM',
    unreadCount: 3,
  },
   {
    id: '4',
    type: 'direct',
    name: 'Traveler 1',
    avatar: require('@/assets/images/avatar1.png'), // Use require()
    lastMessage: 'Hi 👋, Perfect will check it.',
    time: '09:34 PM',
    unreadCount: 0,
  },
  {
    id: '5',
    type: 'direct',
    name: 'Traveler 2',
    avatar: require('@/assets/images/avatar2.png'), // Use require()
    lastMessage: 'Hi 👋, Perfect will check it.',
    time: '09:34 PM',
    unreadCount: 1,
  },
  {
    id: '6',
    type: 'group',
    name: 'Group Chat 2',
    avatars: [ // Use require()
      require('@/assets/images/avatar1.png'),
      require('@/assets/images/avatar2.png'),
      require('@/assets/images/avatar3.png'),
    ],
    lastMessage: 'Hi 👋, Perfect will ...',
    time: '09:34 PM',
    unreadCount: 3,
  },
  {
    id: '7',
    type: 'direct',
    name: 'Traveler 1',
    avatar: require('@/assets/images/avatar1.png'), // Use require()
    lastMessage: 'Hi 👋, Perfect will check it.',
    time: '09:34 PM',
    unreadCount: 0,
  },
  {
    id: '8',
    type: 'direct',
    name: 'Traveler 2',
    avatar: require('@/assets/images/avatar2.png'), // Use require()
    lastMessage: 'Hi 👋, Perfect will check it.',
    time: '09:34 PM',
    unreadCount: 1,
  },
  {
    id: '9',
    type: 'group',
    name: 'Group Chat 2',
    avatars: [ // Use require()
      require('@/assets/images/avatar1.png'),
      require('@/assets/images/avatar2.png'),
      require('@/assets/images/avatar3.png'),
    ],
    lastMessage: 'Hi 👋, Perfect will ...',
    time: '09:34 PM',
    unreadCount: 3,
  },
];

export default function ChatTab() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

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

  // Filter chats based on search text (basic example)
  const filteredChats = DUMMY_CHATS.filter(chat =>
    chat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Render chat item using the ChatListItem component
  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
       onPress={() => { router.push('/chat') }}
       activeOpacity={1}
       style={{ flex: 1 }}
    >
      <ChatListItem chat={item} />
    </TouchableOpacity>
  );

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
          <FlatList
            data={filteredChats}
            keyExtractor={item => item.id}
            renderItem={renderChatItem}
            contentContainerStyle={styles.chatListContent}
            showsVerticalScrollIndicator={false}
          />
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
