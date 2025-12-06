import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { ChatWebSocketService, ChatMessage, TypingIndicator } from '../../services/chat-websocket.service';
import { Subscription } from 'rxjs';
import {ToolbarComponent} from "../../../home/components/toolbar/toolbar.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    ToolbarComponent
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() rideId!: string;
  @Input() currentUserId!: string;
  @Input() currentUserName!: string;
  @Input() otherUserId!: string;
  @Input() otherUserName!: string;

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage: string = '';
  isConnected: boolean = false;
  isLoading: boolean = true;
  isTyping: boolean = false;
  otherUserTyping: boolean = false;

  private subscriptions: Subscription[] = [];
  private typingTimeout: any;
  private shouldScrollToBottom: boolean = false;

  constructor(private chatService: ChatWebSocketService) {}

  ngOnInit(): void {
    this.initializeChat();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.chatService.leaveChatRoom();
  }

  private initializeChat(): void {
    // Subscribe to connection status
    this.subscriptions.push(
      this.chatService.connectionStatus$.subscribe(status => {
        this.isConnected = status;
        if (status) {
          this.joinChat();
        }
      })
    );

    // Subscribe to messages
    this.subscriptions.push(
      this.chatService.messages$.subscribe(messages => {
        this.messages = messages.sort((a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        this.isLoading = false;
        this.shouldScrollToBottom = true;
      })
    );

    // Subscribe to typing indicators
    this.subscriptions.push(
      this.chatService.typing$.subscribe(indicator => {
        if (indicator && indicator.userId === this.otherUserId) {
          this.otherUserTyping = indicator.isTyping;
        }
      })
    );

    // Connect to WebSocket
    this.chatService.connect();
  }

  private joinChat(): void {
    this.chatService.joinChatRoom(this.rideId, this.currentUserId);
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.isConnected) {
      return;
    }

    this.chatService.sendMessage(
      this.currentUserId,
      this.currentUserName,
      this.otherUserId,
      this.newMessage.trim()
    );

    this.newMessage = '';
    this.stopTyping();
  }

  onTyping(): void {
    if (!this.isTyping) {
      this.isTyping = true;
      this.chatService.sendTypingIndicator(this.currentUserId, true);
    }

    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.stopTyping();
    }, 2000);
  }

  private stopTyping(): void {
    if (this.isTyping) {
      this.isTyping = false;
      this.chatService.sendTypingIndicator(this.currentUserId, false);
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  isMyMessage(message: ChatMessage): boolean {
    return message.senderId === this.currentUserId;
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getMessageStatusIcon(status: string): string {
    switch (status) {
      case 'SENT': return 'check';
      case 'DELIVERED': return 'done_all';
      case 'READ': return 'done_all';
      default: return 'schedule';
    }
  }

  getMessageStatusClass(status: string): string {
    return status === 'READ' ? 'read' : 'unread';
  }
}
