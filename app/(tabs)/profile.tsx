import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import Mail from '@/assets/svgs/Mail';
import Phone from '@/assets/svgs/Phone';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  // Placeholder data - replace with actual user data
  const userData = {
    name: 'Sanjai Kumar',
    email: 'sanjaikumar.s@zohocorp.com',
    phone: '8825488514',
    role: 'Shipment Owner',
    roleDescription: 'Send your package\nwith no delays',
    avatar: require('@/assets/images/avatar1.png'), // Replace with actual avatar image
    illustration: require('@/assets/images/owner.png'), // Replace with actual illustration image
  };

  // Function to navigate to the Edit Profile screen
  const handleEditPress = () => {
    router.push('/EditProfileScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          {/* Replace with your actual banner image */}
          <ImageBackground 
            source={require('@/assets/images/smallBanner.png')} // Placeholder banner image
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
          <Image source={userData.avatar} style={styles.profileAvatar} />

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName} semiBold>{userData.name}</Text>
            <View style={styles.contactInfo}>
              <Mail size={16} color={Colors.primary} />
              <Text style={styles.contactText}>{userData.email}</Text>
            </View>
            <View style={styles.contactInfo}>
               <Phone width={22} color={Colors.primary} />
              <Text style={styles.contactText}>{userData.phone}</Text>
            </View>
          </View>

          {/* Separator Line */}
          <View style={styles.separator}></View>

          {/* Role and Illustration */}
          <View style={styles.roleInfo}>
            <View style={styles.roleTextContainer}>
               <Text style={styles.roleLabel}>You are a</Text>
               <Text style={styles.role} semiBold>{userData.role}</Text>
               <Text style={styles.roleDescription}>{userData.roleDescription}</Text>
            </View>
            {/* Illustration */}
            <Image source={userData.illustration} style={styles.roleIllustration} resizeMode="contain" />
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