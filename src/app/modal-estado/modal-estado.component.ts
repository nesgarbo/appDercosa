import {
  Component,
  Input,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Codestados, Estado } from 'dercosa';
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
  PedidosStore,
} from '../signalStores/estadosStore';
import {
  LoadingController,
  ModalController,
  AlertController,
} from '@ionic/angular';
import { CodEstadosStore } from '../signalStores/codEstadosStore';

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
export class ModalEstadoComponent implements OnInit {
  isBlank = require('is-blank');
  readonly pedidosStore = inject(PedidosStore);

  estadoSelected?: number = undefined;

  readonly codEstadosStore = inject(CodEstadosStore);

  codEstado: string | null = null;

  editCom = true;

  selectedAll = false;

  aditionalDataForm: FormGroup = new FormGroup({
    ESTADO6: new FormControl<string | null>(null),
    ESTADO7: new FormControl<string | null>(null),
    ESTADO8: new FormControl<string | null>(null),
    EFECESTA: new FormControl<string | null>(null),
    ECOMENTA: new FormControl<string | null>(null),
    ECOLOR: new FormControl<string | null>(null),
  });

  @Input() set data(data: { estados: Estado[]; pedido: number }) {
    console.dir('Data', data);
    this.pedidosStore.setEstados(data.estados).then(() => {
      if (data.pedido) {
        const pedido = Number(data.pedido);
        const estado = this.pedidosStore
          .entities()
          .find((est) => est.PEDIDOLIN === pedido);
        if (estado) {
          this.estadoSelected = pedido;
          console.log('Estado', estado);
          this.pedidosStore.select(estado);
        }
      }
    });
  }
  constructor(
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    effect(() => {
      if (
        this.pedidosStore.entities().length ===
          Object.keys(this.pedidosStore.selectedIds()).length &&
        this.allSelected()
      ) {
        this.selectedAll = true;
      } else {
        this.selectedAll = false;
      }

      if (Object.keys(this.pedidosStore.selectedIds()).length > 0) {
        const selectedEntities = this.pedidosStore
          .entities()
          .filter(
            (entity) => this.pedidosStore.selectedIds()[entity.PEDIDOLIN]
          );
        this.codEstado =
          selectedEntities.length > 0
            ? selectedEntities[0].CODESTADO.CODIESTA
            : null;
        this.aditionalDataForm.patchValue({
          ECOMENTA:
            selectedEntities.length > 0
              ? !this.isBlank(selectedEntities[0].ECOMENTA)
                ? selectedEntities[0].ECOMENTA
                : ''
              : null,
          ECOLOR:
            selectedEntities.length > 0 ? selectedEntities[0].ECOLOR : null,
          ESTADO6:
            selectedEntities.length > 0
              ? !this.isBlank(selectedEntities[0].ESTADO6)
                ? selectedEntities[0].ESTADO6
                : ''
              : null,
          ESTADO7:
            selectedEntities.length > 0
              ? !this.isBlank(selectedEntities[0].ESTADO7)
                ? selectedEntities[0].ESTADO7
                : ''
              : null,
          ESTADO8:
            selectedEntities.length > 0
              ? !this.isBlank(selectedEntities[0].ESTADO8)
                ? selectedEntities[0].ESTADO8
                : ''
              : null,
        });
      }
    });
  }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  toggleSelection(estado: Estado) {
    if (this.pedidosStore.selectedIds()[estado.PEDIDOLIN]) {
      this.pedidosStore.unSelect(estado);
    } else {
      this.pedidosStore.select(estado);
    }
  }

  selectAll() {
    this.pedidosStore.entities().forEach((estado) => {
      this.pedidosStore.select(estado);
    });
  }

  unselectAll() {
    this.pedidosStore.entities().forEach((estado) => {
      this.pedidosStore.unSelect(estado);
    });
  }

  allSelected() {
    return Object.values(this.pedidosStore.selectedIds()).every(
      (val) => val === true
    );
  }

  somethingSelected() {
    return Object.values(this.pedidosStore.selectedIds()).some(
      (val) => val === true
    );
  }

  async accept() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });

    const alert = await this.alertController.create({
      header: 'Comentarios diferentes',
      message: '¿Desea cambiar el comentario de los pedidos seleccionados?',
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
    if (this.pedidosStore.comDiff()) {
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
          this.pedidosStore.selectedIds()
        )) {
          const id = parseInt(identificador);
          if (this.pedidosStore.selectedIds()[id]) {
            let ad: AditionalData;
            let fecha = new Date();
            ad = {
              PEDIDOLIN: id,
              EFECESTA: this.aditionalDataForm.value.EFECESTA,
              ECOMENTA: this.editCom
                ? this.aditionalDataForm.value.ECOMENTA
                : this.pedidosStore.entityMap()[id].ECOMENTA,
              ESTADO7: this.aditionalDataForm.value.ESTADO7,
            };
            ad.EFECESTA = `${fecha.getFullYear() - 1}-${
              fecha.getMonth() + 1
            }-${fecha.getDate()}`;
            ad.ESTADO7 = this.allSelected() ? 'S' : '';
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
        const request = this.pedidosStore.changeEstado(estado, aditionalData);

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
