import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Camera, Image as ImageIcon, ChevronLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import Dropdown from '@/components/Dropdown';
import FileDownload from '@/assets/svgs/FileDownload';
import DatePicker from '@/assets/svgs/DatePicker';

const packageTypes = ['Documents', 'Snacks', 'Clothes'];
const weights = ['0.5 kg', '1 kg', '1.5 kg', '2.5 kg'];
const countries = ['UAE', 'USA', 'UK', 'India', 'Singapore'];

export default function PackageDetailsScreen() {
  const [packageType, setPackageType] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weight, setWeight] = useState('');
  const [country, setCountry] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const pickImage = async (useCamera: boolean) => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    };

    let result: any;
    if (useCamera) {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.granted) {
        result = await ImagePicker.launchCameraAsync(options);
      }
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDeliveryDate(selectedDate);
    }
  };

  const handleNext = () => {
    // Navigate to travelers list
    router.push('/travelers-list');
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
                Shipment Weight <Text style={styles.required}>*</Text>
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
              <Text style={styles.label}>Upload Package Image</Text>
              <View style={styles.imageUpload}>
                {image ? (
                  <View style={styles.previewContainer}>
                    <ImageIcon size={24} color={Colors.primary} />
                    <Text style={styles.uploadText}>Image selected</Text>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => pickImage(false)}>
                    <View style={styles.uploadPlaceholder}>
                      <FileDownload
                        width={15}
                        height={15}
                        color="#5059A5"
                        style={styles.fileDownload}
                      />
                      {/* <Text style={styles.uploadText}>Upload package image</Text> */}
                    </View>
                  </TouchableOpacity>
                )}
                {/* <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => pickImage(false)}
                  >
                    <ImageIcon size={20} color={Colors.mainTheme} />
                    <Text style={styles.imageButtonText}>Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => pickImage(true)}
                  >
                    <Camera size={20} color={Colors.mainTheme} />
                    <Text style={styles.imageButtonText}>Camera</Text>
                  </TouchableOpacity>
                </View> */}
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
    fontFamily: 'OpenSans_500Medium',
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
});

