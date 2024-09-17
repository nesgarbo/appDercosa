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
import { TestResult } from 'feathers-dercosa';
import { IonicSelectableComponent } from 'ionic-selectable';
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
  testsStore = inject(TestsStore);

  modalCtrl = inject(ModalController);

  filterTestText = model<string>('');
  testOptions = computed(() => {
    const filterTestText = this.filterTestText();
    const tests = this.testsStore
      .entities()
      .filter((t) => t?.name.toLowerCase().includes(filterTestText))
      .map((t) => ({
        ...t,
        id: 'test' + t.id,
      }));
    const clientTests = this.clientTestsStore
      .entities()
      .map((t) => ({
        ...t,
        name: t.test.name + ' de ' + t.client.nombrecli,
        id: 'clientTest' + t.id,
      }))
      .filter((t) => t?.name.toLowerCase().includes(filterTestText));
    console.log(clientTests);
    return untracked(() => {
      return [...clientTests, ...tests];
    });
  });

  customId = model<string>('');

  customIdEffect = effect(() => {
    console.log('customIdEffect', this.customId());
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

  close() {
    this.modalCtrl.dismiss();
  }

  @Input({ required: true }) set data(data: TestResult) {
    console.log('Test', data);
    this.item = data;
    this.customId.set(data.testType === 'clientTest' ? 'c' + data.testId : data.testId.toString());
    console.log('CustomId', this.customId());
  }

  result?: number | undefined;

  override detailsForm = new FormGroup({
    partida: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(5),
    ]),
    measurementUnit: new FormControl<string | undefined>(undefined, [
      Validators.required,
    ]),
    testId: new FormControl<number | undefined>(undefined, [
      Validators.required,
    ]),
    testType: new FormControl<string | undefined>(undefined, [
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

  onTestChange(e: { component: IonicSelectableComponent; value: any }) {
    const isClientTest = e.value.id.startsWith('c');
    const testId = isClientTest
      ? Number(e.value.id.substr(10))
      : Number(e.value.id.substr(4));
    const testType = isClientTest ? 'clientTest' : 'test';
    const measurementUnit = isClientTest
      ? e.value.test.measurementUnit
      : e.value.measurementUnit;

    this.detailsForm.controls['testId'].setValue(testId);
    this.detailsForm.controls['testType'].setValue(testType);
    this.detailsForm.controls['measurementUnit'].setValue(measurementUnit);
    console.log('CustomId', this.customId());
  }
}
