import { isPlatformBrowser } from '@angular/common';
import { inject, isSignal, PLATFORM_ID } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export const withLocalStorageSync = (storageKey: string) =>
  signalStoreFeature(
    withState({}),
    withMethods((state) => {
      const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
      return {
        saveToLocalStorage(slice?: Record<string, unknown>) {
          console.log('slice', slice);
          const stateValue: Record<string, unknown> = {};
          for (const key in slice || (state as Record<string, unknown>)) {
            const sliceSignal = (<Record<string, unknown>>state)[key];
            if (isSignal(sliceSignal)) {
              stateValue[key] = sliceSignal();
            }
          }

          window.localStorage.setItem(storageKey, JSON.stringify(stateValue));
        },
        loadFromLocalStorage(): boolean {
          if (!isBrowser) {
            return false;
          }
          const stateValue = window.localStorage.getItem(storageKey);
          if (!stateValue) {
            return false;
          }
          patchState(state, JSON.parse(stateValue));
          return true;
        },
      };
    })
  );
