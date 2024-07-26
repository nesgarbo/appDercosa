import {
    patchState,
    signalStoreFeature,
    withHooks,
    withMethods,
    withState,
  } from '@ngrx/signals';
  import {
    AppLanguages,
    LanguagesService,
  } from '../../services/languages.service';
  import { inject } from '@angular/core';
  import { TranslateService } from '@ngx-translate/core';
  import { withLocalStorageSync } from './with-local-storage-sync';
  import { LanguageCode } from 'iso-639-1-dir/dist/data';
  
  export type LanguageState = { languageCode: AppLanguages };
  
  export const setLanguage = (languageCode: AppLanguages) => ({ languageCode });
  
  export const setAppLanguage = (
    languageCode: AppLanguages,
    translateService: TranslateService
  ) => {
    translateService.use(languageCode);
  };
  
  export const setCalendarCulture = (
    lang: LanguageCode,
    languagesService: LanguagesService
  ) => {
    const culture = languagesService.getLanguageCulture(lang);
  };
  
  export function withAppLanguage() {
    return signalStoreFeature(
      withState<LanguageState>({ languageCode: 'es' }),
      withLocalStorageSync('iconsigna-language'),
      withMethods(
        (
          store,
          translateService = inject(TranslateService),
          languagesService = inject(LanguagesService)
        ) => {
          return {
            setLanguage(languageCode: AppLanguages) {
              patchState(store, setLanguage(languageCode));
              setAppLanguage(languageCode, translateService);
              store.saveToLocalStorage({ languageCode });
              setCalendarCulture(
                languageCode,
                languagesService
              );
            },
          };
        }
      ),
      withMethods(({languageCode}, languagesService = inject(LanguagesService) ) => ({
        dateToCurrentLocale: (date: Date) => date.toLocaleString(languageCode()),
        intervalLocale: (start: Date, end: Date) => {
          const startAtLocale = start.toLocaleString(languageCode());
          const endAtLocale = end.toLocaleString(languageCode());
          return { startAtLocale, endAtLocale };
        }
      })),
      withHooks(
        (
          store,
          translateService = inject(TranslateService),
          languagesService = inject(LanguagesService)
        ) => {
          return {
            onInit() {
              store.loadFromLocalStorage();
              setAppLanguage(store.languageCode(), translateService);
              setCalendarCulture(
                store.languageCode(),
                languagesService
              );
            },
          };
        }
      )
    );
  }