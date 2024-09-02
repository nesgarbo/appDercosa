import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore } from '@ngrx/signals';
import { withAppLanguage } from '../features/with-app-language';
import { withFeathersAuth } from '../features/with-feathers-auth';
import { withFeathersSocket } from '../features/with-feathers-socket';

export const AppStore = signalStore(
  { providedIn: 'root' },
  withDevtools('app'),
  withFeathersAuth(),
  withFeathersSocket(),
  withAppLanguage()
);
