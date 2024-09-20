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
  private feathers = inject(FeathersClientService);
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
      const operario = await this.operariosStore.get(this.visita.voperarioid);
      const data = {
        id: this.visita.id,
        fecha: this.visita.vfecha,
        nombre: this.visita.vnomvista,
        dni: this.visita.vdnivista,
        telefono: this.visita.vtelefono,
        nombreEmpresa: this.visita.vempresa,
        horaEntrada: this.visita.ventrada,
        horaSalida: this.visita.vsalida || '',
        recibeVisita: operario.tnombre || String(operario.tdni),
        firma: dataURL,
      };
      this.feathers.getServiceByPath('pdf-generator').create(data);
      this.dismiss();
    }
  }
}
