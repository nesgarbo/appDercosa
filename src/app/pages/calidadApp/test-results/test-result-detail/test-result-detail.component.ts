import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  computed,
  effect,
  inject,
  model,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Paginated } from '@feathersjs/feathers';
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
import { ClientTest, Estado, TestResult } from 'feathers-dercosa';
import { IonicSelectableComponent } from 'ionic-selectable';
import { filter, map } from 'rxjs';
import { BarcodeScanningModalComponent } from 'src/app/components/barcode-scanning-modal/barcode-scanning-modal.component';
import { SearchableSelectComponent } from 'src/app/components/searchable-select/searchable-select.component';
import { SelectComponent } from 'src/app/components/select/select.component';
import { BaseDetail } from 'src/app/shared/base-detail';
import { ClientTestsStore } from 'src/app/signalStores/stores/clientTestsStore';
import { EstadosStore } from 'src/app/signalStores/stores/estadosStore';
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
    SelectComponent,
  ],
})
export class TestResultDetailComponent
  extends BaseDetail<TestResult>
  implements AfterViewInit
{
  onTestChange(e: { component: IonicSelectableComponent; value: ClientTest }) {
    this.test.set(e.value);
  }
  readonly testResultsStore = inject(TestResultsStore);
  readonly clientTestsStore = inject(ClientTestsStore);
  readonly estadosStore = inject(EstadosStore);

  test = model<ClientTest>();
  effect = effect(() => {
    console.log('Test', this.test());
  });

  modalCtrl = inject(ModalController);

  filterBy = model<{ clientId: string; articuloId: string }>();

  filterTestText = model<string>('');
  testOptions = computed(() => {
    const filterTestText = this.filterTestText();
    const filterBy = this.filterBy();
    const clientTests = this.clientTestsStore
      .entities()
      .map((t) => ({
        ...t,
        name: t.test.name + ' de ' + t.client.nombrecli,
      }))
      .filter(
        (t) =>
          t?.name.toLowerCase().includes(filterTestText) &&
          t.clientId === filterBy?.clientId &&
          t.articuloId === filterBy.articuloId
      );
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
    result: new FormControl<number | undefined>(undefined),
    booleanResult: new FormControl<boolean | undefined>(undefined),
  });

  ngAfterViewInit(): void {
    const testId = this.detailsForm.get('testId')?.value;
    if (testId) {
      this.setTest(testId);
    }
    const linea = this.detailsForm.get('linea')?.value;
    if (linea) {
      this.detailsForm.patchValue({ linea: Number(linea) });
    }
    const result = this.detailsForm.get('result')?.value;
    const booleanResult = this.detailsForm.get('booleanResult')?.value;
    if (result) {
      this.detailsForm.patchValue({ result: Number(result) });
    } else {
      this.detailsForm.patchValue({ booleanResult: booleanResult });
    }
  }

  async setTest(testId: number) {
    this.test.set(await this.getTest(testId));
    console.log('Test', this.test());
  }

  formValue = toSignal(
    this.detailsForm.valueChanges.pipe(
      filter(
        (formValue) =>
          !!(
            formValue.partida?.length === 5 &&
            formValue.pedido?.toString().length === 5 &&
            formValue.linea
          )
      ),
      map((formValue) => ({
        partida: formValue.partida!,
        pedido: formValue.pedido!,
        linea: formValue.linea!,
      }))
    ),
    {
      initialValue: undefined,
    }
  );

  formValueEffect = effect(
    async () => {
      const formValue = this.formValue();
      if (formValue) {
        const { partida, pedido, linea } = formValue;
        try {
          const estado = (
            (await this.estadosStore.find({
              query: {
                epedido: pedido,
                epartida: partida,
                elinped: linea,
              },
            })) as Paginated<Estado>
          ).data[0];

          if (estado) {
            const newFilterBy = {
              clientId: estado.ecliente,
              articuloId: estado.ecodart,
            };

            // Solo actualiza si el valor es diferente
            if (
              this.filterBy()?.clientId !== newFilterBy.clientId ||
              this.filterBy()?.articuloId !== newFilterBy.articuloId
            ) {
              this.filterBy.set(newFilterBy);
            }
          }
        } catch (error) {
          // Manejo de errores
        }
      }
    },
    { allowSignalWrites: true }
  );

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
    const pedido = Number(data.barCode.substring(5, 10));
    const linea = Number(data.barCode.substring(10));
    console.log('data', partida, pedido, linea);
    this.detailsForm.patchValue({ partida });
    this.detailsForm.patchValue({ pedido });
    this.detailsForm.patchValue({ linea: Number(linea) });
  }
}
