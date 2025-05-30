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
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { EyeOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import Phone from '@/assets/svgs/Phone';
import Eye from '@/assets/svgs/EyeIcon';
import People from '@/assets/svgs/People';
import Mail from '@/assets/svgs/Mail';
import { signup } from '@/utils/api';
import { validateName, validateMobileNumber, validateEmail, validatePassword } from '@/utils/validation';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    try {
      // Validate inputs
      if (!validateName(name)) {
        Alert.alert('Error', 'Name should only contain letters and spaces');
        return;
      }

      if (!validateMobileNumber(mobile)) {
        Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      if (!validatePassword(password)) {
        Alert.alert('Error', 'Password must be at least 8 characters long');
        return;
      }

      setLoading(true);
      const response = await signup(name, email, mobile, password);
      
      // Navigate to verification screen with userId
      router.push({
        pathname: '/verify',
        params: { 
          mobile,
          userId: response.userId
        },
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} bounces={false}>
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
                  New to kuruier, let's signup & continue
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle} semiBold>
            Add your details to continue
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="ex : san.jai kumar"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <People
                size={20}
                color={Colors.primary}
                style={styles.inputIcon}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Mobile <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="ex : 1234567890"
                placeholderTextColor="#999"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={10}
              />
              <Phone width={20} height={19} />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Mail <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="ex : sanjai@gmail.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Mail size={20} color={Colors.primary} style={styles.inputIcon} />
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
            <Link href="/login" asChild>
              <Text style={styles.loginLink}>Log In</Text>
            </Link>
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.signupButton, loading && styles.signupButtonDisabled]} 
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.signupButtonText} color="secondary" semiBold>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    flex: 1,
    height: 300,
    backgroundColor: Colors.mainTheme,
    borderWidth: 1,
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
    flex: 1,
    gap: 15,
    backgroundColor: Colors.secondary,
    marginTop: -100,
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
  },
  formTitle: {
    fontSize: 17,
    fontFamily: 'OpenSans_600SemiBold',
    marginBottom: 10,
    color: Colors.primary,
  },
  inputContainer: {
    marginBottom: 10,
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
  noAccount: {
    textAlign: 'left',
    marginLeft: 24,
    marginTop: 24,
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_400Regular',
  },
  loginLink: {
    color: Colors.mainTheme,
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold',
  },
  footer: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 20,
  },
  signupButton: {
    backgroundColor: Colors.mainTheme,
    height: 48,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginRight: 20,
    marginLeft: 20,
  },
  signupButtonText: {
    fontSize: 16,
    fontFamily: 'OpenSans_500Medium',
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
});
