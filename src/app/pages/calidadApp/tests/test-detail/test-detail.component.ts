import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  IonHeader,
  IonContent,
  IonTitle,
  IonButton,
  IonButtons,
  IonToolbar,
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonTextarea,
  IonFooter,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseDetail } from 'src/app/shared/base-detail';
import { Test } from 'feathers-dercosa';
import { TestsStore } from 'src/app/signalStores/stores/testsStore';

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
  ],
})
export class TestDetailComponent extends BaseDetail<Test> {
  testsStore = inject(TestsStore);

  modalCtrl = inject(ModalController);

  close() {
    this.modalCtrl.dismiss();
  }

  @Input({ required: true }) set data(data: Test) {
    console.log('Test', data);
    this.item = data;
  }

  override detailsForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.minLength(3),
    ]),
    measurementUnit: new FormControl<string | undefined>(undefined, [
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
