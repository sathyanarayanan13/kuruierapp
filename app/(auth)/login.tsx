import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  BackHandler,
} from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { EyeOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import Phone from '@/assets/svgs/Phone';
import Eye from '@/assets/svgs/EyeIcon';
import LoadingSpinner from '@/components/LoadingSpinner';
import { login, isAuthenticated, getStoredUser } from '@/utils/api';
import { validateMobileNumber, validatePassword } from '@/utils/validation';

export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const passwordInputRef = useRef<TextInput | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const preventBack = params.preventBack === 'true';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (preventBack) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        return true; // Prevent going back
      });

      return () => backHandler.remove();
    }
  }, [preventBack]);

  const checkAuthStatus = async () => {
    try {
      const isLoggedIn = await isAuthenticated();
      if (isLoggedIn) {
        const user = await getStoredUser();
        if (user) {
          if (user.currentRole === 'SHIPMENT_OWNER') {
            router.replace('/travelers-list');
          } else {
            router.replace('/courier-list');
          }
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogin = async () => {
    try {
      // Validate inputs
      if (!validateMobileNumber(mobile)) {
        Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
        return;
      }

      if (!validatePassword(password)) {
        Alert.alert('Error', 'Password must be at least 8 characters long');
        return;
      }

      setLoading(true);
      const response = await login(mobile, password);
      
      if (response.user.currentRole === 'SHIPMENT_OWNER') {
        router.replace('/travelers-list');
      } else {
        router.replace('/courier-list');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <LoadingSpinner size={40} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <ImageBackground
              source={require('@/assets/images/banner.png')}
              style={styles.banner}
              resizeMode="cover"
            >
              <View style={styles.header}>
                <Image
                  source={require('@/assets/images/kuruier.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <View style={styles.headerText}>
                  <Text style={styles.greeting} color="secondary">
                    Hey,{' '}
                    <Text style={styles.appName} color="secondary" semiBold>
                      Kuruier
                    </Text>{' '}
                    👋
                  </Text>
                  <Text style={styles.subtitle} color="secondary">
                    Sign in to access to your account
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle} semiBold>
              Login with your mobile & password
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label]}>
                Mobile <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="ex : 1234567890"
                  placeholderTextColor="#B0B0B0"
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                  maxLength={10}
                  onSubmitEditing={() => {
                    passwordInputRef?.current?.focus();
                  }}
                />
                <View style={styles.iconWrapper}>
                  <Phone width={20} height={19} />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="ex : kuruvi@123"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  ref={passwordInputRef}
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.inputIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.primary} />
                  ) : (
                    <Eye size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View>
            <Text style={styles.noAccount}>
              Don't have a account?{' '}
              <Link href="/signup" asChild>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </Link>
            </Text>
          </View>

          {!keyboardVisible && (
            <View style={styles.footer}>
              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText} color="secondary" semiBold>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
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
  banner: {
    flex: 1,
    height: 300,
    backgroundColor: Colors.mainTheme,
    borderWidth: 1,
  },
  imageWrapper: {
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    marginTop: 24,
  },
  headerText: {
    flex: 1,
    marginTop: 24,
  },
  greeting: {
    fontSize: 17,
    marginBottom: 4,
    fontFamily: 'OpenSans_400Regular',
  },
  appName: {
    fontSize: 18,
    fontFamily: 'OpenSans_600SemiBold',
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.9,
    fontFamily: 'OpenSans_400Regular',
  },
  formContainer: {
    gap: 15,
    backgroundColor: Colors.secondary,
    marginTop: -100,
    marginLeft: 18,
    marginRight: 18,
    borderRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'web' ? 24 : 0,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 17,
    marginBottom: 24,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold',
  },
  inputContainer: {
    marginBottom: 25,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    fontSize: 14,
    color: '#3E3F68',
    zIndex: 1,
    fontFamily: 'OpenSans_600SemiBold',
  },
  required: {
    color: '#FF4C61',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E0E3F0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    lineHeight: 20,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#3E3F68',
    fontFamily: 'OpenSans_500Medium',
  },
  iconWrapper: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    marginLeft: 10,
  },
  footer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  noAccount: {
    textAlign: 'left',
    marginLeft: 24,
    marginTop: 24,
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'OpenSans_400Regular',
  },
  signUpLink: {
    color: Colors.mainTheme,
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
  },
  loginButton: {
    backgroundColor: Colors.mainTheme,
    height: 48,
    borderRadius: 40,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'OpenSans_500Medium',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
});
