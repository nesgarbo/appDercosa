import { Injectable, inject } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  subscriptions = new Subscription();
  translations = inject(TranslateService);

  constructor(
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private translate: TranslateService
  ) {}

  public async checkPass() {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: 'LOGIN',
        subHeader: this.translations.instant('PLEASE_ENTER_YOUR_CREDENTIALS'),
        buttons: [
          {
            text: this.translations.instant('CANCEL'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: async () => {
              resolve(false);
            },
          },
          {
            text: this.translations.instant('CONFIRM'),
            handler: async (pass) => {
              resolve(true);
            },
          },
        ],
      });

      alert.present();
    });
  }

  public async toastError(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: 'danger',
      animated: true,
      position: 'bottom',
    });
    toast.present();
  }

  public async toastInfo(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      color: 'primary',
      animated: true,
      position: 'bottom',
    });
    toast.present();
  }

  public confirmBiometric() {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: this.translations.instant('USE_BIOMETRIC'),
        message: this.translations.instant('DO_YOU_WANT_TO_USE_BIOMETRIC_AUTHENTICATION?'),
        buttons: [
          {
            text: this.translations.instant('NO'),
            role: 'cancel',
            cssClass: 'primary',
            handler: async (c) => {
              resolve(false);
            },
          },
          {
            text: this.translations.instant('YES'),
            handler: async (o) => {
              this.toastInfo(this.translations.instant('NOW_YOU_CAN_USE_BIOMETRIC'));
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  public saveNewCredentials() {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: this.translations.instant('NEW_CREDENTIALS'),
        message: this.translations.instant('DO_YOU_WANT_TO_UPDATE_THE_STORED_CREDENTIALS'),
        buttons: [
          {
            text: this.translations.instant('NO'),
            role: 'cancel',
            cssClass: 'primary',
            handler: async (c) => {
              resolve(false);
            },
          },
          {
            text: this.translations.instant('YES'),
            handler: async (o) => {
              this.toastInfo(this.translations.instant('CREDENTIALS_UPDATED'));
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  presentSumUpAlert(description: string): Promise<{ amount: number; cancel: boolean; description: string }> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: this.translations.instant('CREDIT_CARD_PAYMENT'),
        message: this.translations.instant('PLEASE_ENTER_AMOUNT_AND_CHARGE_DESCRIPTION'),
        cssClass: 'reason-alert',
        inputs: [
          {
            name: 'amount',
            type: 'number',
            placeholder: this.translations.instant('AMOUNT'),
          },
          {
            name: 'description',
            type: 'text',
            value: description,
            placeholder: this.translations.instant('PAYMENT_DESCRIPTION'),
          },
        ],
        buttons: [
          {
            text: this.translations.instant('CANCEL'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve({ amount: 0, cancel: true, description: '' });
            },
          },
          {
            text: this.translations.instant('CONFIRM'),
            handler: (alertData) => {
              console.log('alertData', alertData);
              resolve({ amount: +alertData.amount, cancel: false, description: alertData.description });
            },
          },
        ],
      });

      await alert.present();
    });
  }

  public async loginFailed(errorMessage: string) {
    const alert = await this.alertCtrl.create({
      header: this.translations.instant('LOGIN_FAILED_TITLE'),
      // subHeader: this.translations.instant('LOGIN_FAILED_SUBTITLE'),
      cssClass: 'confirm-with-message',
      message: errorMessage,
      buttons: ['OK'],
    });
    alert.present();
  }

  presentReasonAlert(): Promise<{ reason: string; cancel: boolean }> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: this.translations.instant('REJECTION_REASON'),
        cssClass: 'reason-alert',
        inputs: [
          {
            name: 'reason',
            type: 'textarea',
            placeholder: this.translations.instant('PLEASE_WRITE_REJECTION_REASON_OPTIONAL'),
          },
        ],
        buttons: [
          {
            text: this.translations.instant('CANCEL'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve({ reason: '', cancel: true });
            },
          },
          {
            text: this.translations.instant('CONFIRM'),
            handler: (alertData) => {
              resolve({ reason: alertData.reason, cancel: false });
            },
          },
        ],
      });

      await alert.present();
    });
  }

  presentDescriptionAlert(): Promise<{ description: string; isOk: boolean }> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: this.translations.instant('DESCRIPTION_OR_REF'),
        message: this.translations.instant('PLEASE_ENTER_DESCRIPTION_AND_CONFIRM'),
        cssClass: 'description-alert',
        inputs: [
          {
            name: 'description',
            type: 'textarea',
            placeholder: this.translations.instant('YOUR_DESCRIPTION'),
          },
        ],
        buttons: [
          {
            text: this.translations.instant('CANCEL'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              this.toastInfo(this.translations.instant('CANCELLED'));
              resolve({ description: '', isOk: false });
            },
          },
          {
            text: this.translations.instant('CONFIRM'),
            handler: (alertData) => {
              resolve({ description: alertData.description, isOk: true });
            },
          },
        ],
      });

      await alert.present();
    });
  }

  presentTerminalIdAlert(): Promise<{ identifier: number; isOk: boolean }> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: this.translations.instant('MOBILE_REGISTRATION'),
        message: this.translations.instant('MOBILE_IDENTIFIER'),
        cssClass: 'inputs-alert',
        inputs: [
          {
            name: 'id',
            type: 'number',
          },
        ],
        buttons: [
          {
            text: this.translations.instant('CANCEL'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              this.toastInfo(this.translations.instant('CANCELLED'));
              resolve({ identifier: 999, isOk: false });
            },
          },
          {
            text: this.translations.instant('CONFIRM'),
            handler: (alertData) => {
              resolve({ identifier: alertData.id, isOk: true });
            },
          },
        ],
      });

      await alert.present();
    });
  }

  async infoAlert(message: string, header: string = this.translations.instant('WARNING')) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      cssClass: 'confirm-with-message',
      buttons: ['Ok'],
    });

    await alert.present();
    return alert;
  }

  async noAvailabilityAlert() {
    return this.infoAlert(this.translations.instant('NO_AVAILABILITY'));
  }

  public confirmWithMessage(
    header: string,
    message: string,
    yesToastMsg?: string,
    noToastMsg?: string
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: header,
        cssClass: 'confirm-with-message',
        message: message,
        buttons: [
          {
            text: this.translations.instant('NO'),
            role: 'cancel',
            cssClass: 'primary',
            handler: async (c) => {
              if (noToastMsg) {
                this.toastInfo(noToastMsg);
              }
              resolve(false);
            },
          },
          {
            text: this.translations.instant('YES'),
            handler: async (o) => {
              if (yesToastMsg) {
                this.toastInfo(yesToastMsg);
              }
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  public confirmRequestApproval(
    header: string,
    message: string,
    yesToastMsg?: string,
    noToastMsg?: string,
    cancelToastMsg?: string
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: header,
        cssClass: 'confirm-alert',
        message: message,
        buttons: [
          {
            text: this.translations.instant('CANCEL'),
            role: 'cancel',
            cssClass: 'primary',
            handler: async (c) => {
              if (cancelToastMsg) {
                this.toastInfo(cancelToastMsg);
              }
              resolve(false);
            },
          },
          {
            text: this.translations.instant('NO'),
            cssClass: 'primary',
            handler: async (c) => {
              if (noToastMsg) {
                this.toastInfo(noToastMsg);
              }
              resolve(false);
            },
          },
          {
            text: this.translations.instant('YES'),
            handler: async (o) => {
              if (yesToastMsg) {
                this.toastInfo(yesToastMsg);
              }
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  public presentCreateCredentialsConfirmAlert(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: this.translations.instant('CREATE_AND_SEND_CREDENTIALS'),
        cssClass: 'confirm-alert',
        buttons: [
          {
            text: this.translations.instant('NO'),
            role: 'cancel',
            cssClass: 'primary',
            handler: async (c) => {
              resolve(false);
            },
          },
          {
            text: this.translations.instant('YES'),
            handler: async (o) => {
              this.toastInfo(this.translations.instant('CREDENTIALS_SENT'));
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  public confirmPush(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: this.translations.instant('ENABLE_NOTIFICATIONS'),
        message: this.translations.instant('DO_YOU_WANT_TO_RECEIVE_NOTIFICATIONS?_YOU_CAN_DISABLE_THEM_WHENEVER_YOU_WANT'),
        buttons: [
          {
            text: this.translations.instant('NO'),
            role: 'cancel',
            cssClass: 'primary',
            handler: async (c) => {
              resolve(false);
            },
          },
          {
            text: this.translations.instant('YES'),
            handler: async (o) => {
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  public confirmUpdateApp(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('APP_UPDATED'),
        message: this.translate.instant('THE_APP_WAS_UPDATED_IN_BACKGROUND.RELOAD_NOW?'),
        buttons: [
          {
            text: this.translate.instant('NO'),
            role: 'cancel',
            cssClass: 'primary',
            handler: async (c) => {
              resolve(false);
            },
          },
          {
            text: this.translate.instant('YES'),
            handler: async (o) => {
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }
}