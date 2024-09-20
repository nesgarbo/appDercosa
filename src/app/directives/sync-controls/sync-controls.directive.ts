import {
  DestroyRef,
  Directive,
  Injector,
  OnInit,
  Type,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControlDirective,
  FormControlName,
} from '@angular/forms';

/**
 * Two formControlName bound to same FormControl are not updated without ngModel
 *
 * https://github.com/angular/angular/issues/10036
 * https://github.com/angular/angular/issues/10036#issuecomment-395432940
 */

@Directive({
  selector: '[syncControls]',
  standalone: true,
})
export class SyncControlsDirective implements OnInit {
  private destroyRef = inject(DestroyRef);

  constructor(private injector: Injector) {}

  ngOnInit() {
    const control = this.getControl();

    if (!control) {
      return;
    }

    control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        control.setValue(value, { emitEvent: false });
      });
  }

  getControl(): AbstractControl | undefined {
    const formControlName = this.injector.get(FormControlName, null, {
      optional: true,
      self: true,
    });
    if (formControlName) {
      return formControlName.control;
    }
    const formControlDirective = this.injector.get(FormControlDirective, null, {
      optional: true,
      self: true,
    });
    if (formControlDirective) {
      return formControlDirective.control;
    }
    return undefined;
  }
}
