import { Component } from '@angular/core';

interface Message {
  text: string;
  fromUser: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: Message[] = [
    { text: 'Xin chào! Tôi có thể giúp gì cho bạn?', fromUser: false },
    // ...
  ];

  newMsg = '';

  sendMessage() {
    const text = this.newMsg.trim();
    if (!text) return;
    this.messages.push({ text, fromUser: true });
    this.newMsg = '';

    // Giả lập bot trả lời
    setTimeout(() => {
      this.messages.push({
        text: 'Đây là câu trả lời mô phỏng từ bot.',
        fromUser: false
      });
      this.scrollToBottom();
    }, 600);
    
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.chat-window');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}
