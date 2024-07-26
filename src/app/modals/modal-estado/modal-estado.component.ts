import {
  Component,
  Input,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Codestados, Estado } from 'feathers-dercosa';
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonFooter,
  IonInput,
  IonButtons,
  IonSelectOption,
  IonSelect,
  IonTextarea,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  AditionalData,
  PedidolinRecord,
  EstadosStore,
} from '../../signalStores/stores/estadosStore';
import {
  LoadingController,
  ModalController,
  AlertController,
} from '@ionic/angular';
import { CodEstadosStore } from '../../signalStores/stores/codEstadosStore';

import isBlank from 'is-blank';

export type CheckedEstados = {
  EPEDIDO: Number;
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

  estadoSelected?: number = undefined;

  readonly codEstadosStore = inject(CodEstadosStore);

  codEstado: string | null = null;

  editCom = true;

  aditionalDataForm: FormGroup = new FormGroup({
    ESTADO6: new FormControl<string | null>(null),
    ESTADO7: new FormControl<string | null>(null),
    ESTADO8: new FormControl<string | null>(null),
    EFECESTA: new FormControl<string | null>(null),
    ECOMENTA: new FormControl<string | null>(null),
    ECOLOR: new FormControl<string | null>(null),
  });

  constructor(
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    effect(() => {
      console.log('SelectedIds', this.estadosStore.selectedEntities());
      const selectedEntities = this.estadosStore.selectedEntities();
      this.codEstado =
        selectedEntities.length > 0
          ? selectedEntities[0].CODESTADO.CODIESTA
          : null;
      this.aditionalDataForm.patchValue({
        ECOMENTA:
          selectedEntities.length > 0
            ? !isBlank(selectedEntities[0].ECOMENTA)
              ? selectedEntities[0].ECOMENTA
              : ''
            : null,
        ECOLOR: selectedEntities.length > 0 ? selectedEntities[0].ECOLOR : null,
        ESTADO6:
          selectedEntities.length > 0
            ? !isBlank(selectedEntities[0].ESTADO6)
              ? selectedEntities[0].ESTADO6
              : ''
            : null,
        ESTADO7:
          selectedEntities.length > 0
            ? !isBlank(selectedEntities[0].ESTADO7)
              ? selectedEntities[0].ESTADO7
              : ''
            : null,
        ESTADO8:
          selectedEntities.length > 0
            ? !isBlank(selectedEntities[0].ESTADO8)
              ? selectedEntities[0].ESTADO8
              : ''
            : null,
      });
    });
  }

  dismiss() {
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
          CODIESTA: this.codEstado!,
          DESESTA: this.codEstadosStore.entityMap()[this.codEstado!].DESESTA,
        };
        let aditionalData: PedidolinRecord = {};
        for (const identificador of Object.keys(
          this.estadosStore.selectedEntities()
        )) {
          const id = parseInt(identificador);
          if (this.estadosStore.selectedEntities()[id]) {
            let ad: AditionalData;
            let fecha = new Date();
            ad = {
              PEDIDOLIN: id,
              EFECESTA: this.aditionalDataForm.value.EFECESTA,
              ECOMENTA: this.editCom
                ? this.aditionalDataForm.value.ECOMENTA
                : this.estadosStore.entityMap()[id].ECOMENTA,
              ESTADO7: this.aditionalDataForm.value.ESTADO7,
            };
            ad.EFECESTA = `${fecha.getFullYear() - 1}-${
              fecha.getMonth() + 1
            }-${fecha.getDate()}`;
            ad.ESTADO7 = this.estadosStore.allSelected() ? 'S' : '';
            ad.ECOMENTA = ad.ECOMENTA ? ad.ECOMENTA : '   ';
            aditionalData[id] = ad;
          }
        }

        console.dir(aditionalData);
        console.log('AditionalData', aditionalData);

        // Iniciar el temporizador
        const timeout = new Promise((resolve, reject) => {
          const id = setTimeout(() => {
            clearTimeout(id);
            reject('La petición ha superado el tiempo máximo permitido');
          }, 7000); // 7 segundos
        });

        // Realizar la petición
        const request = this.estadosStore.changeEstado(estado, aditionalData);

        // Usar Promise.race para ver cuál promesa se resuelve/rechaza primero
        await Promise.race([request, timeout]);

        loading.dismiss();
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
