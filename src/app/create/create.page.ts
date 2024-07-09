import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonRow, IonCol, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonInput } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { addIcons } from 'ionicons';
import { scanOutline } from 'ionicons/icons';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonModal, IonIcon, IonFabButton, IonFab, IonCol, IonRow, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [ModalController],
})
export class CreatePage {
  modalController = inject(ModalController);

  addIcons = addIcons({scanOutline});

  partidaForm = new FormGroup({
    epartida: new FormControl('', Validators.required),
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
    this.partidaForm.value.epartida = data.barCode.substring(0, 5);
  }

  onSubmit() {
    
  }
}
