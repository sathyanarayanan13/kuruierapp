import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Info } from 'lucide-react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';

interface DeliveryPopupProps {
  visible: boolean;
  onClose: () => void;
}

export default function DeliveryPopup({
  visible,
  onClose,
}: DeliveryPopupProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View>
            <Info size={20} color={Colors.mainTheme} />
          </View>
          <View>
            <Text style={styles.message}>
              Click here to when you receive the product is delivered
            </Text>
            <View style={{width: '30%'}}>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText} color="secondary" semiBold>
                  Okay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    padding: 24,
  },
  popup: {
    position: 'absolute',
    top: 65,
    right: 20,
    flexDirection: 'row',
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 300,
    gap: 10,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'left',
    marginBottom: 10,
    lineHeight: 22,
    fontFamily: 'OpenSans_500Medium'
  },
  button: {
    backgroundColor: '#1C33FF',
    height: 35,
    paddingHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    verticalAlign: 'middle'
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold'
  },
});
