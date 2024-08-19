import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonModal } from "@ionic/angular/standalone";
import { VisitasStore } from 'src/app/signalStores/stores/visitasStore';
import { Visita } from 'feathers-dercosa';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalFirmarComponent } from 'src/app/modals/modal-firmar/modal-firmar.component';

@Component({
  selector: 'app-visitas',
  standalone: true,
  imports: [IonModal, IonTitle, IonToolbar, IonHeader, CommonModule],
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.scss'],
})
export class VisitasComponent implements OnInit {

  readonly visitasStore = inject(VisitasStore);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  ngOnInit(): void {
    this.visitasStore.service().on('requestSignature', async (visita: Visita) => {
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
