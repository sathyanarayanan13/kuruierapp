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

export interface Shipment {
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

export interface Trip {
  id: string;
  userId: string;
  pnrNumber: string;
  fromCountry: string;
  toCountry: string;
  departureDate: string;
  status: 'ACCEPTING' | 'IN_TRANSIT' | 'COMPLETED';
  flightInfo: string;
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

interface CreateTripRequest {
  pnrNumber: string;
  fromCountry: string;
  toCountry: string;
  departureDate: string;
  flightInfo: string;
  lat_coordinates: string;
  long_coordinates: string;
}

interface CreateTripResponse {
  success: boolean;
  message: string;
  data: {
    trip: Trip;
    matchingShipments: any[];
  };
}

export interface PredefinedMessagesResponse {
  messages: string[];
}

export interface ChatInitiateResponse {
  matchId: string;
  chatAccess: {
    id: string;
    shipmentId: string;
    tripId: string;
    matchId: string;
    isBonus: boolean;
    unlockedByPayment: boolean;
    unlockedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  canSendFreeText: boolean;
}

export interface ChatUser {
  id: string;
  username: string;
  currentRole: 'SHIPMENT_OWNER' | 'TRAVELLER';
}

export interface ChatShipment {
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
  user: ChatUser;
}

export interface ChatTrip {
  id: string;
  userId: string;
  pnrNumber: string;
  fromCountry: string;
  toCountry: string;
  departureDate: string;
  status: 'ACCEPTING' | 'IN_TRANSIT' | 'COMPLETED';
  flightInfo: string;
  lat_coordinates: string;
  long_coordinates: string;
  createdAt: string;
  updatedAt: string;
  user: ChatUser;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  messageType: string;
  messageContent: string;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  isPredefined: boolean;
  createdAt: string;
  sender: { id: string; username: string };
}

export interface ChatAccess {
  id: string;
  shipmentId: string;
  tripId: string;
  matchId: string;
  isBonus: boolean;
  unlockedByPayment: boolean;
  unlockedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
  chatAccess: ChatAccess;
  canSendFreeText: boolean;
}

export interface ChatMatch {
  id: string;
  shipmentId: string;
  tripId: string;
  createdAt: string;
  updatedAt: string;
  shipment: ChatShipment;
  trip: ChatTrip;
  chatAccess: any[];
  chats: ChatMessage[];
}

export interface ChatListItem {
  id: string;
  matchId: string;
  userId: string;
  roleInChat: 'SHIPMENT_OWNER' | 'TRAVELLER';
  joinedAt: string;
  match: ChatMatch;
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

export async function getShipments(destinationCountry?: string): Promise<Shipment[]> {
  const queryParams = destinationCountry ? `?destinationCountry=${encodeURIComponent(destinationCountry)}` : '';
  const res = await apiCall<Shipment[]>(`/shipments/v1${queryParams}`, 'GET');
  if (!res.success) throw new Error(res.message || 'Failed to fetch shipments');
  return res.data!;
}

export async function getMyShipments(): Promise<Shipment[]> {
  const response = await apiCall<Shipment[]>('/shipments/v1/my-shipments', 'GET');
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

export async function getTrips(destinationCountry?: string): Promise<Trip[]> {
  const queryParams = destinationCountry ? `?destinationCountry=${encodeURIComponent(destinationCountry)}` : '';
  const res = await apiCall<Trip[]>(`/trips/v1${queryParams}`, 'GET');
  if (!res.success) throw new Error(res.message || 'Failed to fetch trips');
  return res.data!;
}

export async function getMyTrips(): Promise<Trip[]> {
  const response = await apiCall<Trip[]>('/trips/v1/my-trips', 'GET');
  return response.data!;
}


export async function createTrip(data: CreateTripRequest): Promise<CreateTripResponse> {
  const response = await apiCall<CreateTripResponse>('/trips/v1', 'POST', data);
  return response.data!;
}

export async function getPredefinedMessages(): Promise<string[]> {
  const response = await apiCall<PredefinedMessagesResponse>('/chat/v1/predefined-messages', 'GET');
  return response.data?.messages || [];
}

export async function initiateChat(shipmentId: string, tripId: string): Promise<ChatInitiateResponse> {
  const response = await apiCall<{ matchId: string; chatAccess: ChatInitiateResponse["chatAccess"]; canSendFreeText: boolean }>(
    '/chat/v1/initiate',
    'POST',
    { shipmentId, tripId }
  );
  if (!response.success || !response.data) throw new Error(response.message || 'Something went wrong');
  return response.data;
}

export async function getChats(): Promise<ChatListItem[]> {
  const response = await apiCall<ChatListItem[]>('/chat/v1/chats', 'GET');
  if (!response.success || !response.data) throw new Error(response.message || 'Failed to fetch chats');
  return response.data;
}

/**
 * Create a PaymentIntent for a chat match
 * @param matchId - The match/chat ID
 * @param amount - Amount in INR (e.g., 200 for ₹200)
 * @returns clientSecret string
 */
export async function createPaymentIntent(matchId: string, amount: number): Promise<string> {
  const response = await apiCall<{ clientSecret: string }>(
    '/payments/v1/create-intent',
    'POST',
    { matchId, amount, currency: 'inr' }
  );
  if (!response.success || !response.data) throw new Error(response.message || 'Failed to create payment intent');
  return response.data.clientSecret;
}

/**
 * Confirm payment and unlock chat
 * @param clientSecret - The PaymentIntent client secret
 * @returns the full data object from the backend (including success, message, paymentIntent, chatAccess, etc.)
 */
export async function confirmPayment(clientSecret: string): Promise<any> {
  const response = await apiCall<any>(
    '/payments/v1/confirm',
    'POST',
    { clientSecret }
  );
  // Accept both response.success and response.data?.success as valid
  if (!response.success && !(response.data && response.data.success)) {
    throw new Error(response.message || 'Failed to confirm payment');
  }
  return response.data;
}

/**
 * Helper to get MIME type from file extension
 */
export function getMimeType(uri: string): string {
  const extension = uri.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'ogg':
      return 'audio/ogg';
    case 'mp4':
      return 'audio/mp4';
    case 'webm':
      return 'audio/webm';
    case 'm4a':
      return 'audio/m4a';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Helper to construct the correct file URL based on message type and backend directory structure
 * @param fileUrl - The file URL from the backend response
 * @param messageType - The type of message (IMAGE, FILE, VOICE_NOTE)
 * @returns Complete file URL
 */
export function getFileUrl(fileUrl: string | null, messageType: string): string | null {
  if (!fileUrl) return null;
    
  // If it's already a full URL, return as is
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }
  
  // If it's a local file:// URI, return as is
  if (fileUrl.startsWith('file://')) {
    return fileUrl;
  }
  
  // Construct URL based on backend directory structure
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://194.164.150.61:3000';
  
  // Remove leading slash if present
  const cleanFileUrl = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
  
  // Check if the fileUrl already contains the correct directory structure
  if (cleanFileUrl.includes('uploads/chat/')) {
    // File already has the correct path, use as is
    const finalUrl = `${baseUrl}/${cleanFileUrl}`;
    return finalUrl;
  }
  
  // If not, construct the path based on message type
  // Note: Based on the logs, it seems the backend is saving all files in uploads/chat/
  // rather than the specific subdirectories we expected
  const fileName = cleanFileUrl.split('/').pop() || cleanFileUrl;
  const finalUrl = `${baseUrl}/uploads/chat/${fileName}`;
  
  return finalUrl;
}

/**
 * Helper to get the appropriate directory for file uploads based on message type
 * @param messageType - The type of message (IMAGE, FILE, VOICE_NOTE)
 * @returns Directory path
 */
export function getUploadDirectory(messageType: string): string {
  switch (messageType) {
    case 'IMAGE':
      return 'uploads/chat/images';
    case 'VOICE_NOTE':
      return 'uploads/chat/voice';
    case 'FILE':
      return 'uploads/chat/files';
    default:
      return 'uploads/chat/files';
  }
}

/**
 * Send a chat message (text, file, image, or voice)
 * @param params - matchId, messageContent, messageType, isPredefined, file (optional)
 * @returns sent message data
 */
export async function sendMessage({
  matchId,
  messageContent,
  messageType,
  isPredefined,
  fileUri,
}: {
  matchId: string;
  messageContent: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE_NOTE';
  isPredefined: boolean;
  fileUri?: string;
}): Promise<any> {
  const formData = new FormData();
  formData.append('matchId', matchId);
  formData.append('messageContent', messageContent);
  formData.append('messageType', messageType);
  formData.append('isPredefined', isPredefined ? 'true' : 'false');
  
  if (fileUri) {
    // Note: Backend seems to save all files in uploads/chat/ directory
    // formData.append('uploadDirectory', uploadDir);
    
    formData.append('file', {
      uri: fileUri,
      name: fileUri.split('/').pop() || 'file',
      type: getMimeType(fileUri),
    } as any);
  }
  
  const accessToken = await AsyncStorage.getItem('access_token');
  const response = await fetch(`${API_URL}/chat/v1/message`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      // 'Content-Type' is set automatically for FormData
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to send message');
  }
  return data.data;
}

/**
 * Get chat messages and access details for a specific match
 * @param matchId - The match ID
 * @returns messages, chatAccess, and canSendFreeText
 */
export async function getChatMessages(matchId: string): Promise<ChatMessagesResponse> {
  const response = await apiCall<ChatMessagesResponse>(`/chat/v1/${matchId}/messages`, 'GET');
  if (!response.success || !response.data) throw new Error(response.message || 'Failed to fetch messages');
  return response.data;
}

/**
 * Get chat details and messages for a specific match
 * @param matchId - The match ID
 * @returns chat details with messages
 */
export async function getChatDetails(matchId: string): Promise<ChatMatch> {
  const response = await apiCall<ChatMatch>(`/chat/v1/chats/${matchId}`, 'GET');
  if (!response.success || !response.data) throw new Error(response.message || 'Failed to fetch chat details');
  return response.data;
}

export async function getValidCounts(): Promise<{ validPackageCount: number; validTravelCount: number }> {
  const res = await apiCall<{ validPackageCount: number; validTravelCount: number }>(
    '/users/v1/valid-counts',
    'GET'
  );
  if (!res.success) throw new Error(res.message || 'Failed to fetch valid counts');
  return res.data!;
}