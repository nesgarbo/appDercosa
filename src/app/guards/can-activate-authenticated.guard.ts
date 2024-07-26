import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStore } from '../signalStores/stores/appStore';
import { FeathersClientService } from '../services/feathers/feathers-service.service';

export const canActivateAuthenticatedGuard: CanActivateFn = (route, state) => {
  const appStore = inject(AppStore);
  const router = inject(Router);
  const feathers = inject(FeathersClientService);

  if (appStore.isLoggedIn() && feathers.authenticated) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: {
      returnUrl: state.url,
    },
  });
};
