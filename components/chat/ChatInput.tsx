import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Paperclip, Mic } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import CameraIcon from '@/assets/svgs/CameraIcon';
import VoiceMike from '@/assets/svgs/VoiceMike';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export default function ChatInput({
  value,
  onChangeText,
  onSend,
}: ChatInputProps) {
  return (
    <View style={styles.inputWrapper}>
      <View style={styles.inputDesign}>
        <TouchableOpacity style={styles.attachButton}>
          <Paperclip
            size={15}
            color={Colors.primary}
            style={styles.attachIcon}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type here..."
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={() => {
            if (value.trim()) {
              onSend();
            }
          }}
        />
      </View>

      <TouchableOpacity style={styles.cameraButton}>
        <CameraIcon width={20} height={20} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.micButton}>
        <VoiceMike width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 8,
  },
  inputDesign: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
    maxWidth: '75%'
  },
  attachButton: {
    padding: 8,
  },
  attachIcon: {
    transform: [{ rotate: '-45deg' }],
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.primary,
    maxHeight: 100,
    padding: 0,
    fontFamily: 'OpenSans_400Regular'
  },
  cameraButton: {
    padding: 8,
  },
  micButton: {
    padding: 8,
    paddingLeft: 3,
  },
});
