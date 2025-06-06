import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerResult {
  uri: string;
  type: string;
  fileName: string;
}

export function useImagePicker() {
  const [image, setImage] = useState<ImagePickerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission to access media library was denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setImage({
          uri: selectedAsset.uri,
          type: 'image/jpeg',
          fileName: selectedAsset.uri.split('/').pop() || 'image.jpg',
        });
        setError(null);
      }
    } catch (err) {
      setError('Error picking image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission to access camera was denied');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setImage({
          uri: selectedAsset.uri,
          type: 'image/jpeg',
          fileName: selectedAsset.uri.split('/').pop() || 'image.jpg',
        });
        setError(null);
      }
    } catch (err) {
      setError('Error taking photo');
    }
  };

  return {
    image,
    error,
    pickImage,
    takePhoto,
  };
} 