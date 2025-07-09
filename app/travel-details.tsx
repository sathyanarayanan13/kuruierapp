import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  ImageBackground,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ChevronLeft, MapPin, Search } from 'lucide-react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import Dropdown from '@/components/Dropdown';
import DatePicker from '@/assets/svgs/DatePicker';
import { createTrip } from '@/utils/api';
import { useLocation } from '@/hooks/useLocation';
import { useLocationContext } from '@/utils/LocationContext';
import { usePackageLocation } from '@/hooks/usePackageLocation';
import RBSheet from 'react-native-raw-bottom-sheet';

const countries = ['UAE', 'USA', 'UK', 'India', 'Singapore'];

export default function TravelDetailsScreen() {
  const [pnrNumber, setPnrNumber] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [flightInfo, setFlightInfo] = useState('');
  const [availability, setAvailability] = useState<'yes' | 'maybe'>('yes');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locationSheetRef = useRef<{ open: () => void; close: () => void }>(null);
  const router = useRouter();
  const location = useLocation();
  const { locationLabel, coordinates } = useLocationContext();
  const { openLocationSelector } = usePackageLocation();

  // Debug location data
  useEffect(() => {
    console.log('Travel form location data updated:', { locationLabel, coordinates });
  }, [locationLabel, coordinates]);

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

  const validateForm = () => {
    if (!pnrNumber) {
      Alert.alert('Error', 'Please enter PNR number');
      return false;
    }
    if (!fromCountry) {
      Alert.alert('Error', 'Please select departure country');
      return false;
    }
    if (!toCountry) {
      Alert.alert('Error', 'Please select destination country');
      return false;
    }
    if (!flightInfo) {
      Alert.alert('Error', 'Please enter flight information');
      return false;
    }
    if (!locationLabel && !coordinates) {
      Alert.alert('Error', 'Please select a location');
      return false;
    }
    if (location.errorMsg) {
      Alert.alert('Error', 'Location permission is required');
      return false;
    }
    return true;
  };

  const handleLocationFieldPress = () => {
    locationSheetRef.current?.open();
  };

  const handleLocationOption = (option: 'current' | 'search') => {
    locationSheetRef.current?.close();
    openLocationSelector(option);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const response = await createTrip({
        pnrNumber,
        fromCountry,
        toCountry,
        departureDate: departureDate.toISOString().split('T')[0],
        flightInfo,
        lat_coordinates: (coordinates?.lat || location.latitude).toString(),
        long_coordinates: (coordinates?.lng || location.longitude).toString(),
      });

      console.log('Submitting trip with location:', locationLabel, coordinates);

      if (response) {
        Alert.alert(
          'Success',
          'Trip created successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace({
                  pathname: '/(tabs)/shipments',
                  params: { refresh: Date.now() }
                });
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('Error', 'Failed to create trip');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create trip');
    } finally {
      setIsSubmitting(false);
    }
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
              <Text style={styles.label}>Location <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.dateInput} onPress={handleLocationFieldPress}>
                <Text style={styles.dateText} numberOfLines={1} ellipsizeMode="tail">
                  {locationLabel || 'Select location'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Flight Information <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter flight information"
                  placeholderTextColor="#999"
                  value={flightInfo}
                  onChangeText={setFlightInfo}
                />
              </View>
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

            {location.errorMsg && (
              <Text style={styles.errorText}>
                {location.errorMsg}
              </Text>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.nextButton, isSubmitting && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.secondary} />
            ) : (
              <Text style={styles.nextButtonText} color="secondary" semiBold>
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Location Options Bottom Sheet */}
      <RBSheet
        ref={locationSheetRef}
        height={220}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 0,
            backgroundColor: Colors.secondary,
          },
        }}
        draggable={true}
        closeOnPressMask={true}
      >
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>Select Location</Text>
          <TouchableOpacity 
            style={[styles.sheetOption]}
            onPress={() => handleLocationOption('current')}
            activeOpacity={0.7}
          >
            <MapPin size={20} color={Colors.mainTheme} style={{ marginRight: 12 }} />
            <Text style={styles.sheetOptionText}>Use my current Location</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sheetOption}
            onPress={() => handleLocationOption('search')}
            activeOpacity={0.7}
          >
            <Search size={20} color={Colors.mainTheme} style={{ marginRight: 12 }} />
            <Text style={styles.sheetOptionText}>Search Address</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.secondary,
  },
  dateText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_500Medium',
    flex: 1,
    lineHeight: 20,
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
  disabledButton: {
    opacity: 0.7,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  sheetContainer: {
    paddingHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragHandle: {
    alignSelf: 'center',
    width: 56,
    height: 2,
    borderRadius: 3,
    backgroundColor: '#9D93CC',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans_600SemiBold',
    color: Colors.primary,
    marginLeft: 24,
    marginBottom: 16,
    textAlign: 'left',
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  sheetOptionActive: {
    backgroundColor: '#F3F1FC', // light purple highlight
  },
  sheetOptionText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'OpenSans_500Medium',
  },
});
