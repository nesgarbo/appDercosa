import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonButton,
  IonToolbar,
  IonItem,
  IonInput,
  IonAlert,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AppStore } from 'src/app/signalStores/stores/appStore';
import { BiometricService } from 'src/app/services/biometric.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonAlert,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonButton,
    IonInput,
  ],
})
export class LoginPage implements OnInit {
  constructor(
    private router: Router,
    private biometricService: BiometricService,
    private alertCtrl: AlertController
  ) {}

  @Input() returnUrl!: string;

  isBiometricDataStored = false;
  biometricAuthAvailable = false;
  useBiometricAuth = true;

  readonly appStore = inject(AppStore);

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.useBiometricAuthIfAvailable();
  }

  async checkIfBiometricDataIsStored() {
    this.isBiometricDataStored =
      await this.biometricService.isBiometricDataStored();
  }

  removeBiometricData() {
    this.biometricService.removeBiometricData();
  }

  async useBiometricAuthIfAvailable() {
    const credentials = await this.biometricService.unLock();
    if (credentials) {
      const { userName, password } = credentials;
      this.loginForm.controls['email'].setValue(userName);
      this.loginForm.controls['password'].setValue(password);
      this.onSubmit();
    }
  }

  async onSubmit() {
    console.log(this.loginForm.value);
    const { email, password } = this.loginForm.value;
    if (!email || !password) {
      return;
    }
    // const loading = await this.loadingCtrl.create({
    //   message: 'Autenticando...',
    // });
    // loading.present();
    const resp = await this.appStore
      .login({ email, password })
      .catch(async err => {
        console.log(err);
      });
    console.log(resp);
    // loading.dismiss();
    if (resp) {
      this.biometricService.updateBiometric(email, password);
      const homeUrl = this.appStore.user()?.appHomeUrl
      this.router.navigate([homeUrl || '/create']);
      return;
    }
    const a = await this.alertCtrl.create({
      header: 'Credenciales incorrectas',
      message: 'Vuelva a intentarlo.',
      buttons: ['Aceptar'],
    });
    a.present();
  }

  onRegister() {
    console.log('Register');
  }
}