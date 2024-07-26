import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from './storage.service';
import { AlertsService } from './alerts.service';
import { NativeBiometric } from 'capacitor-native-biometric';

export interface Credentials {
  userName: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class BiometricService {
  subscriptions = new Subscription();
  storage = inject(StorageService);
  alerts = inject(AlertsService);

  isAvailable(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const { isAvailable } = await NativeBiometric.isAvailable().catch(() => ({
        isAvailable: false,
      }));
      resolve(isAvailable);
    });
  }

  async unLock(): Promise<Credentials | undefined> {
    return new Promise(async (resolve) => {
      const isAvailable = await this.isAvailable();

      if (!isAvailable) {
        return resolve(undefined);
      }

      const biometric = await this.storage.getUseBiometricAuth();

      if (!biometric) {
        return resolve(undefined);
      }
      const userName = await this.storage.getUserName();
      const password = await this.storage.getPassword();
      if (!(userName && password)) {
        await this.alerts.checkPass();
        return resolve(undefined);
      }

      try {
        await NativeBiometric.verifyIdentity({
          reason: "Login",
        });
      } catch (error) {
        return resolve(undefined);
      }

      return resolve({ userName, password });
    });
  }

  async updateBiometric(userName: string, password: string) {
    console.log('updateBiometric');
    const isAvailable = await this.isAvailable();
    if (!isAvailable) {
      return;
    }
    const biometric = await this.storage.getUseBiometricAuth();
    if (!biometric) {
      const useBiometric = await this.alerts.confirmBiometric();
      if (useBiometric) {
        await this.storage.setUserName(userName);
        await this.storage.setPassword(password);
        await this.storage.setUseBiometricAuth(true);
      }
    }
    if (biometric) {
      const oldUserName = await this.storage.getUserName();
      const oldPassword = await this.storage.getPassword();
      if (oldUserName !== userName || oldPassword !== password) {
        const saveNewCredentials = await this.alerts.saveNewCredentials();
        if (saveNewCredentials) {
          await this.storage.setUserName(userName);
          await this.storage.setPassword(password);
        }
      }
    }
  }

  async removeBiometricData() {
    await this.storage.removeUserName();
    await this.storage.removePassword();
    await this.storage.removeUseBiometricAuth();
  }

  async isBiometricDataStored() {
    return await this.storage.getUseBiometricAuth();
  }
}