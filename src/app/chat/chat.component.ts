import { Component, OnInit, ElementRef, ViewChild, viewChild } from '@angular/core';
import { WeavyService } from '../services/weavy/weavy.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatContainer = viewChild<ElementRef>('chatContainer')

  constructor(private weavyService: WeavyService) {}

  async ngOnInit() {
    const userId = 1; // ID del usuario actual
    const token = await this.weavyService.getChatToken(userId);

    if (token) {
      await this.weavyService.initializeWeavy(token, { key: 'chat-space', name: 'Chat Space' });
      this.weavyService.loadChatComponent(this.chatContainer()!);
    } else {
      console.error('Failed to initialize chat');
    }
  }
}