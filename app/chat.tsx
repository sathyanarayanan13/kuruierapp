import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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
import FlightRight from '@/assets/svgs/FlightRight';
import NextIcon from '@/assets/svgs/NextIcon';

const predefinedMessages = [
  'I have document',
  'I have snacks',
  'I have Clothes',
  '<200g',
  '<500g',
  'I have Clothes',
  '<200g',
  '<500g',
];

const initialMessages = [
  {
    id: '1',
    text: 'Hello 😊',
    sent: true,
  },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(initialMessages);
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
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/shipment-status');
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: inputText.trim(),
          sent: true,
        },
      ]);
      setInputText('');
    }
  };

  const handlePredefinedMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: message,
        sent: true,
      },
    ]);
  };

  const handlePayment = () => {
    setShowPaymentSuccess(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentSuccess(false);
    setIsPaid(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString() + '1',
        text: 'I have snacks',
        sent: true,
      },
      {
        id: Date.now().toString() + '2',
        text: 'Hi Shipment Owner 👋',
        sent: false,
      },
      {
        id: Date.now().toString() + '3',
        text: 'I am Ready to accept',
        sent: false,
      },
    ]);
  };

  const handleViewShipmentStatus = () => {
    router.push('/shipment-status')
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
          <ChatMessages messages={messages} />
        </ImageBackground>

        <View style={styles.footer}>
          {!isPaid ? (
            <>
              <PredefinedMessages
                messages={predefinedMessages}
                onMessageSelect={handlePredefinedMessage}
              />
              <TouchableOpacity
                style={styles.paymentButton}
                onPress={handlePayment}
              >
                <Text
                  style={styles.paymentButtonText}
                  color="secondary"
                  semiBold
                >
                  Go to Payment
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <ChatInput
              value={inputText}
              onChangeText={setInputText}
              onSend={handleSendMessage}
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

