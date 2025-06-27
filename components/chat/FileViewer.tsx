import React from 'react';
import { View, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import { FileText, Download } from 'lucide-react-native';

interface FileViewerProps {
  uri: string;
  fileName?: string;
  fileSize?: number;
}

export default function FileViewer({ uri, fileName, fileSize }: FileViewerProps) {
  const handleOpenFile = async () => {
    try {
      // Handle different URL formats
      let fileUri = uri;
      
      if (uri.startsWith('file://')) {
        // Local file, use as is
        fileUri = uri;
      } else if (uri.startsWith('http://') || uri.startsWith('https://')) {
        // Remote URL, use as is
        fileUri = uri;
      } else if (uri.startsWith('/uploads/')) {
        // Backend relative path, construct full URL
        const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://194.164.150.61:3000';
        fileUri = `${baseUrl}${uri}`;
      } else {
        // Fallback: assume it's a relative path
        const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://194.164.150.61:3000';
        fileUri = `${baseUrl}/${uri}`;
      }
      
      console.log('Opening file from:', fileUri);
      
      const supported = await Linking.canOpenURL(fileUri);
      if (supported) {
        await Linking.openURL(fileUri);
      } else {
        console.log('Cannot open file:', fileUri);
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleOpenFile}>
      <View style={styles.iconContainer}>
        <FileText size={24} color={Colors.secondary} />
      </View>
      
      <View style={styles.info}>
        <Text style={styles.fileName}>{fileName || 'Document'}</Text>
        {fileSize && (
          <Text style={styles.fileSize}>{formatFileSize(fileSize)}</Text>
        )}
      </View>
      
      <View style={styles.actionContainer}>
        <Download size={16} color={Colors.secondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.mainTheme,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold',
    color: Colors.secondary,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    fontFamily: 'OpenSans_400Regular',
    color: Colors.secondary,
    opacity: 0.8,
  },
  actionContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 