import {
    patchState,
    signalStoreFeature,
    withMethods,
    withState,
  } from '@ngrx/signals';
  import { PartialStateUpdater } from '@ngrx/signals';
  
  export type SocketState = { socketConnected: boolean };
  
  export const setConnected = (
    socketConnected: boolean
  ): PartialStateUpdater<SocketState> => {
    return state => {
      return { ...state, socketConnected };
    };
  };
  
  export function withFeathersSocket() {
    return signalStoreFeature(
      withState<SocketState>({ socketConnected: false }),
      withMethods(store => {
        return {
          connected() {
            patchState(store, setConnected(true));
          },
          disconnected() {
            patchState(store, setConnected(false));
          },
        };
      })
    );
  }