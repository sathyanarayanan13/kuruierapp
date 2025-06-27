import { ScrollView, View, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import BouncingDotsLoader from '@/components/chat/BouncingDotsLoader';
import VoicePlayer from '@/components/chat/VoicePlayer';
import FileViewer from '@/components/chat/FileViewer';
import { ChatMessage, getFileUrl } from '@/utils/api';
import { getStoredUser } from '@/utils/api';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await getStoredUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const renderMessageContent = (message: ChatMessage) => {
    switch (message.messageType) {
      case 'TEXT':
        return (
          <Text
            style={[
              styles.messageText,
              message.senderId === currentUserId
                ? styles.sentMessageText
                : styles.receivedMessageText,
            ]}
          >
            {message.messageContent}
          </Text>
        );
      case 'IMAGE':
        return (
          <TouchableOpacity onPress={() => setSelectedImage(getFileUrl(message.fileUrl, 'IMAGE') || '')}>
            <Image
              source={{ uri: getFileUrl(message.fileUrl, 'IMAGE') || '' }}
              style={styles.messageImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      case 'FILE':
        return (
          <FileViewer
            uri={getFileUrl(message.fileUrl, 'FILE') || ''}
            fileName={message.fileName || 'File'}
            fileSize={message.fileSize || 0}
          />
        );
      case 'VOICE_NOTE':
        return (
          <VoicePlayer
            uri={getFileUrl(message.fileUrl, 'VOICE_NOTE') || ''}
            fileName={message.fileName || 'Voice Message'}
          />
        );
      default:
        return (
          <Text
            style={[
              styles.messageText,
              message.senderId === currentUserId
                ? styles.sentMessageText
                : styles.receivedMessageText,
            ]}
          >
            {message.messageContent}
          </Text>
        );
    }
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.content}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message, index) => {
          const isSent = message.senderId === currentUserId;
          const showAvatar =
            index === 0 || messages[index - 1].senderId !== message.senderId;

          return (
            <View key={message.id}>
              {showAvatar && (
                <Image
                  source={{
                    uri: isSent
                      ? 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
                      : 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
                  }}
                  style={[{ marginBottom: 5 }, isSent ? styles.avatar : styles.receiverAvatar]}
                />
              )}
              <View
                style={[
                  styles.messageContainer,
                  message.messageType === 'IMAGE' ? styles.imageMessage : 
                  isSent ? styles.sentMessage : styles.receivedMessage,
                ]}
              >
                {renderMessageContent(message)}
              </View>
            </View>
          );
        })}

        <View>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
            }}
            style={[{ marginBottom: 5 }, styles.receiverAvatar]}
          />
          <View style={[styles.messageContainer, styles.receivedMessage]}>
            <BouncingDotsLoader />
          </View>
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <TouchableOpacity
          style={styles.imageModalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedImage(null)}
        >
          <Image
            source={{ uri: selectedImage || '' }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  avatar: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 13,
  },
  receiverAvatar: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 13,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1C33FF',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 22,
    marginBottom: 5
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCE0FF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 16,
    marginBottom: 5
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular'
  },
  sentMessageText: {
    color: Colors.secondary,
  },
  receivedMessageText: {
    color: Colors.primary,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  fileContainer: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  fileName: {
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold',
    color: Colors.secondary,
  },
  fileSize: {
    fontSize: 12,
    fontFamily: 'OpenSans_400Regular',
    color: Colors.secondary,
    opacity: 0.8,
  },
  voiceContainer: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  voiceText: {
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular',
    color: Colors.secondary,
  },
  imageMessage: {
    backgroundColor: 'transparent',
    padding: 0,
  },
});