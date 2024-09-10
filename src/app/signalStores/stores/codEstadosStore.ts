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
//       codEstados.sort((a, b) => a.DESESTA.localeCompare(b.DESESTA));
//       patchState(
//         store,
//         setAllEntities(codEstados, {
//           selectId: (codEstado) => codEstado.CODIESTA,
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
