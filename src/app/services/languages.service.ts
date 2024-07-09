import { Injectable } from '@angular/core';
import {
  LanguageCode,
  LanguageName,
  LanguageNativeName,
} from 'iso-639-1-dir/dist/data';
import ISO6391 from 'iso-639-1-dir';
import { Locale, format, intervalToDuration } from 'date-fns';
import { es, enUS, fr } from 'date-fns/locale';

export interface Language {
  name?: LanguageName;
  nativeName?: LanguageNativeName;
  code: LanguageCode;
  cultureName: string;
}

export type Languages = 'es' | 'en' | 'fr';

export type AppLanguages = LanguageCode & Languages;

export const localeMap: Map<AppLanguages, Locale> = new Map([
  ['es', es],
  ['en', enUS],
  ['fr', fr],
]);

@Injectable({
  providedIn: 'root',
})
export class LanguagesService {
  public availableLanguagesCodes: AppLanguages[] = ['es', 'en', 'fr'];

  private availableLanguages: Language[];

  constructor() {
    this.availableLanguages = this.availableLanguagesCodes.map(code => ({
      code,
      nativeName: ISO6391.getNativeName(code),
      name: ISO6391.getName(code),
      cultureName: code === 'en' ? 'en-US' : code,
    }));
  }

  public getAvailableLanguages() {
    return this.availableLanguages;
  }

  public getLanguageCulture(languageCode: LanguageCode) {
    return (
      this.availableLanguages.find(language => language.code === languageCode)
        ?.cultureName || ''
    );
  }

  public formatLocaleDate(date: Date, languageCode: AppLanguages): string {
    const locale = localeMap.get(languageCode);
    if (locale) {
      return format(date, 'P', { locale });
    }
    return '';
  }
}