import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  model,
  untracked,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Codestados, Estado } from 'feathers-dercosa';

import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { CodEstadosStore } from '../../signalStores/stores/codEstadosStore';
import {
  AditionalData,
  EstadosStore,
  PedidolinRecord,
} from '../../signalStores/stores/estadosStore';

export type CheckedEstados = {
  epedido: Number;
  checked: boolean;
};

@Component({
  selector: 'app-modal-estado',
  templateUrl: './modal-estado.component.html',
  styleUrls: ['./modal-estado.component.scss'],
  standalone: true,
  imports: [
    IonTextarea,
    IonSelectOption,
    IonSelect,
    IonButtons,
    IonInput,
    IonFooter,
    IonButton,
    IonCheckbox,
    IonLabel,
    IonItem,
    IonContent,
    IonToolbar,
    IonTitle,
    IonHeader,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ModalEstadoComponent {
  readonly estadosStore = inject(EstadosStore);
  readonly codEstadosStore = inject(CodEstadosStore);

  codEstado = model<string>('');

  codEstados = computed(() =>
    this.codEstadosStore
      .entities()
      .sort((a, b) => a.desesta.localeCompare(b.desesta))
  );

  editCom = true;

  aditionalDataForm: FormGroup = new FormGroup({
    estado6: new FormControl<string | null>(null),
    estado7: new FormControl<string | null>(null),
    estado8: new FormControl<string | null>(null),
    efecesta: new FormControl<string | null>(null),
    ecomenta: new FormControl<string | null>(null),
    ecolor: new FormControl<string | null>(null),
  });

  constructor(
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    effect(() => {
      console.log('SelectedIds', this.estadosStore.selectedIds());
      const selectedIds = this.estadosStore.selectedIds();
      const selectedId = selectedIds.length > 0 ? selectedIds[0] : null;
      const entity = selectedId
        ? this.estadosStore
            .entities()
            .find((entity) => entity.id === selectedId)
        : null;
      untracked(() => {
        if (entity) {
          this.codEstado.set(entity.codestado.codiesta);
          this.aditionalDataForm.patchValue({
            ecomenta: entity.ecomenta,
            ecolor: entity?.ecolor,
            estado6: entity.estado6,
            estado7: entity.estado7,
            estado8: entity.estado8,
          });
        }
      });
    });
  }

  dismiss() {
    this.estadosStore.clearSelection();
    this.modalCtrl.dismiss();
  }

  toggleSelection(estado: Estado) {
    console.log('Estado', estado);
    if (this.estadosStore.selectedIds().includes(estado.id)) {
      this.estadosStore.deselectById(estado.id);
    } else {
      this.estadosStore.selectById(estado.id);
    }
  }

  selectAll() {
    this.estadosStore.entities().forEach((estado) => {
      this.estadosStore.selectById(estado.id);
    });
  }

  unselectAll() {
    this.estadosStore.entities().forEach((estado) => {
      this.estadosStore.deselectById(estado.id);
    });
  }

  somethingSelected() {
    return Object.values(this.estadosStore.selectedIds()).some(
      (selected) => selected
    );
  }

  async accept() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });

    const alert = await this.alertController.create({
      header: 'Comentarios diferentes',
      message: '¿Desea cambiar el comentario de los Estados seleccionados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.editCom = false;
          },
        },
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => {
            this.editCom = true;
          },
        },
      ],
    });
    if (this.estadosStore.selectedIds().length > 1) {
      alert.present();
      await alert.onDidDismiss();
    }

    loading.present();
    for (let i = 0; i < 3; i++) {
      try {
        let estado: Codestados = {
          id: this.codEstadosStore.entityMap()[this.codEstado()].id,
          codiesta: this.codEstado(),
          desesta: this.codEstadosStore.entityMap()[this.codEstado()].desesta,
        };
        let aditionalData: PedidolinRecord = {};
        for (const identificador of this.estadosStore.selectedIds()) {
          const id = parseInt(identificador);
          let ad: AditionalData;
          let fecha = new Date();
          ad = {
            pedidolin: id,
            efecesta: `${fecha.getFullYear()}-${
              fecha.getMonth() + 1
            }-${fecha.getDate()}`,
            ecomenta: this.editCom
              ? this.aditionalDataForm.value.ecomenta
              : this.estadosStore.entityMap()[id].ecomenta,
            estado7: this.estadosStore.allSelected() ? 'S' : '',
          };
          ad.ecomenta = ad.ecomenta ? ad.ecomenta : '   ';
          aditionalData[id] = ad;
          const changedEstado =
            this.estadosStore.entityMap()[identificador].ecod !=
            this.codEstado();
            console.log('changedEstado', changedEstado, this.estadosStore.entityMap()[identificador].ecod, this.codEstado());
          if (changedEstado) {
            this.estadosStore.patch(identificador, {
              ecod: this.codEstado(),
              estado7: ad.estado7,
              ecomenta: ad.ecomenta,
              efecesta: ad.efecesta,
            });
          } else {
            this.estadosStore.patch(identificador, {
              estado7: ad.estado7,
              ecomenta: ad.ecomenta,
            });
          }
        }

        // // Iniciar el temporizador
        // const timeout = new Promise((resolve, reject) => {
        //   const id = setTimeout(() => {
        //     clearTimeout(id);
        //     reject('La petición ha superado el tiempo máximo permitido');
        //   }, 7000); // 7 segundos
        // });

        // // Realizar la petición
        // const request = this.estadosStore.changeEstado(estado, aditionalData);

        // // Usar Promise.race para ver cuál promesa se resuelve/rechaza primero
        // await Promise.race([request, timeout]);

        loading.dismiss();
        this.dismiss();
        break;
      } catch (error) {
        console.dir(error);
        if (i === 2) {
          // Si es la última iteración, lanza el error
          throw error;
        }
      }
    }
  }
}
