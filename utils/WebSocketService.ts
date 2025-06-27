import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

class WebSocketService {
  private socket: any = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private eventListeners: Map<string, Function[]> = new Map();
  private currentMatchId: string | null = null;

  async connect() {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://194.164.150.61:3000';
      
      this.socket = io(API_URL, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
        auth: {
          token
        }
      });

      this.setupEventHandlers();
      
      // Authenticate after connection
      this.socket.on('connect', () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.authenticate(token);
      });

    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      this.attemptReconnect();
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
      this.attemptReconnect();
    });

    this.socket.on('unauthorized', (data: any) => {
      console.error('WebSocket unauthorized:', data.message);
      this.disconnect();
    });

    this.socket.on('error', (data: any) => {
      console.error('WebSocket error:', data.message);
    });
  }

  private authenticate(token: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('authenticate', { token });
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentMatchId = null;
    }
  }

  // Chat methods
  joinChat(matchId: string) {
    if (this.socket && this.isConnected) {
      this.currentMatchId = matchId;
      this.socket.emit('join_chat', { matchId });
      console.log('Joined chat:', matchId);
    }
  }

  leaveChat(matchId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_chat', { matchId });
      if (this.currentMatchId === matchId) {
        this.currentMatchId = null;
      }
      console.log('Left chat:', matchId);
    }
  }

  startTyping(matchId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('start_typing', { matchId });
    }
  }

  stopTyping(matchId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('stop_typing', { matchId });
    }
  }

  markMessageAsRead(messageId: string, matchId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark_message_read', { messageId, matchId });
    }
  }

  // Event listeners
  on(event: string, callback: Function) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Store callback for cleanup
      if (!this.eventListeners.has(event)) {
        this.eventListeners.set(event, []);
      }
      this.eventListeners.get(event)!.push(callback);
    }
  }

  off(event: string, callback: Function) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove from stored callbacks
      if (this.eventListeners.has(event)) {
        const callbacks = this.eventListeners.get(event)!;
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.eventListeners.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          this.socket.off(event, callback);
        });
      });
      this.eventListeners.clear();
    }
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket && this.socket.connected;
  }

  getCurrentMatchId(): string | null {
    return this.currentMatchId;
  }
}

export default new WebSocketService(); 