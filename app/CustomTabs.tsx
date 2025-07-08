import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import CustomTabBar from '@/components/CustomTabBar';
import TravelersListTab from './(tabs)/travelers-list';
import PackageDetailsTab from './(tabs)/package-detail';
import ChatTab from './(tabs)/chats';
import ProfileScreen from './(tabs)/profile';
import OwnersScreen from './(tabs)/owners';
import ShipmentsScreen from './(tabs)/shipments';
import { useUserRole } from '@/utils/UserContext';
import CourierListScreen from './courier-list';
import Colors from '@/constants/Colors';

const Tab = createBottomTabNavigator();

export default function CustomTabs() {
  const { userRole, isLoading } = useUserRole();
  const isTraveller = userRole === 'TRAVELLER';

  // Get navigation object from Tab.Navigator
  const navigationRef = React.useRef<any>(null);

  useEffect(() => {
    if (navigationRef.current) {
      // Get the current route name
      const currentRoute = navigationRef.current.getCurrentRoute?.()?.name;
      // Tabs for the current role
      const validTabs = isTraveller
        ? ['couriers', 'travels', 'chats', 'profile']
        : ['travelers', 'packages', 'chats', 'profile'];
      // If current route is not in valid tabs or is 'profile', focus 'profile'
      if (!validTabs.includes(currentRoute) || currentRoute === 'profile') {
        navigationRef.current.navigate('profile');
      }
    }
  }, [userRole]);

  // Show loading spinner while role is being determined
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Tab.Navigator
      tabBar={props => (
        <CustomTabBar
          {...props}
          showOwnerTabs={isTraveller}
        />
      )}
      screenOptions={{ headerShown: false }}
      initialRouteName="profile"
    >
      {/* First Tab - Travellers for SHIPMENT_OWNER, Couriers for TRAVELLER */}
      {isTraveller ? (
        <Tab.Screen name="couriers" component={CourierListScreen} />
      ) : (
        <Tab.Screen name="travelers" component={TravelersListTab} />
      )}
      
      {/* Second Tab - Packages for SHIPMENT_OWNER, Travels for TRAVELLER */}
      {isTraveller ? (
        <Tab.Screen name="travels" component={ShipmentsScreen} />
      ) : (
        <Tab.Screen name="packages" component={PackageDetailsTab} />
      )}
      
      {/* Third Tab - Chats for both roles */}
      <Tab.Screen name="chats" component={ChatTab} />
      
      {/* Fourth Tab - Profile for both roles */}
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
} 