import { View, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Box } from 'lucide-react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import PackageReady from '@/assets/svgs/PackageReady';

interface DeliveryConfirmDrawerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeliveryConfirmDrawer({ visible, onClose, onConfirm }: DeliveryConfirmDrawerProps) {
  const translateY = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        mass: 1,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 1000,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      />
      <Animated.View 
        style={[
          styles.drawer,
          { transform: [{ translateY }] }
        ]}
      >
        <View style={styles.handle} />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <PackageReady />
          </View>
          <Text style={styles.title} semiBold>
            Is Package Ready to Deliver?
          </Text>
          <Text style={styles.description}>
            If pressing <Text style={{fontWeight: 700}}>"yes"</Text> leads OTP for confirmation
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.button, styles.yesButton]} 
              onPress={onConfirm}
            >
              <Text style={styles.yesButtonText} color="secondary">
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.noButton]} 
              onPress={onClose}
            >
              <Text style={styles.noButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  content: {
    padding: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
    paddingVertical: 10,
    marginVertical: 10
  },
  title: {
    fontSize: 18,
    color: Colors.primary,
    marginVertical: 20,
    textAlign: 'left',
    fontFamily: 'OpenSans_600SemiBold'
  },
  description: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.5,
    textAlign: 'left',
    marginBottom: 24,
    fontFamily: 'OpenSans_400Regular'
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noButton: {
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  yesButton: {
    backgroundColor: Colors.mainTheme,
  },
  noButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold'
  },
  yesButtonText: {
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold'
  },
});