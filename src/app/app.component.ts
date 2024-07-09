import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Renderer2 } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  heartOutline,
  heartSharp,
  archiveOutline,
  archiveSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
  bookmarkOutline,
  bookmarkSharp,
} from 'ionicons/icons';
import { FeathersClientService } from './services/feathers/feathers-service.service';
import { environment } from 'src/environments/environment';
import { AppStore } from './signalStores/stores/appStore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
  ],
})
export class AppComponent {
  appStore = inject(AppStore);
  public appPages = [
    { title: 'Maestros', url: '/maestros', icon: 'bookmark' },
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private renderer: Renderer2) {
    addIcons({
      mailOutline,
      mailSharp,
      paperPlaneOutline,
      paperPlaneSharp,
      heartOutline,
      heartSharp,
      archiveOutline,
      archiveSharp,
      trashOutline,
      trashSharp,
      warningOutline,
      warningSharp,
      bookmarkOutline,
      bookmarkSharp,
    });
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    this.applyTheme(darkThemeMq.matches);

    darkThemeMq.addEventListener('change', (e) => {
      this.applyTheme(e.matches);
    });
  }

  applyTheme(isDark: boolean) {
    const themeLinkId = 'syncfusion-theme';
    let link = document.getElementById(themeLinkId) as HTMLLinkElement;

    if (!link) {
      link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'stylesheet');
      this.renderer.setAttribute(link, 'id', themeLinkId);
      this.renderer.appendChild(document.head, link);
    }

    const href = isDark
      ? 'assets/styles/material-dark.css'
      : 'assets/styles/material.css';

    this.renderer.setAttribute(link, 'href', href);
  }

  loadStyle(href: string) {
    let link = document.getElementById('syncfusion-theme') as HTMLLinkElement;
    if (link) {
      link.href = href;
    } else {
      link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'stylesheet');
      this.renderer.setAttribute(link, 'id', 'syncfusion-theme');
      this.renderer.setAttribute(link, 'href', href);
      this.renderer.appendChild(document.head, link);
    }
  }
}
