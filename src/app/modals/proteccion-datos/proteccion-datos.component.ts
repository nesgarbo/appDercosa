import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from "@ionic/angular/standalone";
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-proteccion-datos',
  standalone: true,
  imports: [IonContent, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader, ],
  templateUrl: './proteccion-datos.component.html',
  styleUrls: ['./proteccion-datos.component.scss'],
})
export class ProteccionDatosComponent  implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
