import { View, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';

interface OtpVerificationDrawerProps {
  visible: boolean;
  onClose: () => void;
  onVerify: () => void;
}

export default function OtpVerificationDrawer({ visible, onClose, onVerify }: OtpVerificationDrawerProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]);
  const translateY = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    if (visible) {
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        mass: 1,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 1000,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (otp.every(digit => digit !== '')) {
      onVerify();
    }
  }, [otp]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      />
      <Animated.View 
        style={[
          styles.drawer,
          { transform: [{ translateY }] }
        ]}
      >
        <View style={styles.handle} />
        <View style={styles.content}>
          <Text style={styles.title} semiBold>
            Enter your Verification Code
          </Text>
          <Text style={styles.description}>
            We sent a verification code{'\n'}
            to +918767889933
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  digit !== '' && styles.otpInputFilled
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 12,
    fontFamily: 'OpenSans_600SemiBold'
  },
  description: {
    fontSize: 16,
    color: Colors.primary,
    opacity: 0.5,
    textAlign: 'left',
    marginBottom: 24,
    lineHeight: 20,
    fontFamily: 'OpenSans_400Regular'
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
    alignSelf:'center'
  },
  otpInput: {
    width: 68,
    height: 68,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    color: Colors.primary,
    backgroundColor: Colors.secondary,
    fontFamily: 'OpenSans_600SemiBold'
  },
  otpInputFilled: {
    borderColor: Colors.mainTheme,
    borderWidth: 2,
  },
});