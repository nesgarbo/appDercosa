import { Component, input, model, signal, viewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  DatetimeChangeEventDetail,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
} from '@ionic/angular/standalone';
import { IonDatetimeCustomEvent } from '@ionic/core';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-timezoned-datetimepicker',
  templateUrl: './timezoned-datetimepicker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TimezonedDatetimepickerComponent,
      multi: true,
    },
  ],
  standalone: true,
  imports: [IonModal, IonDatetimeButton, IonDatetime, FormsModule],
  styleUrls: ['./timezoned-datetimepicker.component.scss'],
})
export class TimezonedDatetimepickerComponent implements ControlValueAccessor {
  componentId = uuid();

  presentation = input<
    | 'date'
    | 'date-time'
    | 'month'
    | 'month-year'
    | 'time'
    | 'time-date'
    | 'year'
  >('date-time');

  closeOnSelect = input<boolean>(true);

  component = viewChild<IonDatetime | null>('iondatetime');
  modal = viewChild<IonModal | null>(IonModal);

  date = model<string>(new Date().toISOString());

  private onChange = (value: string) => {};
  private onTouched = () => {};

  private readonly touched = signal<boolean>(false);
  readonly disabled = signal<boolean>(false);

  writeValue(value: string): void {
    this.date.set(this.toDateTimezoned(new Date(value)));
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }

  private markAsTouched() {
    if (!this.touched()) {
      this.onTouched();
      this.touched.set(true);
    }
  }

  dateChanged(event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>) {
    const value = event.detail.value;
    this.onChange(new Date(value as string).toISOString());
    this.markAsTouched();
    if (this.closeOnSelect()) {
      this.modal()?.dismiss();
    }
  }
  // https://forum.ionicframework.com/t/how-can-i-change-timezone-offset-on-ionic-datetime/88090/3
  private toDateTimezoned(date: Date) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString();
  }
}
