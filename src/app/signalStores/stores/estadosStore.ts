import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import { updateEntity, withEntities } from '@ngrx/signals/entities';
import {
  Codestados,
  Estado,
  EstadoData,
  EstadoPatch,
  EstadoQuery,
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
  withMethods((store) => ({
    // async changeEstado(codEstado: Codestados, aditionalData: AditionalData) {
    //   const selectedIds = store.selectedIds();
    //   for (const identificador of Object.keys(selectedIds)) {
    //     const id = parseInt(identificador);
    //     if (selectedIds[id]) {
    //       const estado = store.selectedEntities()[id];
    //       try {
    //         const updatedEstado = (await store.patch(estado.epartida, {
    //           ecod: codEstado.codiesta,
    //           codestado: codEstado,
    //           estado7: aditionalData.estado7,
    //           ecomenta: aditionalData.ecomenta,
    //         })) as Estado;
    //         patchState(
    //           store,
    //           updateEntity({
    //             id: updatedEstado.epedido,
    //             changes: {
    //               ecod: updatedEstado.ecod,
    //               codestado: updatedEstado.codestado,
    //             },
    //           })
    //         );
    //       } catch (error) {
    //         console.error('Error updating estado:', error);
    //         throw error;
    //       }
    //     }
    //   }
    // },
  })),
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
