import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { Paperclip, Mic } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import CameraIcon from '@/assets/svgs/CameraIcon';
import VoiceMike from '@/assets/svgs/VoiceMike';
import { useMediaPicker } from '@/hooks/useMediaPicker';
import Text from '@/components/Text';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onSendMedia?: (media: { uri: string; type: 'IMAGE' | 'FILE' | 'VOICE_NOTE'; fileName: string; fileSize?: number }) => void;
  disabled?: boolean;
}

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  onSendMedia,
  disabled = false,
}: ChatInputProps) {
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const {
    isRecording,
    error,
    pickImage,
    takePhoto,
    pickDocument,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useMediaPicker();

  const handleAttachmentPress = () => {
    if (disabled) return;
    setShowAttachmentModal(true);
  };

  const handleCameraPress = async () => {
    if (disabled) return;
    const result = await takePhoto();
    if (result && onSendMedia) {
      onSendMedia(result);
    }
  };

  const handleMicPress = async () => {
    if (disabled) return;
    
    if (isRecording) {
      const result = await stopRecording();
      if (result && onSendMedia) {
        onSendMedia(result);
      }
    } else {
      const success = await startRecording();
      if (!success) {
        Alert.alert('Error', 'Failed to start recording');
      }
    }
  };

  const handleLongMicPress = () => {
    if (disabled) return;
    Alert.alert(
      'Cancel Recording',
      'Do you want to cancel the current recording?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: cancelRecording },
      ]
    );
  };

  const handlePickImage = async () => {
    setShowAttachmentModal(false);
    const result = await pickImage();
    if (result && onSendMedia) {
      onSendMedia(result);
    }
  };

  const handlePickDocument = async () => {
    setShowAttachmentModal(false);
    const result = await pickDocument();
    if (result && onSendMedia) {
      onSendMedia(result);
    }
  };

  return (
    <>
      <View style={styles.inputWrapper}>
        <View style={styles.inputDesign}>
          <TouchableOpacity 
            style={styles.attachButton} 
            disabled={disabled}
            onPress={handleAttachmentPress}
          >
            <Paperclip
              size={15}
              color={Colors.primary}
              style={styles.attachIcon}
            />
          </TouchableOpacity>

          <TextInput
            style={[styles.input, disabled && styles.disabledInput]}
            placeholder="Type here..."
            placeholderTextColor="#999"
            value={value}
            onChangeText={onChangeText}
            editable={!disabled}
            onSubmitEditing={() => {
              if (value.trim() && !disabled) {
                onSend();
              }
            }}
          />
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.cameraButton, isRecording && styles.recordingButton]} 
            disabled={disabled}
            onPress={handleCameraPress}
          >
            <CameraIcon width={20} height={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.micButton, 
              isRecording && styles.recordingActiveButton
            ]} 
            disabled={disabled}
            onPress={handleMicPress}
            onLongPress={handleLongMicPress}
          >
            {isRecording ? (
              <View style={styles.recordingContainer}>
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingDot} />
                </View>
                <Text style={styles.recordingText}>Tap to stop</Text>
              </View>
            ) : (
              <VoiceMike width={20} height={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Attachment Modal */}
      <Modal
        visible={showAttachmentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachmentModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAttachmentModal(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handlePickImage}
            >
              <Text style={styles.modalOptionText}>Photo Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handlePickDocument}
            >
              <Text style={styles.modalOptionText}>Document</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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
    flex: 1,
    maxWidth: '70%'
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
  disabledInput: {
    opacity: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cameraButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  micButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButton: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  recordingActiveButton: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
    minWidth: 80,
    paddingHorizontal: 12,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
  recordingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.secondary,
    alignSelf: 'center',
    marginTop: 2,
  },
  recordingText: {
    fontSize: 12,
    color: Colors.secondary,
    fontFamily: 'OpenSans_500Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'OpenSans_500Medium',
  },
});
