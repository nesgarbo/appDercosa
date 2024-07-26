import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { Visita } from 'feathers-dercosa';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonAlert,
  IonModal,
} from '@ionic/angular/standalone';
import { ModalController, AlertController } from '@ionic/angular';
import SignaturePad from 'signature_pad';
import { ProteccionDatosComponent } from '../proteccion-datos/proteccion-datos.component';
import { PdfGeneratorStore } from 'src/app/signalStores/stores/pdfGeneratorStore';

@Component({
  selector: 'app-modal-firmar',
  standalone: true,
  imports: [
    IonModal,
    IonAlert,
    IonButton,
    IonButtons,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    CommonModule,
  ],
  templateUrl: './modal-firmar.component.html',
  styleUrls: ['./modal-firmar.component.scss'],
})
export class ModalFirmarComponent implements AfterViewInit {
  @ViewChild('signatureCanvas', { static: true })
  signaturePadElement!: ElementRef;
  signaturePad: any;

  readonly pdfGeneratorStore = inject(PdfGeneratorStore);

  @Input({ required: true }) visita!: Visita;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngAfterViewInit() {
    this.openPD();
    this.signaturePad = new SignaturePad(
      this.signaturePadElement.nativeElement
    );
    let canvas = this.signaturePadElement.nativeElement;
    console.log(this.signaturePad);
    canvas.width = 600;
    canvas.height = 400;
  }

  async openPD() {
    const modal = await this.modalCtrl.create({
      component: ProteccionDatosComponent,
    });
    modal.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  saveSignature() {
    if (!this.signaturePad.isEmpty()) {
      const data = this.signaturePad.toDataURL();
      // Haz algo con los datos de la firma, como enviarlos a un servidor
    }
  }

  clear() {
    this.signaturePad.clear();
  }

  async toPngPad() {
    if (this.signaturePad.isEmpty()) {
      const a = await this.alertCtrl.create({
        header: 'Por favor, proporcione una firma primero.',
        buttons: ['Aceptar'],
      });
      a.present();
    } else {
      var dataURL = this.signaturePad.toDataURL();
      const data = {
        id: this.visita.VID || this.visita.id,
        fecha: this.visita.VFECHA,
        nombre: this.visita.VNOMVISTA,
        dni: this.visita.VDNIVISTA,
        telefono: this.visita.VTELEFONO,
        nombreEmpresa: this.visita.VEMPRESA,
        horaEntrada: this.visita.VENTRADA,
        horaSalida: this.visita.VSALIDA || '',
        recibeVisita: this.visita.VDNIDERCO,
        firma: dataURL,
      };
      this.pdfGeneratorStore.create(data, {});
      this.dismiss();
    }
  }
}
