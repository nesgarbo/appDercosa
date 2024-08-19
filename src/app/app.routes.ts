import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { canActivateAuthenticatedGuard } from './guards/can-activate-authenticated.guard';
import { homeRedirectGuard } from './guards/home-redirect.guard';
import { ManagerGuard } from './guards/manager.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/common/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'private-routes',
    children: [
      {
        path: 'visitas',
        component: TabsPage,
        loadChildren: () =>
          import('./pages/signatureApp/visitas.routes').then((m) => m.default),
        canActivate: [ManagerGuard],
        data: { manage: 'visita' },
      },
      {
        path: 'calidad',
        component: TabsPage,
        loadChildren: () =>
          import('./pages/calidadApp/calidad.routes').then((m) => m.default),
        canActivate: [ManagerGuard],
        data: { manage: 'calidad' },
      },
      {
        path: 'estados',
        loadComponent: () =>
          import('./pages/estadosApp/estado/estado.component').then(
            (m) => m.EstadoComponent
          ),
        canActivate: [ManagerGuard],
        data: { manage: 'estado' },
      },
      {
        path: 'weavy',
        loadChildren: () =>
          import('./pages/common/weavy/weavy.routes').then((m) => m.default),
      },
    ],
    canActivateChild: [canActivateAuthenticatedGuard],
  },
  {
    path: 'messages',
    loadChildren: () =>
      import('./pages/common/messages/message.routes').then((m) => m.default),
  },
  {
    path: '',
    canActivate: [homeRedirectGuard],
    loadChildren: () => import('./pages/common/messages/message.routes'),
    pathMatch: 'full',
  },
];
