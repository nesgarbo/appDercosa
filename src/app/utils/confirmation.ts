import { inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, Observable, Observer } from 'rxjs';
import { asObservable, Translatable } from './translatable';

export interface ConfirmOptions {
  key?: string;
  message?: Translatable;
  header?: Translatable;
  icon?: string;
  acceptVisible?: boolean;
  acceptLabel?: Translatable;
  accept?: () => void;
  rejectVisible?: boolean;
  rejectLabel?: Translatable;
  reject?: () => void;
  confirmConditionFn?: () => boolean;
}

export function confirmationFn(): (options: ConfirmOptions) => void;
export function confirmationFn(
  useObservable: true
): (options: ConfirmOptions) => Observable<boolean>;
export function confirmationFn(
  useObservable?: boolean
): (options: ConfirmOptions) => unknown {
  const confirmationService = inject(AlertController);
  const translate = inject(TranslateService);
  async function _confirm(
    config: ConfirmOptions,
    observer?: Observer<boolean>
  ) {
    const alert = confirmationService.create({
      header: await lastValueFrom(asObservable(config.header!, translate)),
      message: await lastValueFrom(asObservable(config.message!, translate)),
      buttons: [
        {
          text: await lastValueFrom(
            asObservable(config.rejectLabel!, translate)
          ),
          role: 'cancel',
          handler: () => {
            if (observer) {
              observer.next(false);
              observer.complete();
            }
            if (config.reject) {
              config.reject();
            }
          },
        },
        {
          text: await lastValueFrom(
            asObservable(config.acceptLabel!, translate)
          ),
          role: 'confirm',
          handler: () => {
            if (observer) {
              observer.next(true);
              observer.complete();
            }
            if (config.accept) {
              config.accept();
            }
          },
        },
      ],
    });
    (await alert).present();
  }
  if (useObservable === true) {
    return (options: ConfirmOptions): Observable<boolean> => {
      return new Observable((observer: Observer<boolean>) => {
        _confirm(options, observer);
      });
    };
  } else {
    return (options: ConfirmOptions): void => {
      _confirm(options);
    };
  }
}
