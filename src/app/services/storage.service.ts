import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {
    this.migrate();
  }

  private async migrate() {
    try {
      const resp = await Preferences.migrate();
      const removeResp = await Preferences.removeOld();
    } catch (error) {
      console.log('Storage migration error', error);
    }
  }

  private async set(key: any, value: any) {
    return await Preferences.set({ key, value })
      .then(val => {
        return true;
      })
      .catch(error => {
        return false;
      });
  }

  private async get(key: any, parse = false) {
    return await Preferences.get({ key })
      .then(data => {
        return parse ? JSON.parse(data.value!) : data.value;
      })
      .catch(error => {
        // return error;
        return undefined;
      });
  }

  private async remove(key: any) {
    return await Preferences.remove({ key })
      .then(value => {
        return true;
      })
      .catch(error => {
        return false;
      });
  }

  public async isSet(key: string) {
    const { keys } = await Preferences.keys();
    return !!keys.find(k => k === key);
  }

  private async secureSet(key: any, value: any) {
    if (!Capacitor.isNativePlatform()) {
      // console.log('Not available because not native');
      return false;
    }

    return await SecureStoragePlugin.set({ key, value })
      .then(val => {
        return true;
      })
      .catch(error => {
        return false;
      });
  }

  private async secureGet(key: any, parse = false) {
    if (!Capacitor.isNativePlatform()) {
      // console.log('Not available because not native');
      return undefined;
    }

    return await SecureStoragePlugin.get({ key })
      .then(data => {
        return parse ? JSON.parse(data.value) : data.value;
      })
      .catch(error => {
        // return error;
        return undefined;
      });
  }

  private async secureRemove(key: any) {
    if (!Capacitor.isNativePlatform()) {
      // console.log('Not available because not native');
      return false;
    }

    return await SecureStoragePlugin.remove({ key })
      .then(value => {
        return true;
      })
      .catch(error => {
        return false;
      });
  }

  async getSkipIntro(): Promise<boolean> {
    return await this.get('skipIntro', true);
  }

  async setSkipIntro(value: boolean) {
    return await this.set('skipIntro', value);
  }

  async getTerminalId(): Promise<string> {
    return await this.get('terminalId', false);
  }

  async setTerminalId(value: string) {
    return await this.set('terminalId', value);
  }

  async getReceivePush(): Promise<boolean> {
    return await this.get('receivePush', true);
  }

  async setPolicyAccepted(when: number) {
    return await this.set('policyAccepted', JSON.stringify(when));
  }

  async getPolicyAccepted(): Promise<Date | undefined> {
    const value = await this.get('policyAccepted', true);
    return value ? new Date(+value) : undefined;
  }

  async removePolicyAccepted() {
    await this.remove('policyAccepted');
  }

  async setReceivePush(value: boolean) {
    return await this.set('receivePush', JSON.stringify(value));
  }

  async setUILanguage(value: string) {
    return await this.set('UILanguage', value);
  }

  async getUILanguage(): Promise<string> {
    return await this.get('UILanguage', false);
  }

  async setUseBiometricAuth(value: boolean) {
    return await this.set('useBiometricAuth', JSON.stringify(value));
  }

  async getUseBiometricAuth(): Promise<boolean> {
    return await this.get('useBiometricAuth', true);
  }

  async removeUseBiometricAuth() {
    return await this.remove('useBiometricAuth');
  }

  async setUserName(value: string) {
    return await this.secureSet('userName', value);
  }

  async getUserName(): Promise<string> {
    return await this.secureGet('userName');
  }

  async removeUserName() {
    return await this.secureRemove('userName');
  }

  async setPassword(value: string) {
    return await this.secureSet('private', value);
  }

  async getPassword(): Promise<string> {
    return await this.secureGet('private');
  }

  async removePassword() {
    return await this.secureRemove('private');
  }

  async getDepartureTime() {
    return await this.get('departureTime', true);
  }

  async getReturnTime() {
    return await this.get('returnTime', true);
  }

  async setDepartureHours(hours: number[]) {
    return await this.set('departureHours', JSON.stringify(hours));
  }

  async getDepartureHours(): Promise<number[]> {
    const departureHours = await this.get('departureHours', true).catch(
      e => []
    );
    return this.arrayOrDefault(departureHours, [...Array(24).keys()]);
  }


  async setDepartureMinutes(minutes: number[]) {
    return await this.set('departureMinutes', JSON.stringify(minutes));
  }

  async getDepartureMinutes() {
    const departureMinutes = await this.get('departureMinutes', true).catch(
      e => []
    );
    return this.arrayOrDefault(departureMinutes, [0, 15, 30, 45]);
  }

  async setReturnHours(hours: number[]) {
    return await this.set('returnHours', JSON.stringify(hours));
  }

  async getReturnHours() {
    const returnHours = await this.get('returnHours', true).catch(e => []);
    return this.arrayOrDefault(returnHours, [...Array(24).keys()]);
  }

  async setReturnMinutes(minutes: number[]) {
    return await this.set('returnMinutes', JSON.stringify(minutes));
  }

  async getReturnMinutes() {
    const returnMinutes = await this.get('returnMinutes', true).catch(e => []);
    return this.arrayOrDefault(returnMinutes, [0, 15, 30, 45]);
  }

  arrayOrDefault(data: any, defaultValueToReturn: any[]): number[] {
    return Array.isArray(data) && data.length > 0 ? data : defaultValueToReturn;
  }

  async setMinPlanningItemsDate(value: string) {
    return await this.set('minPlanningItemsDate', value);
    /*
    const dateString = startOfServerTimezoneDay(value).toISOString();
    return await this.set('minPlanningItemsDate', dateString);
    */
  }

  async removeMinPlanningItemsDate() {
    return await this.remove('minPlanningItemsDate');
  }

  async setLastFCMToken(token: string) {
    return await this.set('lastFCMToken', token);
  }

  async getLastFCMToken() {
    return (await this.get('lastFCMToken')) || undefined;
  }
}