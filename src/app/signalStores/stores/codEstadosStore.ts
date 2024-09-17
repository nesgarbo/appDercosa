import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withHooks } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { Codestados, CodestadosData, CodestadosPatch, CodestadosQuery } from 'feathers-dercosa';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';

export const CodEstadosStore = signalStore(
  { providedIn: 'root' },
  withDevtools('codestados'),
  withEntities<Codestados>(),
  withFeathersDataService<'codestados', Codestados, CodestadosData, CodestadosQuery, CodestadosPatch>({
    servicePath: 'codestados',
  }),
  withHooks(({ startEmitting, find }) => {
    return {
      onInit() {
        startEmitting();
        find();
      },
    };
  })
);



// import { withDevtools } from '@angular-architects/ngrx-toolkit';
// import { inject } from '@angular/core';
// import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
// import { setAllEntities, withEntities } from '@ngrx/signals/entities';
// import { Codestados } from 'feathers-dercosa';
// import { FeathersClientService } from 'src/app/services/feathers/feathers-service.service';

// export const CodEstadosStore = signalStore(
//   { providedIn: 'root' },
//   withDevtools('codEstados'),
//   withEntities<Codestados>(),
//   withMethods((store) => ({
//     async setCodEstados(codEstados: Codestados[]) {
//       codEstados.sort((a, b) => a.desesta.localeCompare(b.desesta));
//       patchState(
//         store,
//         setAllEntities(codEstados, {
//           selectId: (codEstado) => codEstado.codiesta,
//         })
//       );
//     },
//   })),
//   withHooks(({ setCodEstados }) => {
//     const feathers = inject(FeathersClientService);
//     async function fetchAndSetCodEstados() {
//       const codEstados = await feathers.getCodEstados();
//       setCodEstados(codEstados);
//     }
//     return {
//       onInit() {
//         fetchAndSetCodEstados();
//       },
//     };
//   })
// );
