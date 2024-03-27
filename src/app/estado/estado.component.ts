import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, input, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonInput,
  IonButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonModal,
} from '@ionic/angular/standalone';
import { FeathersClientService } from '../services/feathers/feathers-service.service';
import { ModalController } from '@ionic/angular';
import { Estado } from 'dercosa';
import { ModalEstadoComponent } from '../modal-estado/modal-estado.component';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.scss'],
  standalone: true,
  imports: [
    IonModal,
    IonContent,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonButton,
    IonInput,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  providers: [ModalController],
})
export class EstadoComponent implements OnInit {
  epartida = input<string>('');

  estado = signal<Estado[]>([]);

  constructor(
    private feathers: FeathersClientService,
    private modalController: ModalController
  ) {
    effect(
      () => {
        if (this.estado() && this.estado().length > 0){
          this.openModal();
        }
      },
    );
  }

  ngOnInit() {}

  estadoForm = new FormGroup({
    epartida: new FormControl('', Validators.required),
  });

  onSubmit() {
    this.getEstado(this.estadoForm.value.epartida!);
  }

  async getEstado(epartida: string) {
    this.estado.set(
      await this.feathers.getServiceByPath('estado').find({
        query: {
          EPARTIDA: epartida.toUpperCase(),
        },
      })
    );
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalEstadoComponent,
      componentProps: {
        data: this.estado(),
      }
    });
    return await modal.present();
  }
}
