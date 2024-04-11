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

import { AditionalData, PedidosStore } from '../signalStores/estadosStore';
import {
  LoadingController,
  ModalController,
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

  isBlank = require('is-blank')
  readonly pedidosStore = inject(PedidosStore);
  
  estadoSelected?: number = undefined;

  readonly codEstadosStore = inject(CodEstadosStore);

  codEstado: string | null = null;

  selectedAll = false;

  aditionalDataForm: FormGroup = new FormGroup({
    ESTADO7: new FormControl<string | null>(null),
    EFECESTA: new FormControl<string | null>(null),
    ECOMENTA: new FormControl<string | null>(null),
    ECOLOR: new FormControl<string | null>(null),
  });

  @Input() set data(data: {estados: Estado[], pedido: number}) {
    console.dir('Data', data);
    this.pedidosStore.setEstados(data.estados).then(() => {
      if (data.pedido) {
        const pedido = Number(data.pedido);
        const estado = this.pedidosStore.entities().find(est => est.PEDIDOLIN === pedido);
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
    private loadingController: LoadingController
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
          .filter((entity) => this.pedidosStore.selectedIds()[entity.PEDIDOLIN]);
        this.codEstado =
          selectedEntities.length > 0
            ? selectedEntities[0].CODESTADO.CODIESTA
            : null;
        this.aditionalDataForm.patchValue({
          ECOMENTA:
            selectedEntities.length > 0 ? (!this.isBlank(selectedEntities[0].ECOMENTA) ? selectedEntities[0].ECOMENTA : '') : null,
          ECOLOR: selectedEntities.length > 0 ? selectedEntities[0].ECOLOR : null,
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
    loading.present();
    for (let i = 0; i < 3; i++) {
      try {
        console.log('FIRULAAAAAAIS', this.codEstado);
        let estado: Codestados = {
          CODIESTA: this.codEstado!,
          DESESTA: this.codEstadosStore.entityMap()[this.codEstado!].DESESTA,
        };
        let aditionalData: AditionalData = this.aditionalDataForm.value;
        let fecha = new Date();
        aditionalData.EFECESTA = `${fecha.getFullYear() - 1}-${
          fecha.getMonth() + 1
        }-${fecha.getDate()}`;
        aditionalData.ESTADO7 = this.allSelected() ? 'S' : '';
        aditionalData.ECOMENTA = aditionalData.ECOMENTA ? aditionalData.ECOMENTA : '   ';
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
