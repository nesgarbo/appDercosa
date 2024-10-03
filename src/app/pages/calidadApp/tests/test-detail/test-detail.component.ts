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
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Test } from 'feathers-dercosa';
import { IonicSelectableComponent } from 'ionic-selectable';
import { SearchableSelectComponent } from 'src/app/components/searchable-select/searchable-select.component';
import { SelectComponent } from 'src/app/components/select/select.component';
import { BaseDetail } from 'src/app/shared/base-detail';
import { MeasurementUnitsStore } from 'src/app/signalStores/stores/measurementUnitsStore';
import { TestsStore } from 'src/app/signalStores/stores/testsStore';
import { testConditionalValidator } from 'src/app/validators/testConditionalValidator';

@Component({
  selector: 'app-tests',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.scss'],
  standalone: true,
  imports: [
    IonToggle,
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
    IonSelectOption,
    SelectComponent,
  ],
})
export class TestDetailComponent
  extends BaseDetail<Test>
  implements AfterViewInit
{
  testsStore = inject(TestsStore);

  modalCtrl = inject(ModalController);
  measurementUnitsStore = inject(MeasurementUnitsStore);
  filterMeasurementUnitText = model<string>('');
  isBoolean = model<boolean>(false);

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

  override detailsForm = new FormGroup(
    {
      name: new FormControl<string | undefined>(undefined, [
        Validators.required,
        Validators.minLength(3),
      ]),
      measurementUnitId: new FormControl<number | undefined>(undefined),
      defaultMax: new FormControl<number | undefined>(undefined),
      defaultMin: new FormControl<number | undefined>(undefined),
      isBoolean: new FormControl<boolean>(false, [Validators.required]),
      booleanOkValue: new FormControl<boolean | undefined>(undefined),
    },
    { validators: testConditionalValidator() }
  );

  formValue = toSignal(this.detailsForm.valueChanges, {
    initialValue: this.detailsForm.value,
  });

  booleanChanged = effect(() => {
    const isBoolean = this.isBoolean();
    untracked(() => {
      const booleanOkValueControl = this.detailsForm.get('booleanOkValue');
      console.log('booleanOkValueControl', booleanOkValueControl);
      if (!isBoolean) {
        booleanOkValueControl?.setValue(undefined);
        booleanOkValueControl?.markAsPristine();
      } else {
        const measurementUnitIdControl =
          this.detailsForm.get('measurementUnitId');
        const defaultMaxControl = this.detailsForm.get('defaultMax');
        const defaultMinControl = this.detailsForm.get('defaultMin');

        measurementUnitIdControl?.setValue(undefined);

        defaultMaxControl?.setValue(undefined);
        defaultMaxControl?.markAsPristine();

        defaultMinControl?.setValue(undefined);
        defaultMinControl?.markAsPristine();
      }
      this.detailsForm.get('isBoolean')?.setValue(isBoolean);
    });
  });

  override getSignalStore() {
    return this.testsStore;
  }

  ngAfterViewInit() {
    if (
      this.detailsForm.get('isBoolean')?.value !== null &&
      this.detailsForm.get('isBoolean')?.value !== undefined
    ) {
      this.isBoolean.set(this.detailsForm.get('isBoolean')!.value!);
    }
  }

  override async save() {
    super.save();
    this.modalCtrl.dismiss();
  }
}
