import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';

type UserType = 'traveller' | 'shipment_owner';

export default function UserTypeScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<UserType>('shipment_owner');

  const handleNext = () => {
    if (selectedType === 'shipment_owner') {
      router.replace('/package-details');
    } else {
      router.replace('/travel-details');
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
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.headerText}>
                <Text style={styles.greeting} color="secondary">
                  Hey,{' '}
                  <Text style={styles.userType} color="secondary" semiBold>
                    Traveller
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
        <View style={styles.contentContainer}>
          <View style={[styles.content]}>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedType === 'traveller' && styles.optionSelected,
                ]}
                onPress={() => setSelectedType('traveller')}
              >
                <Image
                  source={require('@/assets/images/man.png')}
                  style={styles.optionIcon}
                  resizeMode="contain"
                />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle} semiBold>
                    Traveller
                  </Text>
                  <Text style={styles.optionDescription}>
                    Deliver the package {'\n'} & earn
                  </Text>
                </View>
                {selectedType === 'traveller' && (
                  <View style={styles.checkContainer}>
                    <Check size={12} color={Colors.secondary} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.content]}>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedType === 'shipment_owner' && styles.optionSelected,
                ]}
                onPress={() => setSelectedType('shipment_owner')}
              >
                <Image
                  source={require('@/assets/images/owner.png')}
                  style={styles.optionIcon}
                  resizeMode="contain"
                />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle} semiBold>
                    Shipment Owner
                  </Text>
                  <Text style={styles.optionDescription}>
                    Send your package {'\n'} with no delay
                  </Text>
                </View>
                {selectedType === 'shipment_owner' && (
                  <View style={styles.checkContainer}>
                    <Check size={12} color={Colors.secondary} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText} color="secondary" semiBold>
              Next
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
  icon: {
    width: 40,
    height: 40,
    marginTop: 24,
  },
  userType: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.9,
    fontFamily: 'OpenSans_400Regular',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
  },
  content: {
    flex: 1,
    gap: 15,
    backgroundColor: Colors.secondary,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 24,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionsContainer: {
    gap: 10,
  },
  option: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: Colors.mainTheme,
  },
  optionIcon: {
    width: 120,
    height: 120,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold',
    textAlign: 'center',
  },
  optionDescription: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.primary,
    opacity: 0.7,
    textAlign: 'center',
    fontFamily: 'OpenSans_400Regular',
  },
  checkContainer: {
    width: 20,
    height: 20,
    borderRadius: 16,
    backgroundColor: Colors.mainTheme,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -40,
    right: 68,
  },
  nextButton: {
    backgroundColor: Colors.mainTheme,
    height: 48,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  nextButtonText: {
    fontSize: 16,
  },
  footer: {
    marginTop: 130,
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
