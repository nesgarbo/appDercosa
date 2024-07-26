import { APP_INITIALIZER, enableProdMode, importProvidersFrom, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideStore } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { FeathersClientService } from './app/services/feathers/feathers-service.service';
import { AppStore } from './app/signalStores/stores/appStore';
import { Ability, PureAbility } from '@casl/ability';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideStore(),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
          defaultLanguage: 'es',
          loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient],
          },
      })
  ),
  {
      // App don't bootstrap until this async code is completed.
      // We need this to avoid the route guards to be executed until
      // the necessary services that condition the navigation are initialized.
      // https://juristr.com/blog/2018/01/ng-app-runtime-config/#runtime-configuration
      // https://devblogs.microsoft.com/premier-developer/angular-how-to-editable-config-files/
      provide: APP_INITIALIZER,
      useFactory: (feathersService: FeathersClientService) => {
          const appStore = inject(AppStore);
          return async () => {
              feathersService.ioOn('connect', () => {
                  appStore.connected();
              });
              feathersService.feathersOn('login', (authResult) => {
                  const { user } = authResult;
                  appStore.setUser(user);
                  appStore.setAccessToken(authResult.accessToken);
              });
              feathersService.ioOn('disconnect', (reason) => {
                  appStore.removeUser();
              });
              await feathersService.start();
          };
      },
      deps: [FeathersClientService],
      multi: true,
  },
  { provide: Ability, useValue: new Ability() },
  { provide: PureAbility, useExisting: Ability },
    provideLottieOptions({ player: () => player }),
    provideCacheableAnimationLoader(),
],
});

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/app/', '.json');
}