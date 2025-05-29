import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="title" color="mainTheme" style={styles.text}>
        Settings Screen
      </Text>
      <Text variant="body" color="primary" style={styles.message}>
        This screen will be implemented in future updates.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    opacity: 0.7,
  },
});