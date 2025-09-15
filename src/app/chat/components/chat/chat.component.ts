import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ToolbarComponent} from "../../../home/components/toolbar/toolbar.component";
import {NgClass, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ChatService} from "../../services/chat.service";
import {ChatMessage} from "../../models/chat-message";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [
    ToolbarComponent,
    NgClass,
    NgForOf,
    FormsModule
  ],
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messageInput: string = '';
  userId: string = "";
  messageList: any[] = [];

  constructor(private chatService: ChatService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params["userId"];
    this.chatService.joinRoom("default-room");
    this.listenForMessages();
  }

  sendMessage() {
    const chatMessage = { message: this.messageInput, user: this.userId } as ChatMessage;
    this.chatService.sendMessage("default-room", chatMessage);
    this.messageInput = '';
  }

  listenForMessages() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {
      this.messageList = messages.map((item: any) => ({
        ...item,
        message_side: item.user === this.userId ? 'sender' : 'receiver'
      }));
    });
  }
}
