import { Component, OnInit, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonCheckbox,
  IonItem,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pencilOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Visita } from 'feathers-dercosa';
import { ModalController } from '@ionic/angular';
import { VisitasStore } from 'src/app/signalStores/stores/visitasStore';
import { ModalFirmarComponent } from 'src/app/modals/modal-firmar/modal-firmar.component';

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
export class SinFirmarComponent implements OnInit {
  constructor(private router: Router, private modalCtrl: ModalController) {
    addIcons({ pencilOutline });
  }

  readonly visitasStore = inject(VisitasStore);

  async firmar(visita: Visita) {
    this.router.navigate(['/tabs/visitas']);
    const modal = await this.modalCtrl.create({
      component: ModalFirmarComponent,
      componentProps: {
        visita,
      },
      
    });
    modal.present();
  }

  ngOnInit(): void {
    this.visitasStore.service().on('requestSignature', async (visita: Visita) => {
      console.log('VISITAAAAA', visita);
      this.router.navigate(['/tabs/visitas']);
      const modal = await this.modalCtrl.create({
        component: ModalFirmarComponent,
        componentProps: {
          visita,
        },
      });
      modal.present();
    });
  }
}
