import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import VerificationPopup from '@/components/VerificationPopup';
import BackButton from '@/assets/svgs/BackButton';
import { verifyOtp, resendOtp } from '@/utils/api';
import { validateOtp } from '@/utils/validation';

export default function VerifyScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showPopup, setShowPopup] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const router = useRouter();
  const { mobile, userId } = useLocalSearchParams();

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    try {
      const enteredOtp = otp.join('');
      
      if (!validateOtp(enteredOtp)) {
        Alert.alert('Error', 'Please enter a valid 4-digit OTP');
        return;
      }

      setLoading(true);
      const response = await verifyOtp(userId as string, enteredOtp);
      
      setVerificationSuccess(true);
      setShowPopup(true);

      // Navigate based on user role
      if (response.user.currentRole === 'SHIPMENT_OWNER') {
        router.replace('/travelers-list');
      } else {
        router.replace('/courier-list');
      }
    } catch (error: any) {
      setVerificationSuccess(false);
      setShowPopup(true);
      Alert.alert('Error', error.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      await resendOtp(userId as string);
      Alert.alert('Success', 'New OTP sent successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleChangeMobile = () => {
    router.back();
  };

  useEffect(() => {
    setTimeout(() => {
      setShowPopup(false);
    }, 1500);
  }, [verificationSuccess]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} bounces={false}>
        <View style={styles.imageWrapper}>
          <ImageBackground
            source={require('@/assets/images/verify.png')}
            style={styles.banner}
            resizeMode="cover"
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <BackButton size={24} color={Colors.secondary} />
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.title} color="secondary" semiBold>
                  Verify Account
                </Text>
                <Text style={styles.subtitle} color="secondary">
                  New to kuruier, let's signup & continue
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.formBanner}>
          <Image
            source={require('@/assets/images/verifyPerson.png')}
            resizeMode="contain"
            style={styles.formBannerImage}
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.card}>
            <Text style={styles.verificationTitle} semiBold>
              Enter your Verification Code
            </Text>
            <Text style={styles.verificationSubtitle}>
              We sent a verification code{'\n'}
              to +{mobile || '91987654321'}
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit !== '' && styles.otpInputFilled,
                    Platform.OS === 'web' && styles.otpInputWeb,
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

            <View style={styles.actions}>
              <TouchableOpacity 
                onPress={handleResendOtp}
                disabled={resendLoading}
              >
                <Text style={[styles.actionLink, resendLoading && styles.actionLinkDisabled]}>
                  {resendLoading ? 'Sending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleChangeMobile}>
                <Text style={styles.actionLink}>Change Mobile Number</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              otp.every((digit) => digit !== '') && styles.submitButtonActive,
              loading && styles.submitButtonDisabled,
            ]}
            disabled={!otp.every((digit) => digit !== '') || loading}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText} color="secondary" semiBold>
              {loading ? 'Verifying...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <VerificationPopup
        visible={showPopup}
        success={verificationSuccess}
        message={verificationSuccess ? 'Verified Successfully' : 'Invalid OTP'}
        onClose={() => setShowPopup(false)}
      />
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
  imageWrapper: {
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  banner: {
    height: 300,
    backgroundColor: Colors.mainTheme,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    gap: 12,
    marginTop: 24,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'OpenSans_600SemiBold',
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.9,
    fontFamily: 'OpenSans_400Regular',
  },
  formContainer: {
    flex: 1,
    gap: 15,
    backgroundColor: Colors.secondary,
    marginTop: -70,
    marginLeft: 18,
    marginRight: 18,
    borderRadius: 24,
    padding: 15,
    paddingBottom: Platform.OS === 'web' ? 24 : 12,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    zIndex: 2,
  },
  formBanner: {
    width: '100%',
    height: 150,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 100,
    zIndex: 1,
  },
  formBannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  card: {
    padding: 12,
    position: 'relative',
    zIndex: 3,
  },
  verificationTitle: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'left',
    fontFamily: 'OpenSans_600SemiBold',
  },
  verificationSubtitle: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.7,
    textAlign: 'left',
    lineHeight: 25,
    marginBottom: 24,
    letterSpacing: 0.5,
    fontFamily: 'OpenSans_400Regular',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    color: Colors.primary,
    backgroundColor: Colors.secondary,
  },
  otpInputFilled: {
    borderColor: Colors.mainTheme,
    borderWidth: 2,
  },
  otpInputWeb: {},
  actions: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 12,
  },
  actionLink: {
    color: Colors.mainTheme,
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold',
    letterSpacing: 0.5,
  },
  submitButton: {
    backgroundColor: Colors.mainTheme,
    height: 52,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    marginTop: 100,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  submitButtonActive: {
    opacity: 1,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'OpenSans_500Medium',
  },
  footer: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  actionLinkDisabled: {
    opacity: 0.7,
  },
});
