import { Component, computed, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Translatable,
  isToBeTranslated,
} from '../../utils/translatable';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-form-validation-messages',
  templateUrl: './form-validation-messages.component.html',
  styleUrls: ['./form-validation-messages.component.scss'],
  standalone: true,
  imports: [IonIcon, CommonModule],
})
export class FormValidationMessagesComponent {
  //public validationMessage = input.required();

  public validationMessage = signal<Translatable>('');

  public readonly translation = computed(() => {
    const message = this.validationMessage();
    return isToBeTranslated(message)
      ? (this.translate.instant(
          message.translationKey,
          message.params || {}
        ) as string)
      : message;
  });

  constructor(public translate: TranslateService) {
    addIcons({ informationCircleOutline });
  }
}
