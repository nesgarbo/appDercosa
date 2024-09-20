import { FormGroup } from '@angular/forms';
import { Translatable } from '../utils/translatable';

export type ValidationMessage = {
  type: string;
  message: Translatable;
};

export type ValidationMessages<T> = {
  [Keys in keyof T]?: ValidationMessage[];
};

export type GetValidationMessagesType<T> =
  T extends FormGroup<infer R> ? ValidationMessages<R> : never;

// Orig
export type GetValidationMessagesType2<T> =
  T extends FormGroup<infer R>
    ? {
        [Keys in keyof R]?: ValidationMessage[];
      }
    : never;
