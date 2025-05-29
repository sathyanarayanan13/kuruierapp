import Package from '@/assets/svgs/Package';
import React from 'react'; // No useEffect needed for this animation approach
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import ChatIcon from '@/assets/svgs/ChatIcon';
import ProfileIcon from '@/assets/svgs/ProfileIcon';
import TravellerIcon from '@/assets/svgs/TravellerIcon';
import FlightRight from '@/assets/svgs/FlightRight';

// Placeholder icons, replace with your actual icons
const TabIcons = {
  Travelers: FlightRight,
  Packages: Package,
  Owners: ProfileIcon,
  Shipments: Package,
  Chats: ChatIcon,
  Profile: ProfileIcon,
};

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  showOwnerTabs?: boolean; // If true, show Owners/Shipments, else Travelers/Packages
  visible?: boolean; // If false, hide the tab bar
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

  // Tab config
  const tabConfig = [
    showOwnerTabs
      ? { key: 'Owners', label: 'Owners', icon: TabIcons.Owners, route: 'owners' }
      : { key: 'Travelers', label: 'Travellers', icon: TabIcons.Travelers, route: 'travelers-list' },
    showOwnerTabs
      ? { key: 'Shipments', label: 'Shipments', icon: TabIcons.Shipments, route: 'shipments' }
      : { key: 'Packages', label: 'Packages', icon: TabIcons.Packages, route: 'package-details' },
    { key: 'Chats', label: 'Chats', icon: TabIcons.Chats, route: 'chat' },
    { key: 'Profile', label: 'Profile', icon: TabIcons.Profile, route: 'profile' },
  ];

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}> 
      {tabConfig.map((tab, idx) => {
        const isFocused = state.index === idx;
        const IconComponent = tab.icon; // Get the SVG component
        const route = state.routes[idx];

         // Define animated style for the *content* of the active tab button
        const animatedActiveContentStyle = useAnimatedStyle(() => {
          return {
            transform: [
              { translateY: withSpring(isFocused ? -20 : 0) }, // Animate vertical position
              { scale: withSpring(isFocused ? 1.1 : 1) }, // Animate scale
            ],
          };
        });

        return (
          <TouchableOpacity
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(tab.route, route.params); // Pass params if any
              }
            }}
            style={styles.tabButton}
            activeOpacity={0.8}
          >
             {/* Apply animation to the content wrapper */}
            <Animated.View style={animatedActiveContentStyle}>
               <View style={isFocused ? styles.activeIconWrapper : styles.iconWrapper}>
                  <IconComponent width={isFocused ? 22 : 22} height={isFocused ? 22 : 22} fill={isFocused ? '#fff' : 'none'} stroke={!isFocused && '#48507E'}/>
               </View>
               <Text style={isFocused ? styles.activeLabel : styles.label}>{tab.label}</Text>
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