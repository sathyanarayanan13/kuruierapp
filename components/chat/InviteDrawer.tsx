import { View, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import Phone from '@/assets/svgs/Phone';

interface InviteDrawerProps {
  visible: boolean;
  onClose: () => void;
  onInvite: () => void;
}

export default function InviteDrawer({ visible, onClose, onInvite }: InviteDrawerProps) {
  const [mobile, setMobile] = useState('');

  const handleInvite = () => {
    if (mobile.trim()) {
      onInvite();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.title} semiBold>Invite User</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.description}>
              Enter your relative / friend's phone number who is going to receive the shipment
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Mobile <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="ex : 1234567890"
                  placeholderTextColor="#999"
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                />
                <View style={styles.iconWrapper}>
                  <Phone width={20} height={19} />
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              
              <TouchableOpacity 
                style={[
                  styles.inviteButton,
                  !mobile.trim() && styles.inviteButtonDisabled
                ]} 
                onPress={handleInvite}
                disabled={!mobile.trim()}
              >
                <Text style={styles.inviteButtonText} color="secondary" semiBold>
                  Invite
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>
                  Cancel
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
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold'
  },
  content: {
    gap: 24,
  },
  description: {
    fontSize: 15,
    color: Colors.primary,
    opacity: 0.7,
    textAlign: 'left',
    fontFamily: 'OpenSans_400Regular'
  },
  inputContainer: {
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    fontSize: 13,
    color: '#3E3F68',
    zIndex: 1,
    fontFamily: 'OpenSans_500Medium',
  },
  required: {
    color: '#FF4C61',
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
    fontFamily: 'OpenSans_400Regular'
  },
  actions: {
    flexDirection: 'column',
  },
  cancelButton: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.primary,
  },
  inviteButton: {
    backgroundColor: Colors.mainTheme,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButtonDisabled: {
    opacity: 0.5,
  },
  inviteButtonText: {
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold'
  },
  iconWrapper: {
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'OpenSans_400Regular'
  },
});