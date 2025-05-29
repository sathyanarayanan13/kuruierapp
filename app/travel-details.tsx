import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  ImageBackground,
  Image,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ChevronLeft } from 'lucide-react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import Dropdown from '@/components/Dropdown';
import DatePicker from '@/assets/svgs/DatePicker';

const countries = ['UAE', 'USA', 'UK', 'India', 'Singapore'];

export default function TravelDetailsScreen() {
  const [pnrNumber, setPnrNumber] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [availability, setAvailability] = useState<'yes' | 'maybe'>('yes');
  const router = useRouter();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDepartureDate(selectedDate);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleNext = () => {
    // Navigate to courier list
    router.push('/courier-list');
  };

  return (
    <View style={styles.container}>
      <ScrollView bounces={false}>
        <View style={styles.imageWrapper}>
          <ImageBackground
            source={require('@/assets/images/verify.png')}
            style={styles.banner}
            resizeMode="cover"
          >
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle} color="secondary" semiBold>
                  Travel Details
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.formBanner}>
          <Image
            source={require('@/assets/images/travelDetail.png')}
            resizeMode="contain"
            style={styles.formBannerImage}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.form}>
            <Text style={{fontFamily: 'OpenSans_500Medium'}}>Enter your travel info</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                PNR Number <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your PNR number"
                  placeholderTextColor="#999"
                  value={pnrNumber}
                  onChangeText={setPnrNumber}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Departure Date <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {departureDate.toLocaleDateString()}
                </Text>
                <DatePicker
                  width={15}
                  height={15}
                  color="#5059A5"
                  style={{ marginLeft: 20 }}
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={departureDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                From <Text style={styles.required}>*</Text>
              </Text>
              <Dropdown
                value={fromCountry}
                items={countries}
                onChange={setFromCountry}
                placeholder="Select departure country"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                To <Text style={styles.required}>*</Text>
              </Text>
              <Dropdown
                value={toCountry}
                items={countries}
                onChange={setToCountry}
                placeholder="Select destination country"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={{fontFamily: 'OpenSans_500Medium'}}>Availability for shipment</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setAvailability('yes')}
                >
                  <View style={styles.radio}>
                    {availability === 'yes' && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setAvailability('maybe')}
                >
                  <View style={styles.radio}>
                    {availability === 'maybe' && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>Maybe later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText} color="secondary" semiBold>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageWrapper: {
    height: 400,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  banner: {
    flex: 1,
    height: 400,
    backgroundColor: Colors.mainTheme,
    borderWidth: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans_600SemiBold',
    letterSpacing: 0.5,
  },
  formBanner: {
    width: '100%',
    height: 200,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 100,
    zIndex: 1,
  },
  formBannerImage: {
    width: '80%',
    height: '80%',
    borderRadius: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 24,
    position: 'relative',
    zIndex: 3,
    marginTop: -50,
  },
  form: {
    flex: 1,
    gap: 15,
    backgroundColor: Colors.secondary,
    marginTop: -92,
    borderRadius: 24,
    padding: 24,
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
  formGroup: {
    gap: 8,
    position: 'relative',
    marginBottom: 10,
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    fontSize: 13,
    color: '#3E3F68',
    zIndex: 1,
    fontFamily: 'OpenSans_500Medium',
  },
  required: {
    color: Colors.error,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_500Medium'
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.secondary,
  },
  dateText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_500Medium'
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.mainTheme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.mainTheme,
  },
  radioLabel: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_500Medium'
  },
  nextButton: {
    backgroundColor: Colors.mainTheme,
    height: 50,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  nextButtonText: {
    fontSize: 16,
  },
});
