import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  RefreshControl,
  AppState,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useCallback, useRef } from 'react';
import Colors from '@/constants/Colors';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import PredefinedMessages from '@/components/chat/PredefinedMessages';
import InviteDrawer from '@/components/chat/InviteDrawer';
import GroupDrawer from '@/components/chat/GroupDrawer';
import DeliveryPopup from '@/components/chat/DeliveryPopup';
import MembersDrawer from '@/components/chat/MembersDrawer';
import SuccessPopup from '@/components/SuccessPopup';
import Text from '@/components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import BouncingDotsLoader from '@/components/chat/BouncingDotsLoader';
import LoadingSpinner from '@/components/LoadingSpinner';
import FlightRight from '@/assets/svgs/FlightRight';
import NextIcon from '@/assets/svgs/NextIcon';
import { 
  getPredefinedMessages, 
  createPaymentIntent, 
  confirmPayment, 
  getChatMessages,
  sendMessage,
  ChatMessage,
  ChatAccess,
  ChatMessagesResponse,
  getStoredUser
} from '@/utils/api';
import { useStripe } from '@stripe/stripe-react-native';
import WebSocketService from '@/utils/WebSocketService';
import NotificationService from '@/utils/NotificationService';

const PAYMENT_AMOUNT = 200; // INR

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showInviteDrawer, setShowInviteDrawer] = useState(false);
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);
  const [showGroupDrawer, setShowGroupDrawer] = useState(false);
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);
  const [showMembersDrawer, setShowMembersDrawer] = useState(false);
  const [predefinedMessages, setPredefinedMessages] = useState<string[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [chatAccess, setChatAccess] = useState<ChatAccess | null>(null);
  const [canSendFreeText, setCanSendFreeText] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(true);
  
  // WebSocket states
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [otherUserName, setOtherUserName] = useState('Traveller 1');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentSheetLoading, setPaymentSheetLoading] = useState(false);
  const [paymentSheetError, setPaymentSheetError] = useState<string | null>(null);
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState<string | null>(null);
  const { matchId } = useLocalSearchParams();
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (matchId) {
      initializeChat();
    }
  }, [matchId]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground
        if (matchId && isPaid) {
          refreshMessages();
        }
      }
      appState.current = nextAppState;
    });

    return () => subscription?.remove();
  }, [matchId, isPaid]);

  useEffect(() => {
    if (!matchId) return;
    // Ask for push notification permission on entering the chat
    NotificationService.registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    if (matchId) {
      WebSocketService.joinChat(matchId as string);
    }
    return () => {
      if (matchId) {
        WebSocketService.leaveChat(matchId as string);
      }
      stopTyping();
    };
  }, [matchId]);

  const initializeChat = async () => {
    if (!matchId) return;
    
    try {
      setInitialLoading(true);
      setPaymentStatusLoading(true);
      setLoadingMessages(true);
      setErrorMessages(null);
      
      // Get current user
      const user = await getStoredUser();
      setCurrentUserId(user?.id || null);
      
      // Initialize WebSocket connection
      if (!WebSocketService.isSocketConnected()) {
        await WebSocketService.connect();
      }
      
      // Join the chat room
      WebSocketService.joinChat(matchId as string);
      
      // Setup WebSocket listeners
      setupWebSocketListeners();
      
      // Fetch messages and chat access in one call
      const chatData: ChatMessagesResponse = await getChatMessages(matchId as string);
      
      setMessages(chatData.messages);
      setChatAccess(chatData.chatAccess);
      setCanSendFreeText(chatData.canSendFreeText);
      
      // Check if chat is already paid/unlocked - set this immediately
      const isChatPaid = chatData.chatAccess.unlockedByPayment;
      setIsPaid(isChatPaid);
      setPaymentStatusLoading(false);
      
      // Set other user name
      const otherUser = chatData.messages.find(msg => msg.senderId !== user?.id)?.sender;
      if (otherUser) {
        setOtherUserName(otherUser.username);
      }
      
      // Fetch predefined messages in parallel
      fetchPredefinedMessages();
      
      setIsConnected(true);
      
    } catch (err: any) {
      setErrorMessages(err.message || 'Failed to load chat');
      console.error('Error fetching chat data:', err);
    } finally {
      setLoadingMessages(false);
      setInitialLoading(false);
    }
  };

  const setupWebSocketListeners = () => {
    // Remove only the specific handler on unmount
    // Define the handler outside so it can be referenced in cleanup
    // (moved to useEffect below)
  };

  useEffect(() => {
    if (!matchId) return;
    // Setup WebSocket 'new_message' listener
    const onNewMessage = (message: ChatMessage) => {
      setMessages(prev => {
        // Remove any optimistic message with same content and sender
        const filtered = prev.filter(
          m =>
            !(
              m.id.startsWith('temp-') &&
              m.messageContent === message.messageContent &&
              m.senderId === message.senderId
            )
        );
        // Avoid duplicate real messages
        if (filtered.some(m => m.id === message.id)) return filtered;
        return [...filtered, message];
      });
      // Show notification if app is in background
      if (AppState.currentState !== 'active') {
        NotificationService.scheduleLocalNotification(
          otherUserName,
          message.messageContent,
          { matchId, messageId: message.id }
        );
      }
    };
    WebSocketService.on('new_message', onNewMessage);
    // Add other listeners as needed, using the same pattern
    return () => {
      WebSocketService.off('new_message', onNewMessage);
      // Remove other listeners here if added
    };
  }, [matchId, otherUserName]);

  const fetchChatData = async () => {
    if (!matchId) return;
    
    try {
      setLoadingMessages(true);
      setErrorMessages(null);
      
      // Fetch messages and chat access in one call
      const chatData: ChatMessagesResponse = await getChatMessages(matchId as string);
      
      setMessages(chatData.messages);
      setChatAccess(chatData.chatAccess);
      setCanSendFreeText(chatData.canSendFreeText);
      
      // Check if chat is already paid/unlocked
      setIsPaid(chatData.chatAccess.unlockedByPayment);
      
    } catch (err: any) {
      setErrorMessages(err.message || 'Failed to load chat');
      console.error('Error fetching chat data:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const refreshMessages = async () => {
    if (!matchId) return;
    
    try {
      const chatData: ChatMessagesResponse = await getChatMessages(matchId as string);
      setMessages(chatData.messages);
      setChatAccess(chatData.chatAccess);
      setCanSendFreeText(chatData.canSendFreeText);
      setIsPaid(chatData.chatAccess.unlockedByPayment);
    } catch (err: any) {
      console.error('Error refreshing messages:', err);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchChatData();
    setRefreshing(false);
  }, [matchId]);

  const fetchPredefinedMessages = async () => {
    try {
      const messages = await getPredefinedMessages();
      setPredefinedMessages(messages);
    } catch (err) {
      console.error('Failed to load predefined messages:', err);
    }
  };

  const handleBack = () => {
    // Leave chat room when navigating back
    if (matchId) {
      WebSocketService.leaveChat(matchId as string);
    }
    
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/shipment-status');
    }
  };

  const handleTyping = (text: string) => {
    setInputText(text);
    
    if (text.length > 0 && !isTyping && matchId) {
      setIsTyping(true);
      WebSocketService.startTyping(matchId as string);
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
    if (isTyping && matchId) {
      setIsTyping(false);
      WebSocketService.stopTyping(matchId as string);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !matchId || sendingMessage) return;
    setSendingMessage(true);
    stopTyping();
    // Optimistic UI: add the message immediately
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      matchId: matchId as string,
      senderId: currentUserId || 'current',
      messageType: 'TEXT',
      messageContent: inputText.trim(),
      fileUrl: null,
      fileName: null,
      fileSize: null,
      isPredefined: false,
      createdAt: new Date().toISOString(),
      sender: { id: currentUserId || 'current', username: 'You' }
    };
    setMessages(prev => [...prev, tempMessage]);
    try {
      await sendMessage({
        matchId: matchId as string,
        messageContent: inputText.trim(),
        messageType: 'TEXT',
        isPredefined: false,
      });
      setInputText('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendMedia = async (media: { uri: string; type: 'IMAGE' | 'FILE' | 'VOICE_NOTE'; fileName: string; fileSize?: number }) => {
    if (!matchId || sendingMessage) return;
    setSendingMessage(true);
    stopTyping();
    try {
      await sendMessage({
        matchId: matchId as string,
        messageContent: media.fileName,
        messageType: media.type,
        isPredefined: false,
        fileUri: media.uri,
      });
    } catch (err: any) {
      console.error('Failed to send media:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handlePredefinedMessage = async (message: string) => {
    if (!matchId || sendingMessage) return;
    
    setSendingMessage(true);
    stopTyping();
    
    try {
      const sentMessage = await sendMessage({
        matchId: matchId as string,
        messageContent: message,
        messageType: 'TEXT',
        isPredefined: true,
      });
      
      // Add the sent message to the local state
      setMessages(prev => [...prev, sentMessage]);
    } catch (err: any) {
      console.error('Failed to send predefined message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentSuccess(false);
    setIsPaid(true);
    // Refresh chat data to get updated access status
    fetchChatData();
  };

  const handleViewShipmentStatus = () => {
    router.push('/shipment-status')
  }

  const openPaymentSheet = async () => {
    setPaymentSheetLoading(true);
    setPaymentSheetError(null);
    let result
    try {
      // 1. Create PaymentIntent via backend
      if (!matchId) throw new Error('No matchId found for payment');
      const clientSecret = await createPaymentIntent(matchId as string, PAYMENT_AMOUNT);
      setPaymentIntentClientSecret(clientSecret);
      // 2. Init PaymentSheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Kurierv2',
        allowsDelayedPaymentMethods: false,
      });
      if (initError) throw initError;
      // 3. Present PaymentSheet
      result = await presentPaymentSheet();
      if (result.error) throw result.error;
      // 4. Confirm payment on backend
      const data = await confirmPayment(clientSecret);
      if (!(data && (data.success || data.message === 'Success'))) {
        throw new Error(data?.message || 'Payment confirmation failed');
      }
    } catch (err: any) {
      setPaymentSheetError(err.message || 'Payment failed. Please try again.');
    } finally {
      setPaymentSheetLoading(false);
      if(!result?.error) {
        setShowPaymentSuccess(true);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (matchId) {
        WebSocketService.leaveChat(matchId as string);
      }
      stopTyping();
    };
  }, [matchId]);

  // Show loading screen while checking payment status
  if (initialLoading || paymentStatusLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={styles.container}>
          <ChatHeader
            isGroupChat={isGroupChat}
            onBack={handleBack}
            onInvite={() => setShowInviteDrawer(true)}
            onDeliveryInfo={() => router.push('/package-delivery')}
            onShowMembers={() => setShowMembersDrawer(true)}
            isPaid={isPaid}
            isConnected={isConnected}
            isTyping={isTyping}
            typingUsers={typingUsers}
            onlineUsers={onlineUsers}
            otherUserName={otherUserName}
          />
          
          <View style={styles.loadingContainer}>
            <LoadingSpinner size={40} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.container}>
        <ChatHeader
          isGroupChat={isGroupChat}
          onBack={handleBack}
          onInvite={() => setShowInviteDrawer(true)}
          onDeliveryInfo={() => router.push('/package-delivery')}
          onShowMembers={() => setShowMembersDrawer(true)}
          isPaid={isPaid}
          isConnected={isConnected}
          isTyping={isTyping}
          typingUsers={typingUsers}
          onlineUsers={onlineUsers}
          otherUserName={otherUserName}
        />

        {isPaid && (
          <TouchableOpacity onPress={handleViewShipmentStatus}>
            <View style={styles.flightStatus} >
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
          style={{ flex: 1, padding: 16 }}
          imageStyle={{ borderRadius: 16 }}
        >
          {loadingMessages ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <LoadingSpinner size={40} />
              <Text style={styles.loadingText}>Loading messages...</Text>
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
          {!isPaid ? (
            <>
              <PredefinedMessages
                messages={predefinedMessages}
                onMessageSelect={handlePredefinedMessage}
              />
              {paymentSheetError &&
                paymentSheetError !== 'Payment confirmed and chat unlocked successfully' && (
                  <Text style={{ color: 'red', textAlign: 'center' }}>{paymentSheetError}</Text>
                )}
              <TouchableOpacity
                style={[styles.paymentButton, paymentSheetLoading && { opacity: 0.5 }]}
                onPress={openPaymentSheet}
                disabled={paymentSheetLoading}
              >
                <Text
                  style={styles.paymentButtonText}
                  color="secondary"
                  semiBold
                >
                  {paymentSheetLoading ? 'Processing...' : 'Pay & Unlock Traveller'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <ChatInput
              value={inputText}
              onChangeText={handleTyping}
              onSend={handleSendMessage}
              onSendMedia={handleSendMedia}
              disabled={sendingMessage}
            />
          )}
        </View>

        <InviteDrawer
          visible={showInviteDrawer}
          onClose={() => setShowInviteDrawer(false)}
          onInvite={() => {
            setShowInviteDrawer(false);
            setShowInviteSuccess(true);
            setTimeout(() => setShowGroupDrawer(true), 2000);
          }}
        />

        <GroupDrawer
          visible={showGroupDrawer}
          onClose={() => setShowGroupDrawer(false)}
          onCreateGroup={() => {
            setShowGroupDrawer(false);
            setIsGroupChat(true);
            // setTimeout(() => setShowDeliveryPopup(true), 500);
          }}
        />

        <DeliveryPopup
          visible={showDeliveryPopup}
          onClose={() => setShowDeliveryPopup(false)}
        />

        <MembersDrawer
          visible={showMembersDrawer}
          onClose={() => setShowMembersDrawer(false)}
        />

        <SuccessPopup
          visible={showPaymentSuccess}
          message="Payment Successful"
          onClose={handlePaymentComplete}
        />

        <SuccessPopup
          visible={showInviteSuccess}
          message="Invitation Sent"
          onClose={() => setShowInviteSuccess(false)}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'OpenSans_500Medium',
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
    fontFamily: 'OpenSans_400Regular'
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    gap: 16,
  },
  paymentButton: {
    backgroundColor: Colors.mainTheme,
    height: 48,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    borderWidth: 1,
  },
  paymentButtonText: {
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold'
  },
});

