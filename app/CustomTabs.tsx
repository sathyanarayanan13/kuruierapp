import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '@/components/CustomTabBar';
import TravelersListTab from './(tabs)/travelers-list';
import PackageDetailsTab from './(tabs)/package-detail';
import ChatTab from './(tabs)/chats';
import ProfileScreen from './(tabs)/profile';
import OwnersScreen from './(tabs)/owners';
import ShipmentsScreen from './(tabs)/shipments';
import { useUserRole } from '@/utils/UserContext';
import CourierListScreen from './courier-list';

const Tab = createBottomTabNavigator();

export default function CustomTabs() {
  const { userRole } = useUserRole();
  const isTraveller = userRole === 'TRAVELLER';
  
  return (
    <Tab.Navigator
      tabBar={props => (
        <CustomTabBar
          {...props}
          showOwnerTabs={isTraveller}
        />
      )}
      screenOptions={{ headerShown: false }}
    >
      {/* Travelers/Owners Tab */}
      {isTraveller ? (
        <Tab.Screen name="owners" component={CourierListScreen} />
      ) : (
        <Tab.Screen name="travelers-list" component={TravelersListTab} />
      )}
      {/* Packages/Shipments Tab */}
      {isTraveller ? (
        <Tab.Screen name="shipments" component={ShipmentsScreen} />
      ) : (
        <Tab.Screen name="package-details" component={PackageDetailsTab} />
      )}
      {/* Chats Tab */}
      <Tab.Screen name="chat" component={ChatTab} />
      {/* Profile Tab */}
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
} 