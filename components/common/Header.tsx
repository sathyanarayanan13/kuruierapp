import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
}

export default function Header({ title, subtitle, rightComponent }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ChevronLeft size={24} color={Colors.primary} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title} semiBold>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
      {rightComponent}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.7,
  },
});