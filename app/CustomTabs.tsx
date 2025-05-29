import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '@/components/CustomTabBar';
import { View, Text } from 'react-native';
import TravelersListTab from './(tabs)/travelers-list';
import PackageDetailsTab from './(tabs)/package-detail';
import ChatTab from './(tabs)/chats';
import ProfileScreen from './(tabs)/profile';
import OwnersScreen from './(tabs)/owners';
import ShipmentsScreen from './(tabs)/shipments';

const Tab = createBottomTabNavigator();

// Example logic to determine which tab set to show and when to hide the tab bar
// In a real app, you might use context, redux, or navigation state
function useTabConfig(route: any) {
  // Example: switch to Owners/Shipments if route.name includes 'owner' or 'shipment'
  const showOwnerTabs =
    route?.state?.routes?.[route.state.index]?.name?.includes('owner') ||
    route?.state?.routes?.[route.state.index]?.name?.includes('shipment');

  // Example: hide tab bar on a specific screen
  const hideTabBar =
    route?.state?.routes?.[route.state.index]?.name === 'SomeHiddenScreen';

  return { showOwnerTabs, hideTabBar };
}

export default function CustomTabs({ navigation = {}, route = {} }: { navigation?: any; route?: any }) {
  // You can use navigation or route to determine tab config
  const { showOwnerTabs, hideTabBar } = useTabConfig(route);
  
  return (
    <Tab.Navigator
      tabBar={props => (
        <CustomTabBar
          {...props}
          showOwnerTabs={showOwnerTabs}
          visible={!hideTabBar}
        />
      )}
      screenOptions={{ headerShown: false }}
    >
      {/* Travelers/Owners Tab */}
      {showOwnerTabs ? (
        <Tab.Screen name="owners" component={OwnersScreen} />
      ) : (
        <Tab.Screen name="travelers-list" component={TravelersListTab} />
      )}
      {/* Packages/Shipments Tab */}
      {showOwnerTabs ? (
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