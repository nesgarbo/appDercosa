import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  computed,
  effect,
  inject,
  model,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  IonNote,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ClientTest, Test } from 'feathers-dercosa';
import { IonicSelectableComponent } from 'ionic-selectable';
import { SearchableSelectComponent } from 'src/app/components/searchable-select/searchable-select.component';
import { BaseDetail } from 'src/app/shared/base-detail';
import { ClientsStore } from 'src/app/signalStores/stores/clientsStore';
import { ClientTestsStore } from 'src/app/signalStores/stores/clientTestsStore';
import { MeasurementUnitsStore } from 'src/app/signalStores/stores/measurementUnitsStore';
import { TestsStore } from 'src/app/signalStores/stores/testsStore';
import { addIcons } from 'ionicons';
import { clientTestConditionalValidator } from 'src/app/validators/clientTestConditionalValidator';
import { SelectComponent } from 'src/app/components/select/select.component';

@Component({
  selector: 'app-client-test',
  templateUrl: './client-test-detail.component.html',
  styleUrls: ['./client-test-detail.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonNote,
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
export class ClientTestDetailComponent extends BaseDetail<ClientTest> {
  clientTestsStore = inject(ClientTestsStore);
  testsStore = inject(TestsStore);
  clientsStore = inject(ClientsStore);
  measurementUnitsStore = inject(MeasurementUnitsStore);
  modalCtrl = inject(ModalController);

  filterTestText = model<string>('');
  filterClientText = model<string>('');
  filterMeasurementUnitText = model<string>('');
  test = model<Test>();

  close() {
    this.modalCtrl.dismiss();
  }

  protected override onItemSet(item: ClientTest): void {
    console.log('Item set', item);
    this.clientTestsStore.addEntityToCache(item);
    console.log('Items', this.clientTestsStore.entities());
  }

  testOptions = computed(() => {
    return this.testsStore
      .entities()
      .filter((t) => t?.name.toLowerCase().includes(this.filterTestText()));
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
    return this.testsStore.get(id);
  }

  measurementUnitOptions = computed(() => {
    return this.measurementUnitsStore
      .entities()
      .filter((t) =>
        t?.name.toLowerCase().includes(this.filterMeasurementUnitText())
      );
  });

  async searchMeasurementUnit(event: {
    component: IonicSelectableComponent;
    text: string;
  }) {
    console.log('searchTest event', event);
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    this.filterMeasurementUnitText.set(text);
  }

  async getMeasurementUnit(id: number) {
    return this.measurementUnitsStore.get(id);
  }

  clientOptions = computed(() => {
    return this.clientsStore
      .entities()
      .filter((c) =>
        c?.nombrecli.toLowerCase().includes(this.filterClientText())
      );
  });

  async searchClients(event: {
    component: IonicSelectableComponent;
    text: string;
  }) {
    // let text = event.text.trim().toLowerCase();
    const text = event.text.trim();
    if (text.length >= 3) {
      console.log('pepe');
      event.component.startSearch();

      // this.filterClientText.set(text);
      this.clientsStore.find({ query: { nombrecli: { $ilike: `%${text}%` } } });
    }
  }

  async getClient(id: string) {
    return this.clientsStore.get(id);
  }

  override detailsForm = new FormGroup(
    {
      clientId: new FormControl<string | undefined>(undefined, [
        Validators.required,
      ]),
      testId: new FormControl<number | undefined>(undefined, [
        Validators.required,
      ]),
      articuloId: new FormControl<string | undefined>(undefined, [
        Validators.required,
      ]),
      booleanOkValue: new FormControl<boolean | undefined>(undefined, []),
      measurementUnitId: new FormControl<number | undefined>(undefined, []),
      clientMax: new FormControl<number | undefined>(undefined, []),
      clientMin: new FormControl<number | undefined>(undefined, []),
    },
    { validators: clientTestConditionalValidator }
  );

  override getSignalStore() {
    return this.clientTestsStore;
  }

  override async save() {
    super.save();
    this.modalCtrl.dismiss();
  }

  onTestChange(e: { component: IonicSelectableComponent; value: Test }) {
    const values = this.detailsForm.getRawValue();
    if (!e.value.isBoolean) {
      if (!values.clientMax) {
        this.detailsForm.controls.clientMax.setValue(e.value?.defaultMax);
      }
      if (!values.clientMin) {
        this.detailsForm.controls.clientMin.setValue(e.value?.defaultMin);
      }
      if (!values.measurementUnitId) {
        this.detailsForm.controls.measurementUnitId.setValue(
          e.value?.measurementUnit
        );
      }
      this.detailsForm.controls.booleanOkValue.setValue(undefined);
    } else {
      this.detailsForm.controls.clientMax.setValue(undefined);
      this.detailsForm.controls.clientMin.setValue(undefined);
      this.detailsForm.controls.measurementUnitId.setValue(undefined);
      if (!values.booleanOkValue) {
        this.detailsForm.controls.booleanOkValue.setValue(
          e.value?.booleanOkValue
        );
      }
    }
    this.test.set(e.value);
  }

  onClose(e: { component: IonicSelectableComponent }) {
    console.log('onClose', e);
    console.log('onClose', e.component.value);
  }
}
