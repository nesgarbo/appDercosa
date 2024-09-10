import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  computed,
  inject,
  model
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
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Test } from 'feathers-dercosa';
import { IonicSelectableComponent } from 'ionic-selectable';
import { SearchableSelectComponent } from 'src/app/components/searchable-select/searchable-select.component';
import { BaseDetail } from 'src/app/shared/base-detail';
import { MeasurementUnitsStore } from 'src/app/signalStores/stores/measurementUnitsStore';
import { TestsStore } from 'src/app/signalStores/stores/testsStore';
import { addIcons } from "ionicons";

@Component({
  selector: 'app-tests',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.scss'],
  standalone: true,
  imports: [
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
    SearchableSelectComponent
  ],
})
export class TestDetailComponent extends BaseDetail<Test> {
  testsStore = inject(TestsStore);

  modalCtrl = inject(ModalController);
  measurementUnitsStore = inject(MeasurementUnitsStore);
  filterMeasurementUnitText = model<string>('');

  close() {
    this.modalCtrl.dismiss();
  }

  @Input({ required: true }) set data(data: Test) {
    console.log('Test', data);
    this.item = data;
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

  override detailsForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.minLength(3),
    ]),
    measurementUnitId: new FormControl<number | undefined>(undefined, [
      Validators.required,
    ]),
    defaultMax: new FormControl<number | undefined>(undefined, [
      Validators.required,
    ]),
    defaultMin: new FormControl<number | undefined>(undefined, [
      Validators.required,
    ]),
  });

  override getSignalStore() {
    return this.testsStore;
  }

  override async save() {
    super.save();
    this.modalCtrl.dismiss();
  }
}
