import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

// API response types
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

// Profile types
interface Profile {
  id: string;
  username: string;
  email: string;
  mobileNumber: string;
  currentRole: 'SHIPMENT_OWNER' | 'TRAVELLER';
}

// API call function
async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      // If token is expired, try to refresh it
      if (response.status === 401 && accessToken) {
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const refreshResponse = await refreshAccessToken(refreshToken);
          if (refreshResponse.success) {
            // Retry the original request with new token
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

// Authentication functions
export async function login(mobileNumber: string, password: string): Promise<AuthResponse> {
  const response = await apiCall<AuthResponse>('/v1/auth/login', 'POST', {
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
  const response = await apiCall<{ userId: string }>('/v1/auth/signup', 'POST', {
    username,
    email,
    mobileNumber,
    password,
  });

  return response.data!;
}

export async function verifyOtp(userId: string, otp: string): Promise<AuthResponse> {
  const response = await apiCall<AuthResponse>('/v1/auth/verify-otp', 'POST', {
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
  await apiCall('/v1/auth/resend-otp', 'POST', { userId });
}

async function refreshAccessToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  const response = await apiCall<{ accessToken: string; refreshToken: string }>(
    '/v1/auth/refresh-token',
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

// Profile API functions
export async function getProfile(): Promise<Profile> {
  const response = await apiCall<Profile>('/v1/profile', 'GET');
  return response.data!;
}

export async function updateProfile(
  username: string,
  email: string,
  mobileNumber: string,
  currentRole: 'SHIPMENT_OWNER' | 'TRAVELLER'
): Promise<void> {
  await apiCall('/v1/profile', 'PUT', {
    username,
    email,
    mobileNumber,
    currentRole,
  });
} 