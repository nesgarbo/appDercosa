import {
  patchState,
  signalStore,
  withMethods,
} from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { withHooks } from '@ngrx/signals';
import { Codestados } from 'dercosa';
import { inject } from '@angular/core';
import { FeathersClientService } from '../services/feathers/feathers-service.service';

export const CodEstadosStore = signalStore(
  { providedIn: 'root' },
  withDevtools('codEstados'),
  withEntities<Codestados>(),
  withMethods((store) => ({
    async setCodEstados(
        codEstados: Codestados[],
      ) {
        codEstados.sort((a, b) => a.DESESTA.localeCompare(b.DESESTA));
        patchState(store, setAllEntities(codEstados, { idKey: 'CODIESTA' }));
      },
  })),
  withHooks(({setCodEstados}) => {
    const feathers = inject(FeathersClientService)
    async function fetchAndSetCodEstados() {
        const codEstados = await feathers.getCodEstados();
        setCodEstados(codEstados);
      }
    return {
      onInit() {
        fetchAndSetCodEstados();
      },
    };
  }),
);
