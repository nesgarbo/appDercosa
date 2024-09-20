import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  L10n,
  loadCldr,
  registerLicense,
  setCulture,
} from '@syncfusion/ej2-base';
import { lastValueFrom } from 'rxjs';

// This part is executed despite the fact that the service is not used
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXZfeXVVR2FfWER1XkM='
);

@Injectable({ providedIn: 'root' })
export class SyncfusionService {
  private loadedCultures: string[] = [];
  private commonsLoaded = false;

  private async loadCommons() {
    if (this.commonsLoaded) {
      return;
    }
    this.commonsLoaded = true;
    await Promise.all(
      [
        `assets/i18n/calendar/cldr-data/numberingSystems.json`,
        `assets/i18n/calendar/cldr-data/weekData.json`,
      ].map((path) => this.loadCldr(path))
    );
  }

  private async loadCultureFiles(culture: string) {
    if (this.loadedCultures.indexOf(culture) > -1) {
      return; // Already loaded
    }

    this.loadedCultures.push(culture);

    await this.loadLocaleFiles(culture);

    if (culture === 'en-US') {
      // Default already loaded
      return;
    }

    await Promise.all(
      [
        `assets/i18n/calendar/cldr-data/${culture}/ca-gregorian.json`,
        `assets/i18n/calendar/cldr-data/${culture}/currencies.json`,
        `assets/i18n/calendar/cldr-data/${culture}/numbers.json`,
        `assets/i18n/calendar/cldr-data/${culture}/timeZoneNames.json`,
      ].map((path) => this.loadCldr(path))
    );
  }

  private async loadCldr(path: string) {
    loadCldr(await lastValueFrom(this.http.get(path)));
  }

  private async loadLocaleFiles(culture: string) {
    L10n.load(
      await lastValueFrom(
        this.http.get(`assets/i18n/calendar/locales/${culture}.json`)
      )
    );
  }

  public async setCulture(culture: string) {
    await this.loadCommons();
    await this.loadCultureFiles(culture);
    setCulture(culture);
  }

  constructor(private http: HttpClient) {}
}
