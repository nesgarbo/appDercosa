import { computed, inject, Injector, Signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, Observable } from 'rxjs';
import { asObservable, isToBeTranslated, Translatable } from './translatable';

export type MessageSeverity = 'success' | 'info' | 'warn' | 'error' | 'custom';

export interface InformOptions {
  key?: string;
  severity?: MessageSeverity;
  detail: Translatable;
  summary: Translatable;
  icon?: string;
}

/**
 * The function must be added as member of the class at construction time:
 * Pass a key (string) argument and will return an Observable of the translation
 * to the current active language
 * @returns A function that can be used at construction time
 * @usage
 * class MyClass {
 * private _getTranslation = translateFn();
 *  async getTranslation(key: string) {
 *  this._getTranslation(key).subscribe(translation => console.log('translation', translation));
 *  ...
 * }
 * }
 */
export const translateFn = (): ((key: string) => Observable<string>) => {
  const translate = inject(TranslateService);
  return (key: string) => translate.get(key);
};

export const translateNowFn = (): ((target: Translatable) => string) => {
  const translate = inject(TranslateService);
  return (target: Translatable) =>
    isToBeTranslated(target)
      ? translate.instant(target.translationKey, target.params)
      : target;
};

export const computedTranslation = (
  target: Signal<Translatable>,
  options?: { injector?: Injector }
) =>
  computed(() => {
    const translate =
      options?.injector?.get(TranslateService) || inject(TranslateService);
    const targetValue = target();
    return typeof targetValue === 'string'
      ? targetValue
      : (translate.instant(
          targetValue.translationKey,
          targetValue.params
        ) as string);
  });

export const computedTranslationFn = (): ((
  target: Signal<Translatable>
) => Signal<string>) => {
  const translate = inject(TranslateService);

  return (target: Signal<Translatable>) =>
    computed(() => {
      const targetValue = target();

      return typeof targetValue === 'string'
        ? targetValue
        : (translate.instant(
            targetValue.translationKey,
            targetValue.params
          ) as string);
    });
};

/**
 * The function must be added as member of the class at construction time:
 * Pass a Translatable argument (string | {translationKey: string})
 * and will return an Observable of the string or the translation key translated
 * to the current active language
 * @returns A function that can be used at construction time
 * @usage
 * class MyClass {
 * private _getTranslation = maybeTranslateFn();
 *  async getTranslation(key: Translatable) {
 *  this._getTranslation(key).subscribe(translation => console.log('translation', translation));
 *  ...
 * }
 * }
 */
export const maybeTranslateFn = (): ((
  key: Translatable
) => Observable<string>) => {
  const translate = inject(TranslateService);
  return (key: Translatable) => asObservable(key, translate);
};

/**
 * The function must be added as member of the class at construction time:
 * Pass the key (string) argument and will return a Promise of the key
 * translated to the current active language
 * @returns A function that can be used at construction time
 * @usage
 * class MyClass {
 * private _getTranslation = getTraslationFn();
 *  async getTranslation(key: string) {
 *  const myTranslation = await this._getTranslation(key);
 *  ...
 * }
 * }
 */
export const getTranslationFn = (): ((key: string) => Promise<string>) => {
  const translate = inject(TranslateService);
  return (key: string) => lastValueFrom(translate.get(key));
};

/**
 * The function must be added as member of the class at construction time:
 * Pass a Translatable argument (string | {translationKey: string})
 * and will return a Promise of the string or the translation key translated
 * to the current active language
 * @returns A function that can be used at construction time
 * @usage
 * class MyClass {
 * private _getTranslation = getMaybeTraslationFn();
 *  async getTranslation(key: Translatable) {
 *  const myTranslation = await this._getTranslation(key);
 *  ...
 * }
 * }
 */
export const getMaybeTraslationFn = (): ((
  key: Translatable
) => Promise<string>) => {
  const translate = inject(TranslateService);
  return (key: Translatable) => lastValueFrom(asObservable(key, translate));
};
