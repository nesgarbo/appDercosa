import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'create',
        loadComponent: () =>
          import('./create/create.page').then((m) => m.CreatePage),
      },
      {
        path: 'today',
        loadComponent: () =>
          import('./today/today.page').then((m) => m.TodayPage),
      },
      {
        path: 'historic',
        loadComponent: () =>
          import('./historic/historic.page').then((m) => m.HistoricPage),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./chat/chat.component').then((m) => m.ChatComponent),
      },
      {
        path: '',
        redirectTo: '/tabs/today',
        pathMatch: 'full',
      },
    ],
  },
];
