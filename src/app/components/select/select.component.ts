import { Component, forwardRef, input, model } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { IonSelect, IonSelectOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [IonSelect, IonSelectOption, FormsModule],
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements ControlValueAccessor {
  label = input.required<string>();
  options = input.required<{ label: string; value: any }[]>();

  value = model<any>()
  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    console.log('writeValue', value);
    this.value.set(value)
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disabled state if needed
  }

  onValueChange(event: any) {
    this.value.set(event.detail.value)
    this.onChange(this.value);
    this.onTouched();
  }
}
