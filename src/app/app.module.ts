import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatWidgetComponent } from './chat-widget/chat-widget.component';
@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatWidgetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
