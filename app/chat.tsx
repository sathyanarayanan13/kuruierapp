import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
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
  ChatMessagesResponse
} from '@/utils/api';
import { useStripe } from '@stripe/stripe-react-native';

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
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentSheetLoading, setPaymentSheetLoading] = useState(false);
  const [paymentSheetError, setPaymentSheetError] = useState<string | null>(null);
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState<string | null>(null);
  const { matchId } = useLocalSearchParams();

  useEffect(() => {
    if (matchId) {
      initializeChat();
    }
  }, [matchId]);

  // Set up periodic refresh for messages (every 10 seconds)
  useEffect(() => {
    if (!matchId || !isPaid) return;

    const interval = setInterval(() => {
      refreshMessages();
    }, 10000);

    return () => clearInterval(interval);
  }, [matchId, isPaid]);

  const initializeChat = async () => {
    if (!matchId) return;
    
    try {
      setInitialLoading(true);
      setLoadingMessages(true);
      setErrorMessages(null);
      
      // Fetch messages and chat access in one call
      const chatData: ChatMessagesResponse = await getChatMessages(matchId as string);
      
      setMessages(chatData.messages);
      setChatAccess(chatData.chatAccess);
      setCanSendFreeText(chatData.canSendFreeText);
      
      // Check if chat is already paid/unlocked
      setIsPaid(chatData.chatAccess.unlockedByPayment);
      
      // Fetch predefined messages in parallel
      fetchPredefinedMessages();
      
    } catch (err: any) {
      setErrorMessages(err.message || 'Failed to load chat');
      console.error('Error fetching chat data:', err);
    } finally {
      setLoadingMessages(false);
      setInitialLoading(false);
    }
  };

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
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/shipment-status');
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !matchId || sendingMessage) return;
    
    setSendingMessage(true);
    try {
      const sentMessage = await sendMessage({
        matchId: matchId as string,
        messageContent: inputText.trim(),
        messageType: 'TEXT',
        isPredefined: false,
      });
      
      // Add the sent message to the local state
      setMessages(prev => [...prev, sentMessage]);
      setInputText('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
      // You could show an error toast here
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendMedia = async (media: { uri: string; type: 'IMAGE' | 'FILE' | 'VOICE_NOTE'; fileName: string; fileSize?: number }) => {
    if (!matchId || sendingMessage) return;
    
    setSendingMessage(true);
    try {
      const sentMessage = await sendMessage({
        matchId: matchId as string,
        messageContent: media.fileName,
        messageType: media.type,
        isPredefined: false,
        fileUri: media.uri,
      });
      
      // Add the sent message to the local state
      setMessages(prev => [...prev, sentMessage]);
    } catch (err: any) {
      console.error('Failed to send media:', err);
      // You could show an error toast here
    } finally {
      setSendingMessage(false);
    }
  };

  const handlePredefinedMessage = async (message: string) => {
    if (!matchId || sendingMessage) return;
    
    setSendingMessage(true);
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
          {initialLoading ? (
            <LoadingSpinner />
          ) : loadingMessages ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Loading messages...</Text>
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
                  {paymentSheetLoading ? 'Processing...' : 'Go to Payment'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <ChatInput
              value={inputText}
              onChangeText={setInputText}
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

