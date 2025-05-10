import { Component, OnInit } from '@angular/core';
import { ChatService, ChatResponse } from '../chat/chat.service';

interface Message {
  text: string;
  fromUser: boolean;
}

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent implements OnInit {
  showChat = false;
  messages: Message[] = [];
  newMsg = '';
  loading = false;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Khi component khởi tạo (nếu muốn auto-load lịch sử)
    this.loadHistory();
  }

  toggleChat() {
    this.showChat = !this.showChat;
    if (this.showChat && this.messages.length === 0) {
      this.loadHistory();
    }
  }

  private loadHistory() {
    this.chatService.getAll().subscribe(history => {
      this.messages = history.flatMap(r => [
        { text: r.question, fromUser: true },
        { text: r.answer,   fromUser: false }
      ]);
      this.scrollToBottom();
    });
  }

  sendMessage() {
    const txt = this.newMsg.trim();
    if (!txt || this.loading) return;

    this.messages.push({ text: txt, fromUser: true });
    this.newMsg = '';
    this.loading = true;

    this.chatService.askQuestion(txt).subscribe({
      next: resp => {
        this.messages.push({ text: resp.answer, fromUser: false });
        this.scrollToBottom();
        this.loading = false;
      },
      error: () => {
        this.messages.push({ text: 'Có lỗi, thử lại sau.', fromUser: false });
        this.scrollToBottom();
        this.loading = false;
      }
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      const c = document.querySelector('.chat-window');
      if (c) c.scrollTop = c.scrollHeight;
    }, 50);
  }
}
