import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStore } from '../signalStores/stores/appStore';
import { FeathersClientService } from '../services/feathers/feathers-service.service';

export const homeRedirectGuard: CanActivateFn = (state) => {
  const appStore = inject(AppStore);
  const router = inject(Router);
  const feathers = inject(FeathersClientService);

  if (appStore.isLoggedIn() && feathers.authenticated) {
    const appHomeUrl = appStore.user()!.appHomeUrl;
    if (appHomeUrl) {
      console.log('appHomeUrl', appHomeUrl);
      return router.createUrlTree([appHomeUrl]);
    } else {
      return router.createUrlTree(['/messages/unauthorized']);
    }
  }

  return router.createUrlTree(['/login'], {
    queryParams: {
      returnUrl: state.url,
    },
  });
};
