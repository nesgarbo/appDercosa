import { inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { LanguageCode } from 'iso-639-1-dir/dist/data';
import { switchMap } from 'rxjs';
import {
  AppLanguages,
  LanguagesService,
} from '../../services/languages.service';
import { SyncfusionService } from '../../services/syncfusion/syncfusion.service';
import { withLocalStorageSync } from './with-local-storage-sync';
// import { PrimeNGConfig, Translation } from 'primeng/api';

export type LanguageState = { languageCode: AppLanguages };

export const setLanguage = (languageCode: AppLanguages) => ({ languageCode });

export const setAppLanguage = (
  languageCode: AppLanguages,
  translateService: TranslateService
) => {
  translateService.use(languageCode);
  console.log('Language changed to:', languageCode);
};

export const setCalendarCulture = (
  lang: LanguageCode,
  languagesService: LanguagesService,
  syncfusionService: SyncfusionService
) => {
  const culture = languagesService.getLanguageCulture(lang);
  syncfusionService.setCulture(culture);
};

export function withAppLanguage() {
  return signalStoreFeature(
    withState<LanguageState>({ languageCode: 'es' }),
    withLocalStorageSync('iconsigna-language'),
    withMethods(
      (
        store,
        translateService = inject(TranslateService),
        languagesService = inject(LanguagesService),
        syncfusionService = inject(SyncfusionService)
        // primeConfig = inject(PrimeNGConfig)
      ) => {
        return {
          setLanguage(languageCode: AppLanguages) {
            patchState(store, setLanguage(languageCode));
            setAppLanguage(languageCode, translateService);
            store.saveToLocalStorage({ languageCode });
            setCalendarCulture(
              languageCode,
              languagesService,
              syncfusionService
            );
          },
          connectPrimeLanguage: rxMethod<string>((languageCode$) =>
            languageCode$.pipe(
              switchMap((languageCode) =>
                translateService.getTranslation(languageCode)
              )
              // map(translation => translation.primeng as Translation),
              // tap(translation => {
              //   primeConfig.setTranslation(translation);
              // })
            )
          ),
        };
      }
    ),
    withHooks(
      (
        store,
        translateService = inject(TranslateService),
        languagesService = inject(LanguagesService),
        syncfusionService = inject(SyncfusionService)
      ) => {
        return {
          onInit() {
            store.loadFromLocalStorage();
            setAppLanguage(store.languageCode(), translateService);
            setCalendarCulture(
              store.languageCode(),
              languagesService,
              syncfusionService
            );
            const { languageCode, connectPrimeLanguage } = store;
            connectPrimeLanguage(languageCode);
          },
        };
      }
    )
  );
}
