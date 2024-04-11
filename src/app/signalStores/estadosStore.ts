import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import {
  setAllEntities,
  withEntities,
  updateEntity,
} from '@ngrx/signals/entities';
import { Codestados, Estado } from 'dercosa';
import { EventEmitter, computed, inject } from '@angular/core';
import { FeathersClientService } from '../services/feathers/feathers-service.service';
import { AlertController } from '@ionic/angular';

export type EstadosState = {
  selectedIds: Record<number, boolean>;
};

export type AditionalData = {
  ESTADO7?: string;
  EFECESTA?: string;
  ECOMENTA?: string;
};

export const PedidosStore = signalStore(
  { providedIn: 'root' },
  withState<EstadosState>({ selectedIds: {} }),
  withDevtools('estados'),
  withEntities<Estado>(),
  withMethods((store) => ({
    async setEstados(estados: Estado[]) {
      patchState(
        store,
        setAllEntities(estados, {
          idKey: 'PEDIDOLIN',
        }),
        { selectedIds: {} }
      );
    },
  })),
  withMethods((store, feathers = inject(FeathersClientService)) => ({
    select(estado: Estado) {
      patchState(store, {
        selectedIds: { ...store.selectedIds(), [estado.PEDIDOLIN]: true },
      });
    },
    unSelect(estado: Estado) {
      patchState(store, {
        selectedIds: { ...store.selectedIds(), [estado.PEDIDOLIN]: false },
      });
    },
    async changeEstado(codEstado: Codestados, aditionalData?: AditionalData) {
      const selectedIds = store.selectedIds();
      for (const identificador of Object.keys(selectedIds)) {
        const id = parseInt(identificador);
        console.log('Hasta aqui todo bien');
        if (selectedIds[id]) {
          console.log('Entra al if');
          const estado = store.entityMap()[id];
          try {
            const updatedEstado = await feathers
              .getServiceByPath('estado')
              .update(
                estado.EPARTIDA,
                aditionalData
                  ? {
                      ...estado,
                      ...aditionalData,
                      ECOD: codEstado.CODIESTA,
                      CODESTADO: codEstado,
                    }
                  : {
                      ...estado,
                      ECOD: codEstado.CODIESTA,
                      CODESTADO: codEstado,
                    }
              );
            console.log('UpdatedEstado', updatedEstado);
            patchState(
              store,
              updateEntity({
                id: updatedEstado.EPEDIDO,
                changes: {
                  ECOD: updatedEstado.ECOD,
                  CODESTADO: updatedEstado.CODESTADO,
                },
              })
            );
          } catch (error) {
            console.error('Error updating estado:', error);
            throw error;
          }
        }
      }
    },
  })),
  withComputed(({ entities, selectedIds }) => ({
    selectedEstados: computed(() =>
      entities().filter((estado) => selectedIds()[estado.PEDIDOLIN])
    ),
  })),
  withComputed(({ selectedEstados }) => ({
    sumPiezas: computed(() =>
      selectedEstados().reduce((acc, estado) => acc + estado.EPIEZAS, 0)
    ),
    sumCantidad: computed(() =>
      selectedEstados().reduce((acc, estado) => acc + estado.ECANT, 0)
    ),
  }))
);
