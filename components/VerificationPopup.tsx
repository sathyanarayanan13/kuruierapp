import { View, StyleSheet, Modal, TouchableOpacity, Animated, Image } from 'react-native';
import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react-native';
import Text from './Text';
import Colors from '@/constants/Colors';

interface VerificationPopupProps {
  visible: boolean;
  success: boolean;
  message: string;
  onClose: () => void;
}

export default function VerificationPopup({ visible, success, message, onClose }: VerificationPopupProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        mass: 1,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <TouchableOpacity onPress={onClose}>
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <Animated.View style={[styles.popup, { transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.iconContainer, !success && styles.iconContainerError]}>
              {success ? (
                <Image
                  source={require('@/assets/images/verifySuccess.png')}
                />
              ) : (
                <Text style={styles.errorIcon}>!</Text>
              )}
            </View>
            <Text style={styles.message} semiBold>
              {message}
            </Text>
            {/* <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText} color="secondary" semiBold>
                OK
              </Text>
            </TouchableOpacity> */}
          </Animated.View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 440,
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
  iconContainerError: {
    backgroundColor: Colors.error,
  },
  errorIcon: {
    color: Colors.secondary,
    fontSize: 32,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 30,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold',
  },
  button: {
    backgroundColor: Colors.mainTheme,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});