import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Ability } from '@casl/ability';
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { AppStore } from 'src/app/signalStores/stores/appStore';
import { MenuItemsComponent } from '../menu-items/menu-items.component';

export type MenuItems = {
  header: string;
  items: {
    icon: string;
    label: string;
    routerLink?: string;
  }[];
};

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    IonLabel,
    IonIcon,
    IonItem,
    IonListHeader,
    IonList,
    IonMenuToggle,
    MenuItemsComponent,
    IonMenu,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  /**
   * Ability instance to manage permissions.
   * @type {Ability}
   */
  private ability = inject(Ability);

  appStore = inject(AppStore);
  router = inject(Router);
  menuItems = computed<MenuItems[]>(() => {
    const user = this.appStore.user();
    const homeUrl = user?.appHomeUrl ? user.appHomeUrl : '/private-routes/visitas/visitas';
    const res: MenuItems[] = [
      {
        header: 'Menu Principal',
        items: [
          { icon: 'home-outline', label: 'Inicio', routerLink: homeUrl },
          {
            icon: 'log-out-outline',
            label: 'Salir',
          },
        ],
      },
    ];
    if (this.ability.can('manage', 'tests')) {
      res.push({
        header: 'Tests',
        items: [
          {
            icon: 'today-outline',
            label: 'Agenda Results',
            routerLink: '/private-routes/calidad/agenda-results',
          },
          {
            icon: 'checkbox-outline',
            label: 'Test Results',
            routerLink: '/private-routes/calidad/test-results',
          },
          {
            icon: 'flask-outline',
            label: 'Client Tests',
            routerLink: '/private-routes/calidad/client-tests',
          },
          {
            icon: 'beaker-outline',
            label: 'Tests',
            routerLink: '/private-routes/calidad/tests',
          },
        ],
      });
    }
    if (this.ability.can('manage', 'weavy')) {
      res.push({
        header: 'Weavy',
        items: [
          {
            icon: 'chatbubbles-outline',
            label: 'Chat',
            routerLink: '/private-routes/weavy/chat',
          },
          {
            icon: 'document-outline',
            label: 'Files',
            routerLink: '/private-routes/weavy/files',
          },
          {
            icon: 'chatbox-outline',
            label: 'Posts',
            routerLink: '/private-routes/weavy/posts',
          },
          {
            icon: 'list-outline',
            label: 'Tasks',
            routerLink: '/private-routes/weavy/tasks',
          },
          {
            icon: 'chatbox-ellipses-outline',
            label: 'Comments',
            routerLink: '/private-routes/weavy/comments',
          },
          {
            icon: 'search-outline',
            label: 'Search',
            routerLink: '/private-routes/weavy/search',
          },
        ],
      });
    }
    return res;
  });

  logoutIfClicked(e: string) {
    if (e === 'log-out-outline') {
      this.appStore.logout();
      this.router.navigate(['/login']);
    }
  }
}
