// import { Component } from '@angular/core';

// interface Message {
//   text: string;
//   fromUser: boolean;
// }

// interface Session {
//   id: number;
//   title: string;
//   messages: Message[];
// }

// @Component({
//   selector: 'app-chat',
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.css']
// })
// export class ChatComponent {
//   sessions: Session[] = [];
//   selectedSession!: Session;
//   nextId = 1;
//   newMsg = '';

//   constructor() {
//     this.newChat();  // tạo session đầu tiên
//   }

//   // Tạo 1 chat mới
//   newChat() {
//     const s: Session = {
//       id: this.nextId,
//       title: `Session ${this.nextId}`,
//       messages: [
//         { text: 'Xin chào! Tôi có thể giúp gì cho bạn?', fromUser: false }
//       ]
//     };
//     this.nextId++;
//     this.sessions.unshift(s);
//     this.selectSession(s);
//   }

//   // Chọn session (mở chat tương ứng)
//   selectSession(s: Session) {
//     this.selectedSession = s;
//   }

//   // Gửi tin nhắn
//   sendMessage() {
//     const text = this.newMsg.trim();
//     if (!text) return;
//     this.selectedSession.messages.push({ text, fromUser: true });
//     this.newMsg = '';

//     // Giả lập bot trả lời
//     setTimeout(() => {
//       this.selectedSession.messages.push({
//         text: 'Đây là câu trả lời mô phỏng từ bot.',
//         fromUser: false
//       });
//       this.scrollToBottom();
//     }, 500);

//     this.scrollToBottom();
//   }

//   // scroll chat xuống cuối
//   scrollToBottom() {
//     setTimeout(() => {
//       const c = document.querySelector('.chat-window');
//       if (c) c.scrollTop = c.scrollHeight;
//     }, 100);
//   }
// }
// src/app/chat/chat.component.ts
// import { Component } from '@angular/core';
// import { ChatService, ChatResponse } from './chat.service';

// interface Message {
//   id?: number;
//   text: string;
//   fromUser: boolean;
// }

// interface Session {
//   id: number;
//   title: string;
//   messages: Message[];
// }

// @Component({
//   selector: 'app-chat',
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.css']
// })
// export class ChatComponent {
//   sessions: Session[] = [];
//   selectedSession!: Session;
//   nextId = 1;
//   newMsg = '';
//   loading = false;

//   constructor(private chatService: ChatService) {
//     this.newChat();
//   }

//   newChat() {
//     const s: Session = {
//       id: this.nextId,
//       title: `Session ${this.nextId}`,
//       messages: [
//         { text: 'Xin chào! Tôi có thể giúp gì cho bạn?', fromUser: false }
//       ]
//     };
//     this.nextId++;
//     this.sessions.unshift(s);
//     this.selectSession(s);
//   }

//   selectSession(s: Session) {
//     this.selectedSession = s;
//     this.newMsg = '';
//   }

//   sendMessage() {
//     const text = this.newMsg.trim();
//     if (!text || this.loading) return;

//     // 1) Hiển thị ngay message của user
//     this.selectedSession.messages.push({ text, fromUser: true });
//     this.newMsg = '';
//     this.loading = true;

//     // 2) Gọi POST /chat để tạo bản ghi và lấy id
//     this.chatService.askQuestion(text).subscribe({
//       next: (resp: ChatResponse) => {
//         const recordId = resp.id;

//         // 3) Ngay lập tức call GET /chat/:id để fetch lại answer
//         this.chatService.getAnswerById(recordId).subscribe({
//           next: ({ answer }) => {
//             this.selectedSession.messages.push({
//               id: recordId,
//               text: answer,
//               fromUser: false
//             });
//             this.scrollToBottom();
//             this.loading = false;
//           },
//           error: () => {
//             // fallback nếu GET lỗi
//             this.selectedSession.messages.push({
//               id: recordId,
//               text: resp.answer, // vẫn có thể dùng answer từ POST
//               fromUser: false
//             });
//             this.scrollToBottom();
//             this.loading = false;
//           }
//         });
//       },
//       error: () => {
//         this.selectedSession.messages.push({
//           text: 'Có lỗi khi gọi POST, thử lại sau.',
//           fromUser: false
//         });
//         this.loading = false;
//         this.scrollToBottom();
//       }
//     });
//   }

//   private scrollToBottom() {
//     setTimeout(() => {
//       const c = document.querySelector('.chat-window');
//       if (c) { c.scrollTop = c.scrollHeight; }
//     }, 100);
//   }
// }
// src/app/chat/chat.component.ts
// src/app/chat/chat.component.ts
import { Component, OnInit } from '@angular/core';
import { ChatService, ChatResponse } from './chat.service';

interface Message {
  text: string;
  fromUser: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  newMsg = '';
  loading = false;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Khi load component, fetch toàn bộ lịch sử
    this.chatService.getAll().subscribe(history => {
      // mỗi record → 2 message: user & bot
      this.messages = history.flatMap(rec => [
        { text: rec.question, fromUser: true },
        { text: rec.answer,   fromUser: false }
      ]);
      this.scrollToBottom();
    });
  }

  sendMessage() {
    const text = this.newMsg.trim();
    if (!text || this.loading) return;

    // hiển thị ngay message user
    this.messages.push({ text, fromUser: true });
    this.newMsg = '';
    this.loading = true;

    // POST /chat
    this.chatService.askQuestion(text).subscribe({
      next: (resp: ChatResponse) => {
        // hiển thị answer ngay
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
    }, 100);
  }
}

