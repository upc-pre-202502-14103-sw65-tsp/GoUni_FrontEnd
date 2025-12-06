import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environments';

export interface ChatMessage {
  id?: string;
  chatRoomId: string;
  senderId: string;
  senderName?: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  messageType: 'TEXT' | 'SYSTEM';
}

export interface ChatRoom {
  id: string;
  rideId: string;
  driverUserId: string;
  passengerUserId: string;
  createdAt: string;
  isActive: boolean;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService {
  private stompClient: Client | null = null;
  private apiUrl = `${environment.backendUrl}/api/v1/chats`;
  private wsUrl = `${environment.backendUrl}/ws`;

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private typingSubject = new BehaviorSubject<TypingIndicator | null>(null);
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  public messages$ = this.messagesSubject.asObservable();
  public typing$ = this.typingSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  private currentRideId: string | null = null;
  private currentUserId: string | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Initializes WebSocket connection
   */
  connect(): void {
    if (this.stompClient?.connected) {
      console.log('Already connected to WebSocket');
      return;
    }

    const socket = new SockJS(this.wsUrl);
    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      }
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      this.connectionStatusSubject.next(true);
    };

    this.stompClient.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      this.connectionStatusSubject.next(false);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      this.connectionStatusSubject.next(false);
    };

    this.stompClient.activate();
  }

  /**
   * Disconnects from WebSocket
   */
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.connectionStatusSubject.next(false);
    }
  }

  /**
   * Creates or gets a chat room for a ride
   */
  getChatRoomByRide(rideId: string): Observable<ChatRoom> {
    const headers = this.getAuthHeaders();
    return this.http.get<ChatRoom>(`${this.apiUrl}/rooms/ride/${rideId}`, { headers });
  }

  /**
   * Creates a new chat room
   */
  createChatRoom(rideId: string, driverUserId: string, passengerUserId: string): Observable<ChatRoom> {
    const headers = this.getAuthHeaders();
    return this.http.post<ChatRoom>(
      `${this.apiUrl}/rooms?rideId=${rideId}&driverUserId=${driverUserId}&passengerUserId=${passengerUserId}`,
      {},
      { headers }
    );
  }

  /**
   * Joins a chat room and subscribes to messages
   */
  joinChatRoom(rideId: string, userId: string): void {
    if (!this.stompClient?.connected) {
      console.error('WebSocket not connected. Call connect() first.');
      return;
    }

    this.currentRideId = rideId;
    this.currentUserId = userId;

    // Subscribe to chat messages for this ride
    this.stompClient.subscribe(`/topic/chat/${rideId}`, (message: IMessage) => {
      const chatMessage: ChatMessage = JSON.parse(message.body);
      this.addMessage(chatMessage);
    });

    // Subscribe to typing indicators
    this.stompClient.subscribe(`/topic/chat/${rideId}/typing`, (message: IMessage) => {
      const indicator: TypingIndicator = JSON.parse(message.body);
      if (indicator.userId !== userId) {
        this.typingSubject.next(indicator);
      }
    });

    // Subscribe to message status updates
    this.stompClient.subscribe(`/topic/chat/${rideId}/status`, (message: IMessage) => {
      const statusUpdate = JSON.parse(message.body);
      this.updateMessageStatus(statusUpdate.messageId, statusUpdate.status);
    });

    // Subscribe to error messages
    this.stompClient.subscribe(`/topic/chat/${rideId}/error`, (message: IMessage) => {
      console.error('Chat error:', message.body);
    });

    // Subscribe to personal notifications
    this.stompClient.subscribe(`/user/${userId}/queue/notifications`, (message: IMessage) => {
      const notification: ChatMessage = JSON.parse(message.body);
      console.log('New message notification:', notification);
    });

    // Load message history
    this.loadMessageHistory(rideId);
  }

  /**
   * Leaves the current chat room
   */
  leaveChatRoom(): void {
    this.currentRideId = null;
    this.currentUserId = null;
    this.messagesSubject.next([]);
    this.typingSubject.next(null);
  }

  /**
   * Sends a message to the current chat room
   */
  sendMessage(senderId: string, senderName: string, receiverId: string, content: string): void {
    if (!this.stompClient?.connected || !this.currentRideId) {
      console.error('Cannot send message: not connected or no active chat room');
      return;
    }

    const message = {
      senderId,
      senderName,
      receiverId,
      content,
      messageType: 'TEXT'
    };

    this.stompClient.publish({
      destination: `/app/chat/${this.currentRideId}/send`,
      body: JSON.stringify(message)
    });
  }

  /**
   * Sends typing indicator
   */
  sendTypingIndicator(userId: string, isTyping: boolean): void {
    if (!this.stompClient?.connected || !this.currentRideId) {
      return;
    }

    const indicator: TypingIndicator = { userId, isTyping };

    this.stompClient.publish({
      destination: `/app/chat/${this.currentRideId}/typing`,
      body: JSON.stringify(indicator)
    });
  }

  /**
   * Marks a message as read
   */
  markMessageAsRead(messageId: string): void {
    if (!this.stompClient?.connected || !this.currentRideId) {
      return;
    }

    this.stompClient.publish({
      destination: `/app/chat/${this.currentRideId}/read`,
      body: messageId
    });
  }

  /**
   * Loads message history from REST API
   */
  private loadMessageHistory(rideId: string): void {
    const headers = this.getAuthHeaders();

    this.getChatRoomByRide(rideId).subscribe({
      next: (chatRoom) => {
        this.http.get<ChatMessage[]>(
          `${this.apiUrl}/rooms/${chatRoom.id}/messages?page=0&size=100`,
          { headers }
        ).subscribe({
          next: (messages) => {
            this.messagesSubject.next(messages);
          },
          error: (error) => {
            console.error('Error loading message history:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error getting chat room:', error);
      }
    });
  }

  /**
   * Adds a new message to the message list
   */
  private addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    const exists = currentMessages.some(m => m.id === message.id);

    if (!exists) {
      this.messagesSubject.next([...currentMessages, message]);
    }
  }

  /**
   * Updates the status of a message
   */
  private updateMessageStatus(messageId: string, status: string): void {
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = currentMessages.map(msg =>
      msg.id === messageId ? { ...msg, status: status as any } : msg
    );
    this.messagesSubject.next(updatedMessages);
  }

  /**
   * Gets unread message count for a user
   */
  getUnreadMessageCount(userId: string): Observable<number> {
    const headers = this.getAuthHeaders();
    return this.http.get<number>(`${this.apiUrl}/messages/unread/count?userId=${userId}`, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }
}
