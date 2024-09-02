import { withCallState } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import {
  PartialStateUpdater,
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'feathers-dercosa';
import { derivedFrom } from 'ngxtension/derived-from';
import { map, pipe, startWith } from 'rxjs';
import {
  FeathersClientService,
  LoginCredentials,
} from 'src/app/services/feathers/feathers-service.service';

export type UserWithBackgroundURL = User & { backgroundUrl?: string };

export type AuthState = {
  user: UserWithBackgroundURL | undefined;
  accessToken: string | undefined;
};

const initialAuthState: AuthState = { user: undefined, accessToken: undefined };

export const setUser = (
  user: UserWithBackgroundURL
): PartialStateUpdater<AuthState> => {
  return (state) => {
    return { ...state, user };
  };
};

export const setAccessToken = (
  accessToken: string
): PartialStateUpdater<AuthState> => {
  return (state) => {
    return { ...state, accessToken };
  };
};

export const removeUser = (): PartialStateUpdater<AuthState> => {
  return (state) => {
    return { ...state, user: undefined };
  };
};

export const removeAccessToken = (): PartialStateUpdater<AuthState> => {
  return (state) => {
    return { ...state, accessToken: undefined };
  };
};

export function withFeathersAuth() {
  return signalStoreFeature(
    withState<AuthState>(initialAuthState),
    withCallState({ collection: 'auth' }),
    withComputed(({ user }, translate = inject(TranslateService)) => {
      const displayUser = derivedFrom(
        [translate.onLangChange.asObservable().pipe(startWith('es')), user],
        pipe(
          map(([_, user]) => ({
            displayUserName: user?.name || translate.instant('ANONYMOUS_USER'),
            displayUserRoles:
              user?.rolesData?.map((rol) => rol.nombre).join(', ') ||
              translate.instant('VISITOR'),
            displayAvatar:
              user?.backgroundUrl || 'assets/images/avatar-placeholder.png',
          }))
        )
      );
      return {
        isLoggedIn: computed(() => !!user()),
        avatarURL: computed(() => displayUser().displayAvatar),
        displayUserName: computed(() => displayUser().displayUserName),
        displayUserRoles: computed(() => displayUser().displayUserRoles),
        tenantId: computed(() => user()?.tenantId),
        tenantName: computed(() => user()?.tenant?.nombre),
      };
    }),
    withMethods((store, feathers = inject(FeathersClientService)) => {
      return {
        async login(credentials: LoginCredentials) {
          // store not patched because we call setUser in the feathers authentication events
          return await feathers.authentication.authenticate({
            ...credentials,
            strategy: 'local',
          });
        },
        async logout() {
          patchState(store, removeUser(), removeAccessToken());
          return await feathers.authentication.logout();
        },
        async reAuthenticate() {
          // store not patched because we call setUser in the feathers authentication events
          return await feathers.authentication.reAuthenticate();
        },
        setUser(user: User) {
          patchState(store, setUser(user));
        },
        removeUser() {
          patchState(store, removeUser());
        },
        setAccessToken(accessToken: string) {
          patchState(store, setAccessToken(accessToken));
        },
      };
    })
  );
}
