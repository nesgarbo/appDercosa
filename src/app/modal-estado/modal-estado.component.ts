import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { Estado } from 'dercosa';
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
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FeathersClientService } from '../services/feathers/feathers-service.service';
import { FormsModule } from '@angular/forms';

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
  ],
})
export class ModalEstadoComponent implements OnInit {
  codEstados = this.feathers.getCodEstados();

  estados = signal<Estado[]>([]);
  @Input({ required: true }) set data(data: Estado[]) {
    console.log('Data', data);
    this.estados.set(data);
  }

  chekedEstados = signal<CheckedEstados[]>([]);

  selectedEstados = computed(() =>
    this.estados().filter((estado) =>
      this.chekedEstados().find(
        (e) => e.EPEDIDO === estado.EPEDIDO && e.checked
      )
    )
  );

  sumPiezas = computed(() =>
    this.selectedEstados().reduce((acc, estado) => acc + estado.EPIEZAS, 0)
  );

  sumCantidad = computed(() =>
    this.selectedEstados().reduce((acc, estado) => acc + estado.ECANT, 0)
  );

  constructor(private feathers: FeathersClientService) {}

  ngOnInit() {
    this.chekedEstados.set(
      this.estados().map((estado) => ({
        EPEDIDO: estado.EPEDIDO,
        checked: false,
      }))
    );
  }

  checkAll() {
    this.chekedEstados().forEach((estado) => {
      estado.checked = true;
    });
  }

  selectMember(data: Estado, event: any) {
    const isChecked = event.target.checked;
    const index = this.chekedEstados().findIndex(
      (estado) => estado.EPEDIDO === data.EPEDIDO
    );
    if (index !== -1) {
      this.chekedEstados()[index].checked = isChecked;
    }
  }

  getCheckedEstado(estado: Estado) {
    return (
      this.chekedEstados().find(
        (checkedEstado) => checkedEstado.EPEDIDO === estado.EPEDIDO
      ) || { checked: false }
    );
  }
}
