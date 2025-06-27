import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  AppState,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import TravelerChatHeader from '@/components/chat/TravelerChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import DeliveryConfirmDrawer from '@/components/chat/DeliveryConfirmDrawer';
import OtpVerificationDrawer from '@/components/chat/OtpVerificationDrawer';
import SuccessPopup from '@/components/SuccessPopup';
import Text from '@/components/Text';
import DeliveryPopup from '@/components/chat/DeliveryPopup';
import LoadingSpinner from '@/components/LoadingSpinner';
import FlightRight from '@/assets/svgs/FlightRight';
import NextIcon from '@/assets/svgs/NextIcon';
import { getPredefinedMessages, ChatMessage, getStoredUser } from '@/utils/api';
import WebSocketService from '@/utils/WebSocketService';
import NotificationService from '@/utils/NotificationService';

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    matchId: 'temp',
    senderId: 'other',
    messageType: 'TEXT',
    messageContent: 'Hello 👋',
    fileUrl: null,
    fileName: null,
    fileSize: null,
    isPredefined: false,
    createdAt: new Date().toISOString(),
    sender: { id: 'other', username: 'Other User' }
  },
];

export default function TravelerChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [showReadyMessage, setShowReadyMessage] = useState(true);
  const [chatUnlocked, setChatUnlocked] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showDeliveryConfirm, setShowDeliveryConfirm] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [predefinedMessages, setPredefinedMessages] = useState<string[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // WebSocket states
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [otherUserName, setOtherUserName] = useState('Other User');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const router = useRouter();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground
        if (chatUnlocked) {
          // Refresh messages if needed
        }
      }
      appState.current = nextAppState;
    });

    return () => subscription?.remove();
  }, [chatUnlocked]);

  const initializeChat = async () => {
    try {
      setLoadingMessages(true);
      setErrorMessages(null);
      
      // Get current user
      const user = await getStoredUser();
      setCurrentUserId(user?.id || null);
      
      // Initialize WebSocket connection if not connected
      if (!WebSocketService.isSocketConnected()) {
        await WebSocketService.connect();
      }
      
      // Setup WebSocket listeners
      setupWebSocketListeners();
      
      // Fetch predefined messages
      const messages = await getPredefinedMessages();
      setPredefinedMessages(messages);
      
      setIsConnected(true);
      
    } catch (err) {
      setErrorMessages('Failed to load quick messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const setupWebSocketListeners = () => {
    // New message received
    WebSocketService.on('new_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
      
      // Show notification if app is in background
      if (AppState.currentState !== 'active') {
        NotificationService.scheduleLocalNotification(
          otherUserName,
          message.messageContent,
          { matchId: 'temp', messageId: message.id }
        );
      }
    });

    // Typing indicators
    WebSocketService.on('user_typing', (data: { userId: string; username: string }) => {
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user !== data.username);
        return [...filtered, data.username];
      });
    });

    WebSocketService.on('typing_stop', (data: { userId: string; username: string }) => {
      setTypingUsers(prev => prev.filter(user => user !== data.username));
    });

    // User online status
    WebSocketService.on('user_online', (data: { userId: string; isOnline: boolean }) => {
      setOnlineUsers(prev => {
        if (data.isOnline) {
          return prev.includes(data.userId) ? prev : [...prev, data.userId];
        } else {
          return prev.filter(id => id !== data.userId);
        }
      });
    });

    // Connection status
    WebSocketService.on('connect', () => {
      setIsConnected(true);
    });

    WebSocketService.on('disconnect', () => {
      setIsConnected(false);
    });
  };

  const fetchPredefinedMessages = async () => {
    try {
      setLoadingMessages(true);
      setErrorMessages(null);
      const messages = await getPredefinedMessages();
      setPredefinedMessages(messages);
    } catch (err) {
      setErrorMessages('Failed to load quick messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleTyping = (text: string) => {
    setInputText(text);
    
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      WebSocketService.startTyping('temp');
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  const stopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      WebSocketService.stopTyping('temp');
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleReadyMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      matchId: 'temp',
      senderId: 'current',
      messageType: 'TEXT',
      messageContent: message,
      fileUrl: null,
      fileName: null,
      fileSize: null,
      isPredefined: true,
      createdAt: new Date().toISOString(),
      sender: { id: 'current', username: 'You' }
    };

    const responseMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      matchId: 'temp',
      senderId: 'other',
      messageType: 'TEXT',
      messageContent: "I've made the payment",
      fileUrl: null,
      fileName: null,
      fileSize: null,
      isPredefined: false,
      createdAt: new Date().toISOString(),
      sender: { id: 'other', username: 'Other User' }
    };

    setMessages((prev) => [...prev, newMessage, responseMessage]);
    setShowReadyMessage(false);
    setTimeout(() => {
      setChatUnlocked(true);
      setShowDeliveryPopup(true);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        matchId: 'temp',
        senderId: 'current',
        messageType: 'TEXT',
        messageContent: inputText.trim(),
        fileUrl: null,
        fileName: null,
        fileSize: null,
        isPredefined: false,
        createdAt: new Date().toISOString(),
        sender: { id: 'current', username: 'You' }
      };
      
      setMessages((prev) => [...prev, newMessage]);
      setInputText('');
      stopTyping();
    }
  };

  const handleSendMedia = (media: { uri: string; type: 'IMAGE' | 'FILE' | 'VOICE_NOTE'; fileName: string; fileSize?: number }) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      matchId: 'temp',
      senderId: 'current',
      messageType: media.type,
      messageContent: media.fileName,
      fileUrl: media.uri,
      fileName: media.fileName,
      fileSize: media.fileSize || 0,
      isPredefined: false,
      createdAt: new Date().toISOString(),
      sender: { id: 'current', username: 'You' }
    };
    
    setMessages((prev) => [...prev, newMessage]);
    stopTyping();
  };

  const handleDeliveryConfirm = () => {
    setShowDeliveryConfirm(false);
    setShowOtpVerification(true);
  };

  const handleOtpVerify = () => {
    setShowOtpVerification(false);
    setShowSuccess(true);
  };

  const handleViewShipmentStatus = () => {
    router.push('/shipment-status');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TravelerChatHeader
          onBack={handleBack}
          onDeliveryInfo={() => setShowDeliveryConfirm(true)}
          chatUnlocked={chatUnlocked}
          isConnected={isConnected}
          isTyping={isTyping}
          typingUsers={typingUsers}
          onlineUsers={onlineUsers}
          otherUserName={otherUserName}
        />

        {chatUnlocked && (
          <TouchableOpacity onPress={handleViewShipmentStatus}>
            <View style={styles.flightStatus}>
              <View style={styles.flightContainer}>
                <FlightRight width={20} height={20} />
                <Text style={styles.flightText}>
                  View your shipment current status
                </Text>
                <NextIcon width={20} height={20} />
              </View>
            </View>
          </TouchableOpacity>
        )}

        <ImageBackground
          source={require('@/assets/images/chatBg.png')}
          resizeMode="cover"
          style={{ flex: 1, padding: 16, opacity: 0.7 }}
          imageStyle={{ borderRadius: 16 }}
        >
          {loadingMessages ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <LoadingSpinner size="large" />
              <Text style={{ marginTop: 16, color: Colors.primary }}>Loading messages...</Text>
            </View>
          ) : errorMessages ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'red' }}>{errorMessages}</Text>
            </View>
          ) : (
            <ChatMessages messages={messages} />
          )}
        </ImageBackground>

        <View style={styles.footer}>
          {showReadyMessage ? (
            <View style={styles.predefinedContainer}>
              <ScrollView contentContainerStyle={styles.predefinedContent}>
                {predefinedMessages.map((message, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.predefinedMessage}
                    onPress={() => handleReadyMessage(message)}
                  >
                    <Text style={styles.predefinedText}>{message}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : chatUnlocked ? (
            <ChatInput
              value={inputText}
              onChangeText={handleTyping}
              onSend={handleSendMessage}
              onSendMedia={handleSendMedia}
              disabled={sendingMessage}
            />
          ) : null}
        </View>

        <DeliveryPopup
          visible={showDeliveryPopup}
          onClose={() => setShowDeliveryPopup(false)}
        />

        <DeliveryConfirmDrawer
          visible={showDeliveryConfirm}
          onClose={() => setShowDeliveryConfirm(false)}
          onConfirm={handleDeliveryConfirm}
        />

        <OtpVerificationDrawer
          visible={showOtpVerification}
          onClose={() => setShowOtpVerification(false)}
          onVerify={handleOtpVerify}
        />

        <SuccessPopup
          visible={showSuccess}
          message="Thanks for confirmation"
          onClose={() => setShowSuccess(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flightStatus: {
    backgroundColor: '#242A62',
    paddingVertical: 10,
  },
  flightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  flightText: {
    textAlign: 'center',
    color: Colors.secondary,
    fontFamily: 'OpenSans_500Medium',
  },
  footer: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  readyButton: {
    backgroundColor: Colors.mainTheme,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  readyButtonText: {
    fontSize: 14,
  },
  predefinedContainer: {
    maxHeight: 150,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  predefinedContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  predefinedMessage: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginRight: 4,
    borderWidth: 0.5,
    borderColor: '#E8EAFF',
  },
  predefinedText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_400Regular'
  },
});
