import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Visita } from 'feathers-dercosa';
import { addIcons } from 'ionicons';
import { pencilOutline } from 'ionicons/icons';
import { ModalFirmarComponent } from 'src/app/modals/modal-firmar/modal-firmar.component';
import { VisitasStore } from 'src/app/signalStores/stores/visitasStore';

@Component({
  selector: 'app-sin-firmar',
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonCheckbox,
    IonItem,
  ],
  providers: [ModalController],
  templateUrl: './sin-firmar.component.html',
  styleUrls: ['./sin-firmar.component.scss'],
})
export class SinFirmarComponent {
  constructor(private modalCtrl: ModalController) {
    addIcons({ pencilOutline });
  }

  readonly visitasStore = inject(VisitasStore);

  async firmar(visita: Visita) {
    const modal = await this.modalCtrl.create({
      component: ModalFirmarComponent,
      componentProps: {
        visita,
      },
    });
    modal.present();
  }
}
