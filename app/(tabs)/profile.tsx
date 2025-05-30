import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import Mail from '@/assets/svgs/Mail';
import Phone from '@/assets/svgs/Phone';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getProfile } from '@/utils/api';

interface ProfileData {
  id: string;
  username: string;
  email: string;
  mobileNumber: string;
  currentRole: 'SHIPMENT_OWNER' | 'TRAVELLER';
}

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfileData(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  // Use useFocusEffect to refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleEditPress = () => {
    if (profileData) {
      router.push({
        pathname: '/EditProfileScreen',
        params: { 
          initialData: JSON.stringify(profileData)
        }
      });
    }
  };

  if (loading || !profileData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <LoadingSpinner size={40} />
        </View>
      </SafeAreaView>
    );
  }

  const roleData = {
    SHIPMENT_OWNER: {
      role: 'Shipment Owner',
      description: 'Send your package\nwith no delays',
      illustration: require('@/assets/images/owner.png'),
    },
    TRAVELLER: {
      role: 'Traveller',
      description: 'Deliver the package\n& earn',
      illustration: require('@/assets/images/traveller.png'),
    },
  };

  const currentRoleData = roleData[profileData.currentRole];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <ImageBackground 
            source={require('@/assets/images/smallBanner.png')}
            style={styles.headerBanner}
            resizeMode="cover"
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle} color="secondary" semiBold>Profile</Text>
              <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
                <Text style={styles.editButtonText} color="secondary">Edit</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Profile Picture (overlapping header) */}
          <Image source={require('@/assets/images/avatar1.png')} style={styles.profileAvatar} />

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName} semiBold>{profileData.username}</Text>
            <View style={styles.contactInfo}>
              <Mail size={16} color={Colors.primary} />
              <Text style={styles.contactText}>{profileData.email}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Phone width={22} color={Colors.primary} />
              <Text style={styles.contactText}>{profileData.mobileNumber}</Text>
            </View>
          </View>

          {/* Separator Line */}
          <View style={styles.separator}></View>

          {/* Role and Illustration */}
          <View style={styles.roleInfo}>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleLabel}>You are a</Text>
              <Text style={styles.role} semiBold>{currentRoleData.role}</Text>
              <Text style={styles.roleDescription}>{currentRoleData.description}</Text>
            </View>
            {/* Illustration */}
            <Image source={currentRoleData.illustration} style={styles.roleIllustration} resizeMode="contain" />
          </View>
        </View>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 30, 
  },
  headerTitle: {
    fontSize: 24, 
    fontFamily: 'OpenSans_600SemiBold'
  },
  editButton: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 24, 
    paddingVertical: 8, 
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold'
  },
  profileCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 24, 
    borderRadius: 16,
    marginTop: -60, 
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileAvatar: {
    width: 90, 
    height: 90, 
    borderRadius: 20, 
    position: 'absolute',
    top: -45, 
    left: 24, 
    borderWidth: 3, 
    borderColor: Colors.card, 
    overflow: 'hidden', 
  },
  userInfo: {
    marginTop: 30,
    marginBottom: 24,
  },
  userName: {
    fontSize: 22,
    marginBottom: 8,
    color: Colors.primary, 
    fontFamily: 'OpenSans_600SemiBold'
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8, 
  },
  contactText: {
    fontSize: 16,
    color: Colors.primary, 
    fontFamily: 'OpenSans_400Regular',
    opacity: 0.5
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderStyle: 'dashed', 
    marginBottom: 24,
    marginHorizontal: -24, 
  },
  roleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  roleLabel: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 4,
    fontFamily: 'OpenSans_500Medium'
  },
  role: {
    fontSize: 18,
    marginBottom: 8,
    color: Colors.primary, 
    fontFamily: 'OpenSans_600SemiBold'
  },
  roleDescription: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.6,
    fontFamily: 'OpenSans_400Regular'
  },
  roleIllustration: {
    width: 120,
    height: 120,
  },
});