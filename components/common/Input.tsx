import { View, StyleSheet, TextInput, TextInputProps } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  icon?: LucideIcon;
}

export default function Input({ 
  label, 
  required, 
  icon: Icon,
  style,
  ...props 
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#999"
          {...props}
        />
        {Icon && <Icon size={20} color={Colors.primary} style={styles.icon} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.primary,
  },
  required: {
    color: Colors.error,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.primary,
  },
  icon: {
    padding: 12,
  },
});