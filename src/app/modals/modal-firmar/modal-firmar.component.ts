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
import { FeathersClientService } from 'src/app/services/feathers/feathers-service.service';
import { OperariosStore } from 'src/app/signalStores/stores/operariosStore';
import { VisitasStore } from 'src/app/signalStores/stores/visitasStore';

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
  readonly visitasStore = inject(VisitasStore);
  readonly operariosStore = inject(OperariosStore);
  @ViewChild('signatureCanvas', { static: true })
  signaturePadElement!: ElementRef;
  signaturePad: any;

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
      const visita: Partial<Visita> = {
        vfecha: this.visita.vfecha,
        vnomvista: this.visita.vnomvista,
        vdnivista: this.visita.vdnivista,
        vtelefono: this.visita.vtelefono,
        vempresa: this.visita.vempresa,
        ventrada: this.visita.ventrada,
        vsalida: this.visita.vsalida || "",
        vfirmado: this.removeBase64Prefix(dataURL),
        voperarioid: this.visita.voperarioid,
        vtarjeta: this.visita.vtarjeta,
      };
      await this.visitasStore.patch(this.visita.id, visita);
      this.dismiss();
    }
  }
  removeBase64Prefix(base64String: any) {
    // Verifica si la cadena contiene el prefijo 'data:image'
    if (base64String.startsWith('data:image')) {
      // Elimina todo hasta la coma (inclusive)
      return base64String.split(',')[1];
    }
    // Si no tiene el prefijo, devuelve la cadena original
    return base64String;
  }
}
