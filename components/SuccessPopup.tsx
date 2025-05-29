import { View, StyleSheet, Modal, Animated, Image } from 'react-native';
import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react-native';
import Text from './Text';
import Colors from '@/constants/Colors';

interface SuccessPopupProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessPopup({
  visible,
  message,
  onClose,
}: SuccessPopupProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        mass: 1,
      }).start();

      // Auto close after 2 seconds
      const timeoutId = setTimeout(() => {
        handleClose();
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.popup, { transform: [{ scale: scaleAnim }] }]}
        >
          <View style={styles.iconContainer}>
            <Image source={require('@/assets/images/verifySuccess.png')} />
          </View>
          <Text style={styles.message} semiBold>
            {message}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 30,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold'
  },
});
