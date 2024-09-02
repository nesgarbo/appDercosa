import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { addEntity, withEntities } from '@ngrx/signals/entities';
import {
  ClientTest,
  ClientTestData,
  ClientTestPatch,
  ClientTestQuery,
} from 'feathers-dercosa';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';
import { ClientsStore } from './clientsStore';

export const ClientTestsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('client-tests'),
  withEntities<ClientTest>(),
  withFeathersDataService<
    'client-tests',
    ClientTest,
    ClientTestData,
    ClientTestQuery,
    ClientTestPatch
  >({ servicePath: 'client-tests' }),
  withMethods((store, clientsStore = inject(ClientsStore)) => ({
    addEntityToCache(clientTest: ClientTest) {
      if (clientTest.client) {
        patchState(clientsStore, addEntity(clientTest.client));
      }
    },
  })),
  withHooks(({ startEmitting, find }) => {
    return {
      onInit() {
        startEmitting();
        find();
      },
    };
  })
);
