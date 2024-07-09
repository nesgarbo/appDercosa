import { signalStore } from '@ngrx/signals';
import { withFeathersAuth } from '../features/with-feathers-auth';
import { withFeathersSocket } from '../features/with-feathers-socket';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withAppLanguage } from '../features/with-app-language';

export const AppStore = signalStore(
  { providedIn: 'root' },
  withDevtools('app'),
  withFeathersAuth(),
  withFeathersSocket(),
  withAppLanguage(),
);