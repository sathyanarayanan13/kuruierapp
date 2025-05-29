import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Colors from '@/constants/Colors';
import Text from '@/components/Text';

interface ChatListItemProps {
  chat: {
    id: string;
    type: 'direct' | 'group';
    name: string;
    avatar?: any; // Use 'any' for require()'d images
    avatars?: any[]; // Use 'any[]' for array of require()'d images
    lastMessage: string;
    time: string;
    unreadCount: number;
  };
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat }) => {
  const renderAvatars = () => {
    if (chat.type === 'group' && chat.avatars && chat.avatars.length > 0) {
      // Render up to 3 avatars for group chats
      return (
        <View style={styles.groupAvatarContainer}>
          {chat.avatars.slice(0, 3).map((avatar, index) => (
            <Image
              key={index}
              source={avatar}
              style={[styles.groupAvatarImage, index > 0 && { marginLeft: -25 }]} // Overlap avatars
            />
          ))}
        </View>
      );
    } else if (chat.type === 'direct' && chat.avatar) {
      // Render single avatar for direct chats
      return (
        <View style={styles.singleAvatarContainer}>
          <Image source={chat.avatar} style={styles.singleAvatarImage} />
        </View>
      );
    }
    // Fallback or default avatar if needed
    return null;
  };

  return (
    <View style={styles.container}>
      {renderAvatars()}
      <View style={styles.chatInfoContainer}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} semiBold>{chat.name}</Text>
          <Text style={styles.chatTime}>{chat.time}</Text>
        </View>
        <View style={styles.chatFooter}>
           <Text style={styles.lastMessage} numberOfLines={1}>{chat.lastMessage}</Text>
           {chat.unreadCount > 0 && (
             <View style={styles.unreadBadge}>
               <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
             </View>
           )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card, // White background for list items
    borderRadius: 8,
    marginBottom: 8, // Space between items
    paddingHorizontal: 12,
    shadowColor: '#000', // subtle shadow for list items
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  singleAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
  },
  singleAvatarImage: {
    width: '100%',
    height: '100%',
  },
  groupAvatarContainer: {
    flexDirection: 'row',
    marginRight: 12,
    // Adjust these styles to match the overlapping avatar design
  },
  groupAvatarImage: {
    width: 50,
    height: 50,
    borderRadius: 15,
    borderWidth: 1, // Add border for overlapping effect if needed
    borderColor: Colors.card, // Match item background
  },
  chatInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: 'OpenSans_600SemiBold'
  },
  chatTime: {
    fontSize: 12,
    color: Colors.text,
    opacity: 0.7,
    fontFamily: 'OpenSans_300Light'
  },
   chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    opacity: 0.8,
    marginRight: 8,
    fontFamily: 'OpenSans_300Light'
  },
  unreadBadge: {
    backgroundColor: Colors.mainTheme,
    borderRadius: 50,
    paddingHorizontal: 6,
    paddingBottom: 3,
    width: 20,
    height: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  unreadCount: {
    fontSize: 12,
    color: Colors.secondary,
    fontFamily: 'OpenSans_600SemiBold',
    marginTop: -2
  },
});

export default ChatListItem; 