import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Camera, Image as ImageIcon, ChevronLeft, MapPin, Search } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import Dropdown from '@/components/Dropdown';
import FileDownload from '@/assets/svgs/FileDownload';
import DatePicker from '@/assets/svgs/DatePicker';
import { useLocation } from '@/hooks/useLocation';
import { useImagePicker } from '@/hooks/useImagePicker';
import { usePackageLocation } from '@/hooks/usePackageLocation';
import { useLocationContext } from '@/utils/LocationContext';
import { createShipment } from '@/utils/api';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useRef, useEffect } from 'react';

const packageTypes = ['DOCUMENTS', 'SNACKS', 'CLOTHES', 'ELECTRONICS', 'OTHER'];
const weights = ['0.5', '1', '1.5', '2.5'];
const countries = ['UAE', 'USA', 'UK', 'India', 'Singapore'];

export default function PackageDetailsScreen() {
  const [packageType, setPackageType] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weight, setWeight] = useState('');
  const [country, setCountry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locationSheetRef = useRef<{ open: () => void; close: () => void }>(null);
  const router = useRouter();

  // Use custom hooks
  const { latitude, longitude, errorMsg: locationError } = useLocation();
  const { image, error: imageError, pickImage, takePhoto } = useImagePicker();
  const { locationLabel, coordinates } = useLocationContext();
  const { openLocationSelector } = usePackageLocation();

  // Debug location data
  useEffect(() => {
    console.log('Location data updated:', { locationLabel, coordinates });
  }, [locationLabel, coordinates]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDeliveryDate(selectedDate);
    }
  };

  const validateForm = () => {
    if (!packageType) {
      Alert.alert('Error', 'Please select package type');
      return false;
    }
    if (!weight) {
      Alert.alert('Error', 'Please select weight');
      return false;
    }
    if (!country) {
      Alert.alert('Error', 'Please select destination country');
      return false;
    }
    if (!image) {
      Alert.alert('Error', 'Please upload package image');
      return false;
    }
    if (!locationLabel && !coordinates) {
      Alert.alert('Error', 'Please select a location');
      return false;
    }
    if (locationError) {
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
      
      const shipmentData = {
        packageType: packageType as 'DOCUMENTS' | 'SNACKS' | 'CLOTHES' | 'ELECTRONICS' | 'OTHER',
        estimatedDeliveryDate: deliveryDate.toISOString().split('T')[0],
        weightGrams: parseFloat(weight) * 1000, // Convert kg to grams
        destinationCountry: country,
        lat_coordinates: (coordinates?.lat || latitude).toString(),
        long_coordinates: (coordinates?.lng || longitude).toString(),
        packageImage: image,
        locationLabel: locationLabel || '',
      };

      console.log('Submitting shipment with location:', locationLabel, coordinates);
      await createShipment(shipmentData);
      
      // Navigate back and trigger refresh
      router.push({
        pathname: '/(tabs)/package-detail',
        params: { refresh: Date.now() } // Add a timestamp to force refresh
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create shipment. Please try again.');
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
                  Package Details
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.formBanner}>
          <Image
            source={require('@/assets/images/packageDetail.png')}
            resizeMode="contain"
            style={styles.formBannerImage}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.form}>
            <Text style={styles.headerSubtitle} semiBold>
              Enter your package info
            </Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Package Type <Text style={styles.required}>*</Text>
              </Text>
              <Dropdown
                value={packageType}
                items={packageTypes}
                onChange={setPackageType}
                placeholder="Select package type"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
              Estimated Delivery Date <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
              >
              <Text style={styles.dateText}>
                {deliveryDate.toLocaleDateString()}
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
                value={deliveryDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Shipment Weight (kg) <Text style={styles.required}>*</Text>
              </Text>
              <Dropdown
                value={weight}
                items={weights}
                onChange={setWeight}
                placeholder="Select weight"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Destination Country <Text style={styles.required}>*</Text>
              </Text>
              <Dropdown
                value={country}
                items={countries}
                onChange={setCountry}
                placeholder="Select country"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Upload Package Image <Text style={styles.required}>*</Text></Text>
              <View style={styles.imageUpload}>
                {image ? (
                  <View style={styles.previewContainer}>
                    <ImageIcon size={24} color={Colors.primary} />
                    <Text style={styles.uploadText}>Image selected</Text>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => pickImage()}>
                    <View style={styles.uploadPlaceholder}>
                      <FileDownload
                        width={15}
                        height={15}
                        color="#5059A5"
                        style={styles.fileDownload}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.dateInput} onPress={handleLocationFieldPress}>
                <Text style={styles.dateText} numberOfLines={1} ellipsizeMode="tail">
                  {locationLabel || 'Select location'}
                </Text>
              </TouchableOpacity>
            </View>
            
          </View>

          <TouchableOpacity 
            style={[styles.nextButton, isSubmitting && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.nextButtonText} color="secondary" semiBold>
              {isSubmitting ? 'Creating...' : 'Create Package'}
            </Text>
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
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    marginBottom: 16,
    fontFamily: 'OpenSans_600SemiBold',
  },
  content: {
    flex: 1,
    marginTop: -24,
    padding: 24,
    position: 'relative',
    zIndex: 3,
  },
  form: {
    flex: 1,
    gap: 15,
    backgroundColor: Colors.secondary,
    marginTop: -82,
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
  imageUpload: {
    gap: 12,
  },
  uploadPlaceholder: {
    height: 45,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
  },
  fileDownload: {
    marginRight: 15,
  },
  previewContainer: {
    height: 120,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.7,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.mainTheme,
    borderRadius: 8,
  },
  imageButtonText: {
    fontSize: 14,
    color: Colors.mainTheme,
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
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingTop: 16,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeader: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.primary,
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

