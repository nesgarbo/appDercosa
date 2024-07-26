import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonTitle, IonMenuButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-inspecciones',
  templateUrl: './inspecciones.component.html',
  styleUrls: ['./inspecciones.component.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonButtons, IonTitle, IonMenuButton]
})
export class InspeccionesComponent {

  constructor() { }

}
