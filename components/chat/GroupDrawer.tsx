import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useState } from 'react';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import { Check } from 'lucide-react-native';
import Phone from '@/assets/svgs/Phone';
import MessageIcon from '@/assets/svgs/MessageIcon';

interface GroupDrawerProps {
  visible: boolean;
  onClose: () => void;
  onCreateGroup: () => void;
}

export default function GroupDrawer({
  visible,
  onClose,
  onCreateGroup,
}: GroupDrawerProps) {
  const [groupName, setGroupName] = useState('Group Chat 1');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          <View style={styles.iconContainer}>
            <Check size={20} color={Colors.secondary} />
          </View>
          <View style={styles.header}>
            <Text style={styles.title} semiBold>
              User accepted the invite
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.description}>
              Adding new users leads from normal chat to group chat. You may
              give your group name.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Group Chat <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={groupName}
                  onChangeText={setGroupName}
                  placeholder="Enter group name"
                  placeholderTextColor="#999"
                />
                <View style={styles.iconWrapper}>
                  <MessageIcon width={20} height={19} />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={onCreateGroup}
              disabled={!groupName.trim()}
            >
              <Text style={styles.createButtonText} color="secondary" semiBold>
                Done
              </Text>
            </TouchableOpacity>
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 32,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawer: {
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: '40%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 5,
    gap: 30,
  },
  title: {
    fontSize: 20,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold'
  },
  closeButton: {
    fontSize: 24,
    color: Colors.primary,
    position: 'absolute',
    bottom: 35,
    right: 0,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: Colors.primary,
    opacity: 0.7,
    marginBottom: 20,
    fontFamily: 'OpenSans_400Regular'
  },
  inputContainer: {
    marginBottom: 0,
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
    borderWidth: 1,
    borderColor: '#E0E3F0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    lineHeight: 20,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#3E3F68',
    fontFamily: 'OpenSans_400Regular'
  },
  iconWrapper: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    marginLeft: 10,
  },
  createButton: {
    marginTop: 24,
    backgroundColor: Colors.mainTheme,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold'
  },
});
