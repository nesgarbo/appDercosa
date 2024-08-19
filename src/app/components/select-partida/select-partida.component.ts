import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonButton,
  IonInput,
  IonMenuButton,
} from '@ionic/angular/standalone';
import {
  ModalController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { BarcodeScanningModalComponent } from '../barcode-scanning-modal/barcode-scanning-modal.component';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { addIcons } from 'ionicons';
import { scanOutline } from 'ionicons/icons';

export type selectedOutputType = {
  epartida: string;
  epedido: string | null | undefined;
};

@Component({
  selector: 'app-select-partida',
  templateUrl: './select-partida.component.html',
  styleUrls: ['./select-partida.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonButton,
    IonModal,
    IonIcon,
    IonFabButton,
    IonFab,
    IonCol,
    IonRow,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonMenuButton,
  ],
  providers: [ModalController],
})
export class SelectPartidaComponent {
  modalController = inject(ModalController);
  alertController = inject(AlertController);
  loadingController = inject(LoadingController);

  addIcons = addIcons({ scanOutline });

  @Output() selected = new EventEmitter<selectedOutputType>();

  btnLabel = input<string>();
  titleLabel = input<string>();

  partidaForm = new FormGroup({
    epartida: new FormControl('', Validators.required),
    epedido: new FormControl<string | null>(null),
  });

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
    const epedido =
      data.barCode.substring(5, 10) + data.barCode.substring(10, 12);
    this.partidaForm.patchValue({ epartida: partida });
    this.partidaForm.patchValue({ epedido });
    this.onSubmit();
  }

  onSubmit() {
    const { epartida, epedido } = this.partidaForm.value;
    const emitValues = { epartida: epartida!, epedido };

    console.log('Emitting: ', emitValues, 'from: ', this.partidaForm.value);
    this.selected.emit(emitValues);
    setTimeout(() => {
      this.partidaForm.reset();
    }, 0);
  }
}
