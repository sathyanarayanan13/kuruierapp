import { ScrollView, View, StyleSheet, Image } from 'react-native';
import { useRef } from 'react';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import BouncingDotsLoader from '@/components/chat/BouncingDotsLoader';

interface Message {
  id: string;
  text: string;
  sent: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      onContentSizeChange={() =>
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }
    >
      {messages.map((message, index) => {
        const showAvatar =
          index === 0 || messages[index - 1].sent !== message.sent;

        return (
          <View key={message.id}>
            {showAvatar && (
              <Image
                source={{
                  uri: message.sent
                    ? 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
                    : 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
                }}
                style={[ { marginBottom: 5 } ,message.sent ? styles.avatar : styles.receiverAvatar]}
              />
            )}
            <View
              style={[
                styles.messageContainer,
                message.sent ? styles.sentMessage : styles.receivedMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.sent
                    ? styles.sentMessageText
                    : styles.receivedMessageText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        );
      })}

      <View>
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
          }}
          style={[ { marginBottom: 5 } , styles.receiverAvatar]}
        />
        <View style={[styles.messageContainer, styles.receivedMessage]}>
          <BouncingDotsLoader />
        </View>
      </View>
    </ScrollView>
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
});