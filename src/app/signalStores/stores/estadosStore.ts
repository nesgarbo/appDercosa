import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  signalStore,
  withComputed
} from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import {
  Estado,
  EstadoData,
  EstadoPatch,
  EstadoQuery
} from 'feathers-dercosa';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';

export type EstadosState = {
  selectedIds: Record<number, boolean>;
};

export type AditionalData = {
  pedidolin?: number;
  estado7?: string;
  efecesta?: string;
  ecomenta?: string;
};

export type PedidolinRecord = Record<number, AditionalData>;

export const EstadosStore = signalStore(
  { providedIn: 'root' },
  withDevtools('estado'),
  withEntities<Estado>(),
  withFeathersDataService<
    'estado',
    Estado,
    EstadoData,
    EstadoQuery,
    EstadoPatch
  >({ servicePath: 'estado' }),
  withComputed((store) => ({
    sumPiezas: computed(() =>
      store.selectedEntities().reduce((acc, estado) => acc + estado.epiezas, 0)
    ),
    sumCantidad: computed(() =>
      store.selectedEntities().reduce((acc, estado) => acc + estado.ecant, 0)
    ),
    allSelected: computed(() => {
      const selectedIds = store.selectedIds();
      const allIds = store.ids();
      return allIds.every((id) => selectedIds.includes(id.toString()));
    }),
  }))
);
