import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  caretDownOutline,
  caretUpOutline,
  chatboxEllipsesOutline,
  chatboxOutline,
  chatbubblesOutline,
  checkboxOutline,
  checkmarkCircle,
  documentOutline,
  homeOutline,
  listOutline,
  logOutOutline,
  radioButtonOff,
  searchOutline,
} from 'ionicons/icons';
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
  providers: [ModalController],
})
export class AppComponent {
  isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

  menu = viewChild(IonMenu);

  readonly appStore = inject(AppStore);

  homeUrl = computed(() => {
    return this.appStore.user()?.appHomeUrl
      ? [this.appStore.user()?.appHomeUrl]
      : ['/private-routes/visitas/visitas'];
  });

  constructor(private cdr: ChangeDetectorRef, private router: Router) {
    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );
    this.isDarkTheme = darkModeMediaQuery.matches;
    darkModeMediaQuery.addEventListener('change', (event) => {
      this.isDarkTheme = event.matches;
      this.cdr.detectChanges();
    });
    addIcons({
      homeOutline,
      logOutOutline,
      searchOutline,
      chatboxEllipsesOutline,
      chatboxOutline,
      chatbubblesOutline,
      listOutline,
      documentOutline,
      addOutline,
      checkboxOutline,
      caretDownOutline,
      caretUpOutline,
      radioButtonOff,
      checkmarkCircle,
    });
  }

  user = this.appStore.user;

  logout() {
    this.appStore.logout();
    this.router.navigate(['/login']);
  }

  closeMenu() {
    console.log('closeMenu');
    this.menu()?.close();
  }
}
