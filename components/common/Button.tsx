import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  disabled?: boolean;
}

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary',
  style,
  disabled
}: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
        style
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text 
        style={[
          styles.buttonText,
          variant === 'secondary' && styles.buttonTextSecondary
        ]} 
        color={variant === 'primary' ? 'secondary' : 'primary'} 
        semiBold
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.mainTheme,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.mainTheme,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: Colors.mainTheme,
  },
});