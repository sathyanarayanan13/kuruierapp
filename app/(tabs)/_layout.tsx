import React from 'react';
import CustomTabs from '../CustomTabs';
import { StyleSheet, Platform } from 'react-native';
import { Chrome as Home, User, Settings } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  return <CustomTabs />;
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: -2 },
    height: 60,
    paddingBottom: 6,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: '-apple-system',
      android: 'Roboto',
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  header: {
    backgroundColor: Colors.mainTheme,
  },
  headerTitle: {
    color: Colors.secondary,
    fontWeight: '600',
    fontSize: 18,
    fontFamily: Platform.select({
      ios: '-apple-system',
      android: 'Roboto',
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
});