import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  mobileNumber: string;
  currentRole: 'SHIPMENT_OWNER' | 'TRAVELLER';
  isVerified: boolean;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface Profile {
  id: string;
  username: string;
  email: string;
  mobileNumber: string;
  currentRole: 'SHIPMENT_OWNER' | 'TRAVELLER';
}

interface Shipment {
  id: string;
  userId: string;
  packageType: string;
  estimatedDeliveryDate: string;
  weightGrams: number;
  destinationCountry: string;
  packageImageUrl: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
  lat_coordinates: string;
  long_coordinates: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateShipmentRequest {
  packageType: 'DOCUMENTS' | 'SNACKS' | 'CLOTHES' | 'ELECTRONICS' | 'OTHER';
  estimatedDeliveryDate: string;
  weightGrams: number;
  destinationCountry: string;
  lat_coordinates: string;
  long_coordinates: string;
  packageImage: any; 
}

async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    const headers: Record<string, string> = {};

    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && accessToken) {
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const refreshResponse = await refreshAccessToken(refreshToken);
          if (refreshResponse.success) {
            return apiCall(endpoint, method, body);
          }
        }
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function login(mobileNumber: string, password: string): Promise<AuthResponse> {
  const response = await apiCall<AuthResponse>('/users/v1/auth/login', 'POST', {
    mobileNumber,
    password,
  });

  if (response.success && response.data) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
  }

  return response.data!;
}

export async function signup(
  username: string,
  email: string,
  mobileNumber: string,
  password: string
): Promise<{ userId: string }> {
  const response = await apiCall<{ userId: string }>('/users/v1/auth/signup', 'POST', {
    username,
    email,
    mobileNumber,
    password,
  });

  return response.data!;
}

export async function verifyOtp(userId: string, otp: string): Promise<AuthResponse> {
  const response = await apiCall<AuthResponse>('/users/v1/auth/verify-otp', 'POST', {
    userId,
    otp,
  });

  if (response.success && response.data) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
  }

  return response.data!;
}

export async function resendOtp(userId: string): Promise<void> {
  await apiCall('/users/v1/auth/resend-otp', 'POST', { userId });
}

async function refreshAccessToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  const response = await apiCall<{ accessToken: string; refreshToken: string }>(
    '/users/v1/auth/refresh-token',
    'POST',
    { refreshToken }
  );

  if (response.success && response.data) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
  }

  return response;
}

export async function logout(): Promise<void> {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY]);
}

export async function getStoredUser(): Promise<User | null> {
  const userData = await AsyncStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
}

export async function isAuthenticated(): Promise<boolean> {
  const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  return !!accessToken;
}

export async function getProfile(): Promise<Profile> {
  const response = await apiCall<Profile>('/users/v1/profile', 'GET');
  return response.data!;
}

export async function updateProfile(
  username: string,
  email: string,
  mobileNumber: string,
  currentRole: 'SHIPMENT_OWNER' | 'TRAVELLER'
): Promise<void> {
  await apiCall('/users/v1/profile', 'PUT', {
    username,
    email,
    mobileNumber,
    currentRole,
  });
}

export async function getShipments(): Promise<Shipment[]> {
  const response = await apiCall<Shipment[]>('/shipments/v1', 'GET');
  return response.data!;
}

export async function createShipment(data: CreateShipmentRequest): Promise<Shipment> {
  const formData = new FormData();
  
  formData.append('packageType', data.packageType);
  formData.append('estimatedDeliveryDate', data.estimatedDeliveryDate);
  formData.append('weightGrams', data.weightGrams.toString());
  formData.append('destinationCountry', data.destinationCountry);
  formData.append('lat_coordinates', data.lat_coordinates);
  formData.append('long_coordinates', data.long_coordinates);
  
  if (data.packageImage) {
    formData.append('packageImage', {
      uri: data.packageImage.uri,
      type: 'image/jpeg',
      name: 'image.jpg'
    } as any);
  }

  const response = await apiCall<Shipment>('/shipments/v1', 'POST', formData);
  return response.data!;
}