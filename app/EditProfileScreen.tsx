import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Platform, Image, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import BackButton from '@/assets/svgs/BackButton';
import Mail from '@/assets/svgs/Mail'; // Using existing Mail icon
import Phone from '@/assets/svgs/Phone'; // Using existing Phone icon
// Assuming you have a Person/User icon and a Checkmark icon in your svgs directory
import PersonIcon from '@/assets/svgs/People'; // Placeholder, replace with actual Person icon if needed
import CheckmarkIcon from '@/assets/svgs/AddIcon'; // Placeholder, replace with actual Checkmark icon if needed
import { Check } from 'lucide-react-native';
import { updateProfile } from '@/utils/api';
import { validateName, validateMobileNumber, validateEmail } from '@/utils/validation';
// Placeholder images for role illustrations
const TravelerIllustration = require('@/assets/images/traveller.png'); // Replace with actual Traveller illustration
const ShipmentOwnerIllustration = require('@/assets/images/owner.png'); // Replace with actual Shipment Owner illustration

export default function EditProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialData = params.initialData ? JSON.parse(params.initialData as string) : null;

  const [name, setName] = useState(initialData?.username || '');
  const [mobile, setMobile] = useState(initialData?.mobileNumber || '');
  const [mail, setMail] = useState(initialData?.email || '');
  const [selectedRole, setSelectedRole] = useState(initialData?.currentRole || 'SHIPMENT_OWNER');
  const [loading, setLoading] = useState(false);

  const handleUpdateDetails = async () => {
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

      if (!validateEmail(mail)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      setLoading(true);
      await updateProfile(name, mail, mobile, selectedRole);
      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: 'SHIPMENT_OWNER' | 'TRAVELLER') => {
    setSelectedRole(role);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
        <ImageBackground
            source={require('@/assets/images/smallBanner.png')} // Placeholder banner image
            style={styles.headerBanner}
            resizeMode="cover"
          >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}> {/* Use onBack prop */}
            <BackButton size={24} color={Colors.secondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} color="secondary" semiBold>Edit Profile</Text>
          <View style={{ width: 24 }} />{/* Spacer */}
        </View>
        </ImageBackground>
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          <View style={styles.form}>
          <Text style={styles.sectionTitle} semiBold>Update your details</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name <Text style={{ color: 'red' }}>*</Text></Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.textInput}
                placeholder="ex : sanjai kumar"
                placeholderTextColor={Colors.text}
                value={name}
                onChangeText={setName}
              />
              {/* Placeholder Person Icon */}
              <PersonIcon size={20} color={Colors.text} opacity={0.6} />
            </View>
          </View>

          {/* Mobile Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mobile <Text style={{ color: 'red' }}>*</Text></Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.textInput}
                placeholder="ex : 1234567890"
                placeholderTextColor={Colors.text}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={10}
              />
              {/* Phone Icon */}
              <Phone width={20} color={Colors.text} opacity={0.6} />
            </View>
          </View>

          {/* Mail Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mail <Text style={{ color: 'red' }}>*</Text></Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.textInput}
                placeholder="ex : sanjai@gmail.com"
                placeholderTextColor={Colors.text}
                value={mail}
                onChangeText={setMail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {/* Mail Icon */}
              <Mail size={20} color={Colors.text} opacity={0.6} />
            </View>
          </View>

          <Text style={[styles.sectionTitle]} semiBold>Choose the role</Text>

          {/* Role Selection Cards */}
          <View style={styles.roleCardsContainer}>
            {/* Traveler Card */}
            <TouchableOpacity 
              style={[styles.roleCard, selectedRole === 'TRAVELLER' && styles.selectedRoleCard]}
              onPress={() => handleRoleSelect('TRAVELLER')}
            >
              <Image source={TravelerIllustration} style={styles.roleIllustration} resizeMode="contain" />
              <Text style={styles.roleCardText}>Traveller</Text>
              {selectedRole === 'TRAVELLER' && (
                <View style={styles.checkmarkContainer}>
                  {/* Placeholder Checkmark Icon */}
                  <Check size={12} color={Colors.secondary} />
                </View>
              )}
            </TouchableOpacity>

            {/* Shipment Owner Card */}
            <TouchableOpacity 
              style={[styles.roleCard, selectedRole === 'SHIPMENT_OWNER' && styles.selectedRoleCard]}
              onPress={() => handleRoleSelect('SHIPMENT_OWNER')}
            >
              <Image source={ShipmentOwnerIllustration} style={styles.roleIllustration} resizeMode="contain" />
              <Text style={styles.roleCardText}>Shipment Owner</Text>
               {selectedRole === 'SHIPMENT_OWNER' && (
                <View style={styles.checkmarkContainer}>
                   {/* Placeholder Checkmark Icon */}
                  <Check size={12} color={Colors.secondary} />
                </View>
              )}
            </TouchableOpacity>
          </View>
          </View>
        </View>

        {/* Update Details Button */}
        <TouchableOpacity 
          style={[styles.updateButton, loading && styles.updateButtonDisabled]} 
          onPress={handleUpdateDetails}
          disabled={loading}
        >
          <Text style={styles.updateButtonText} color="secondary" semiBold>
            {loading ? 'Updating...' : 'Update Details'}
          </Text>
        </TouchableOpacity>
      </View>
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
    // No horizontal padding here, add to content view
  },
  headerContainer: {
    height: 200, 
    backgroundColor: Colors.mainTheme,
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30,
    overflow: 'hidden', 
  },
  headerBanner: {
    flex: 1,
    height: '100%',
    width: '100%',
 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    height: 60, // Adjusted height
    backgroundColor: Colors.mainTheme, // Blue header background
  },
  backButton: {
    padding: 8, // Increase touch area
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans_600SemiBold'
  },
  content: {
    flex: 1,
    marginTop: -40,
    padding: 24,
    position: 'relative',
    zIndex: 3,
    gap: 15
  },
  form: {
    flex: 1,
    gap: 15,
    backgroundColor: Colors.secondary,
    marginTop: -100,
    borderRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'web' ? 24 : 12,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'OpenSans_600SemiBold'
  },
  inputContainer: {
  },
  inputLabel: {
    position: 'absolute',
    top: -14,
    left: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    fontSize: 13,
    color: '#3E3F68',
    zIndex: 3,
    fontFamily: 'OpenSans_500Medium',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  roleCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent', // Default transparent border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedRoleCard: {
    borderColor: Colors.mainTheme, // Blue border when selected
    borderWidth: 2,
  },
  roleIllustration: {
    width: 100, // Adjust size as needed
    height: 120, // Adjust size as needed
    marginBottom: 20,
  },
  roleCardText: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
    fontFamily: 'OpenSans_600SemiBold'
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.mainTheme,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: Colors.mainTheme,
    borderRadius: 40,
    paddingVertical: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  updateButtonText: {
    fontSize: 18,
    fontFamily: 'OpenSans_600SemiBold'
  },
}); 