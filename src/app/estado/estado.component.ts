import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  effect,
  input,
  signal,
} from '@angular/core';
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
  IonLoading,
  LoadingController,
  AlertController,
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
} from '@ionic/angular/standalone';
import { FeathersClientService } from '../services/feathers/feathers-service.service';
import { ModalController } from '@ionic/angular';
import { Estado } from 'dercosa';
import { ModalEstadoComponent } from '../modal-estado/modal-estado.component';
import { addIcons } from 'ionicons';
import { scanOutline } from 'ionicons/icons';
import {
  Barcode,
  BarcodeScanner,
  LensFacing,
  StartScanOptions,
} from '@capacitor-mlkit/barcode-scanning';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.scss'],
  standalone: true,
  imports: [
    IonFabList,
    IonIcon,
    IonFabButton,
    IonFab,
    IonLoading,
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
  epedido?: number = undefined;
  estado = signal<Estado[]>([]);

  constructor(
    private feathers: FeathersClientService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    addIcons({ scanOutline });
    effect(() => {
      if (this.estado() && this.estado().length > 0) {
        this.openModal();
      }
    });
  }

  ngOnInit() {}

  estadoForm = new FormGroup({
    epartida: new FormControl('', Validators.required),
  });

  onSubmit() {
    this.getEstado(this.estadoForm.value.epartida!);
  }

  async getEstado(epartida: string) {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    console.log('Cogiendo estado', epartida.toUpperCase());

    for (let i = 0; i < 10; i++) {
      try {
        console.log('Intento: ', i);
        await loading.present();
        // Utiliza la función de estadoConTimeout aquí
        const estado = await this.estadoConTimeout(epartida);
        console.log('Estado: ', estado);
        this.estado.set(estado);
        if (estado.length === 0) {
          let epedido = this.epedido ? this.epedido.toString().substring(0, 5) : '';
          let linea = this.epedido ? this.epedido.toString().substring(5) : '';
          this.presentAlert(`No se encuentra Partida: ${epartida}, Pedido: ${epedido}, Linea: ${linea}`);
        }
        await loading.dismiss();
        return;
      } catch (error: any) {
        console.log('Error: ', error.message); // Muestra el mensaje de error
        if (i === 9) {
          await loading.dismiss();
          this.presentAlert('Ha ocurrido un error');
        }
      }
    }
  }

  async estadoConTimeout(epartida: string, timeout = 7000) {
    return new Promise<Estado[]>((resolve, reject) => {
      // Timeout handler
      const timer = setTimeout(() => {
        reject(new Error('La petición ha superado el tiempo máximo permitido'));
      }, timeout);

      // Ejecuta la petición
      this.feathers
        .getServiceByPath('estado')
        .find({
          query: { EPARTIDA: epartida.toUpperCase() },
        })
        .then((response) => {
          clearTimeout(timer); // Limpia el timeout si la petición es exitosa
          resolve(response); // Resuelve con los datos recibidos
        })
        .catch((error) => {
          clearTimeout(timer); // Asegura que el timeout sea limpiado si hay un error
          reject(error); // Rechaza con el error
        });
    });
  }

  async openModal() {
    const data = this.epedido
      ? { estados: this.estado(), pedido: this.epedido }
      : { estados: this.estado() };
    this.epedido = undefined;
    console.log('*******Data: ', data);
    const modal = await this.modalController.create({
      component: ModalEstadoComponent,
      componentProps: {
        data,
      },
    });
    return await modal.present();
  }
  async presentAlert(str?: string) {
    const alert = await this.alertController.create({
      header: str || 'No se han encontrado registros',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async startScan(): Promise<void> {
    const element = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        lensFacing: LensFacing.Back,
      },
    });
    await element.present();

    const { data } = await element.onDidDismiss();
    console.log('Data: ', data);
    if (!data || !data.barCode) {
      return;
    }
    let partida = data.barCode.substring(0, 5);
    this.epedido = Number(data.barCode.substring(5, 10));
    this.epedido = Number(this.epedido.toString() + Number(data.barCode.substring(10, 12)));
    this.estadoForm.patchValue({ epartida: partida });
    this.onSubmit();
  }
}
