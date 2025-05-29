import { Text as RNText, TextProps as RNTextProps, StyleSheet, Platform } from 'react-native';
import { forwardRef } from 'react';
import Colors from '../constants/Colors';

interface TextProps extends RNTextProps {
  variant?: 'header' | 'title' | 'subtitle' | 'body' | 'caption';
  color?: keyof typeof Colors | string;
  bold?: boolean;
  medium?: boolean;
  semiBold?: boolean;
}

const Text = forwardRef<RNText, TextProps>(({ 
  style, 
  variant = 'body', 
  color = 'text',
  bold = false,
  medium = false,
  semiBold = false,
  ...props 
}, ref) => {
  // Get color from theme or use directly
  const textColor = color in Colors ? Colors[color as keyof typeof Colors] : color;

  return (
    <RNText
      ref={ref}
      style={[
        styles.text,
        styles[variant],
        { color: textColor },
        bold && styles.bold,
        medium && styles.medium,
        semiBold && styles.semiBold,
        style,
      ]}
      {...props}
    />
  );
});

Text.displayName = 'Text';

export default Text;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: '-apple-system',
      android: 'Roboto',
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  header: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '500',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
  },
  semiBold: {
    fontWeight: '600',
  },
  medium: {
    fontWeight: '500',
  },
});