import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from "../models/chat-message";
import SockJS from "sockjs-client";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  private apiUrl = 'https://gouniprojectdeploy-production.up.railway.app'; // URL base del backend

  constructor(private httpClient: HttpClient) {
    this.initConnectionSocket();
  }

  initConnectionSocket() {
    const socket = new SockJS(`${this.apiUrl}/chat-socket`);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      console.log("Conectado al WebSocket");
    }, (error: Error) => {
      console.error("Error en la conexión WebSocket:", error);
    });
  }

  joinRoom(roomId: string) {
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/topic/${roomId}`, (message: any) => {
        const messageContent: ChatMessage = JSON.parse(message.body);
        const currentMessages = this.messageSubject.getValue();
        currentMessages.push(messageContent);
        this.messageSubject.next(currentMessages);
      });
    });

    this.loadMessages(roomId);
  }

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
    } else {
      console.error('WebSocket no está conectado');
    }
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }

  loadMessages(roomId: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer YOUR_TOKEN_HERE`);
    this.httpClient.get<ChatMessage[]>(`${this.apiUrl}/api/chat/messages`, { headers }).subscribe({
      next: (chatMessages: ChatMessage[]) => {
        this.messageSubject.next(chatMessages);
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      }
    });
  }
}
