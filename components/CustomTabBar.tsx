import Package from '@/assets/svgs/Package';
import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import ChatIcon from '@/assets/svgs/ChatIcon';
import ProfileIcon from '@/assets/svgs/ProfileIcon';
import TravellerIcon from '@/assets/svgs/TravellerIcon';
import FlightRight from '@/assets/svgs/FlightRight';

// Tab icons
const TabIcons = {
  Travelers: FlightRight,
  Packages: Package,
  Couriers: ProfileIcon,
  Travels: Package,
  Chats: ChatIcon,
  Profile: ProfileIcon,
};

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  showOwnerTabs?: boolean; // If true, show Couriers/Travels, else Travelers/Packages
  visible?: boolean;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  showOwnerTabs = false,
  visible = true,
}) => {
  const insets = useSafeAreaInsets();
  
  if (!visible) return null;

  // Tab configuration based on user role
  const tabConfig = [
    {
      key: showOwnerTabs ? 'Couriers' : 'Travelers',
      label: showOwnerTabs ? 'Couriers' : 'Travellers',
      icon: showOwnerTabs ? TabIcons.Couriers : TabIcons.Travelers,
      route: showOwnerTabs ? 'couriers' : 'travelers'
    },
    {
      key: showOwnerTabs ? 'Travels' : 'Packages',
      label: showOwnerTabs ? 'Travel\'s' : 'Packages',
      icon: showOwnerTabs ? TabIcons.Travels : TabIcons.Packages,
      route: showOwnerTabs ? 'travels' : 'packages'
    },
    {
      key: 'Chats',
      label: 'Chats',
      icon: TabIcons.Chats,
      route: 'chats'
    },
    {
      key: 'Profile',
      label: 'Profile',
      icon: TabIcons.Profile,
      route: 'profile'
    },
  ];

  // Ensure correct tab is focused after role change
  useEffect(() => {
    const validRoutes = tabConfig.map(tab => tab.route);
    const currentRoute = state.routes[state.index]?.name;
    if (!validRoutes.includes(currentRoute) || currentRoute === 'profile') {
      navigation.navigate('profile');
    }
  }, [showOwnerTabs, state.routes.length]);

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}> 
      {tabConfig.map((tab, index) => {
        const route = state.routes.find((r: any) => r.name === tab.route);
        const isFocused = route && state.index === state.routes.findIndex((r: any) => r.name === route.name);
        const IconComponent = tab.icon;

        // Animated style for active tab
        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [
              { translateY: withSpring(isFocused ? -20 : 0) },
              { scale: withSpring(isFocused ? 1.1 : 1) },
            ],
          };
        });

        return (
          <TouchableOpacity
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => {
              if (route) {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(tab.route);
                }
              }
            }}
            style={styles.tabButton}
            activeOpacity={0.8}
          >
            <Animated.View style={animatedStyle}>
              <View style={isFocused ? styles.activeIconWrapper : styles.iconWrapper}>
                <IconComponent 
                  width={22} 
                  height={22} 
                  fill={isFocused ? '#fff' : 'none'} 
                  stroke={!isFocused ? '#48507E' : undefined}
                />
              </View>
              <Text style={isFocused ? styles.activeLabel : styles.label}>
                {tab.label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 85,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center'
  },
  activeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#162BEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, 
    shadowRadius: 6,
    elevation: 10,
  },
  label: {
    fontSize: 13,
    color: '#3E3F68',
    marginTop: 2,
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center'
  },
  activeLabel: {
    fontSize: 13,
    color: '#000',
    fontFamily: 'OpenSans_600SemiBold',
    marginTop: 2,
    textAlign: 'center'
  },
});

export default CustomTabBar; 