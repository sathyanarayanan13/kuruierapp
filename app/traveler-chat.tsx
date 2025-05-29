import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import TravelerChatHeader from '@/components/chat/TravelerChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import DeliveryConfirmDrawer from '@/components/chat/DeliveryConfirmDrawer';
import OtpVerificationDrawer from '@/components/chat/OtpVerificationDrawer';
import SuccessPopup from '@/components/SuccessPopup';
import Text from '@/components/Text';
import DeliveryPopup from '@/components/chat/DeliveryPopup';
import FlightRight from '@/assets/svgs/FlightRight';
import NextIcon from '@/assets/svgs/NextIcon';

interface Message {
  id: string;
  text: string;
  sent: boolean;
}

const initialMessages = [
  {
    id: '1',
    text: 'Hello 👋',
    sent: false,
  },
];

const predefinedMessages = [
  'I am ready to accept',
  'Available!',
  'I accept only snacks',
  '<200g',
  '<500g',
  'I accept only documents',
  '<1Kg',
  '<2Kg',
];

export default function TravelerChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [showReadyMessage, setShowReadyMessage] = useState(true);
  const [chatUnlocked, setChatUnlocked] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showDeliveryConfirm, setShowDeliveryConfirm] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleReadyMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: message,
        sent: true,
      },
      {
        id: Date.now().toString() + 1,
        text: "I've made the payment",
        sent: false,
      },
    ]);
    setShowReadyMessage(false);
    setTimeout(() => {
      setChatUnlocked(true);
      setShowDeliveryPopup(true);
    }, 1500);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TravelerChatHeader
          onBack={handleBack}
          onDeliveryInfo={() => setShowDeliveryConfirm(true)}
          chatUnlocked={chatUnlocked}
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
          <ChatMessages messages={messages} />
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
              onChangeText={setInputText}
              onSend={handleSendMessage}
            />
          ) : null}
        </View>

        <DeliveryPopup
          visible={showDeliveryPopup}
          onClose={() => setShowDeliveryPopup(false)}
        />

        {/* <View style={styles.footer}>
          {showReadyMessage ? (
            <TouchableOpacity
              style={styles.readyButton}
              onPress={handleReadyMessage}
            >
              <Text style={styles.readyButtonText} color="secondary">
                I'm ready to accept
              </Text>
            </TouchableOpacity>
          ) : chatUnlocked ? (
            <ChatInput
              value={inputText}
              onChangeText={setInputText}
              onSend={handleSendMessage}
            />
          ) : null}
        </View> */}

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
