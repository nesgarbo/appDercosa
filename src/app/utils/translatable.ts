import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

export type ToBeTranslated = {
  translationKey: string;
  params?: any;
};

export type Translatable = string | ToBeTranslated;

export function isToBeTranslated(value: Translatable): value is ToBeTranslated {
  return typeof value !== 'string' && 'translationKey' in value;
}

export function asObservable(
  data: Translatable,
  translate: TranslateService
): Observable<string> {
  return isToBeTranslated(data)
    ? translate.get(data.translationKey, data.params || {})
    : of(data);
}
