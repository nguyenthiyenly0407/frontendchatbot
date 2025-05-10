// src/app/chat/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatResponse {
  id: number;
  question: string;
  label: string;
  language: string;
  context: string;
  answer: string;
  start_char: number;
  end_char: number;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private baseUrl = 'http://127.0.0.1:3000/chat';

  constructor(private http: HttpClient) {}

  askQuestion(question: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.baseUrl, { question });
  }

  getAnswerById(id: number): Observable<{ answer: string }> {
    return this.http.get<{ answer: string }>(`${this.baseUrl}/${id}`);
  }
  getAll(): Observable<ChatResponse[]> {
    return this.http.get<ChatResponse[]>(this.baseUrl);
  }
}
