import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  computed,
  effect,
  inject,
  model,
  untracked,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { ModalController } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonNote,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { TestResult } from 'feathers-dercosa';
import { IonicSelectableComponent } from 'ionic-selectable';
import { BarcodeScanningModalComponent } from 'src/app/components/barcode-scanning-modal/barcode-scanning-modal.component';
import { SearchableSelectComponent } from 'src/app/components/searchable-select/searchable-select.component';
import { BaseDetail } from 'src/app/shared/base-detail';
import { ClientTestsStore } from 'src/app/signalStores/stores/clientTestsStore';
import { TestResultsStore } from 'src/app/signalStores/stores/testResultsStore';
import { TestsStore } from 'src/app/signalStores/stores/testsStore';

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result-detail.component.html',
  styleUrls: ['./test-result-detail.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonNote,
    IonIcon,
    IonFabButton,
    IonFab,
    IonFooter,
    IonTextarea,
    IonLabel,
    IonItem,
    IonList,
    IonInput,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonHeader,
    TranslateModule,
    IonicSelectableComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SearchableSelectComponent,
  ],
})
export class TestResultDetailComponent extends BaseDetail<TestResult> {
  testResultsStore = inject(TestResultsStore);
  clientTestsStore = inject(ClientTestsStore);

  modalCtrl = inject(ModalController);

  filterTestText = model<string>('');
  testOptions = computed(() => {
    const filterTestText = this.filterTestText();
    const clientTests = this.clientTestsStore
      .entities()
      .map((t) => ({
        ...t,
        name: t.test.name + ' de ' + t.client.nombrecli,
      }))
      .filter((t) => t?.name.toLowerCase().includes(filterTestText));
    console.log(clientTests);
    return untracked(() => {
      return clientTests;
    });
  });

  async searchTests(event: {
    component: IonicSelectableComponent;
    text: string;
  }) {
    console.log('searchTest event', event);
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    this.filterTestText.set(text);
  }

  async getTest(id: number) {
    return this.clientTestsStore.get(id);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  @Input({ required: true }) set data(data: TestResult) {
    console.log('Test', data);
    this.item = data;
  }

  result?: number | undefined;

  override detailsForm = new FormGroup({
    partida: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(5),
    ]),
    pedido: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(5),
    ]),
    linea: new FormControl<number | undefined>(undefined, [
      Validators.required,
    ]),
    testId: new FormControl<number | undefined>(undefined, [
      Validators.required,
    ]),
    result: new FormControl<number | undefined>(undefined, [
      Validators.required,
    ]),
  });

  override getSignalStore() {
    return this.testResultsStore;
  }

  override async save() {
    super.save();
    this.modalCtrl.dismiss();
  }

  async startScan(): Promise<void> {
    const element = await this.modalCtrl.create({
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
    const pedido = data.barCode.substring(5, 10);
    const linea = data.barCode.substring(10);
    console.log('data', partida, pedido, linea);
    this.detailsForm.patchValue({ partida });
    this.detailsForm.patchValue({ pedido });
    this.detailsForm.patchValue({ linea: Number(linea) });
  }
}
