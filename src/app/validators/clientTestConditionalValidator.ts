import { inject } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Test } from 'feathers-dercosa';
import { TestsStore } from '../signalStores/stores/testsStore';

export function clientTestConditionalValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const testsStore = inject(TestsStore);
        const testId = control.get('testId')?.value;
        const booleanOkValue = control.get('booleanOkValue');
        const measurementUnitId = control.get('measurementUnitId');
        const clientMax = control.get('clientMax');
        const clientMin = control.get('clientMin');
        return testsStore.get(testId).then((test: Test) => {
            if (test.isBoolean) {
                if (
                    booleanOkValue?.value === null ||
                    booleanOkValue?.value === undefined
                ) {
                    booleanOkValue?.setErrors({ required: true });
                    return { booleanOkValueRequired: true };
                } else {
                    booleanOkValue?.setErrors(null);
                }
            } else {
                let hasError = false;
                if (!measurementUnitId?.value) {
                    measurementUnitId?.setErrors({ required: true });
                    hasError = true;
                } else {
                    measurementUnitId?.setErrors(null);
                }
                if (!clientMax?.value) {
                    clientMax?.setErrors({ required: true });
                    hasError = true;
                } else {
                    clientMax?.setErrors(null);
                }
                if (!clientMin?.value) {
                    clientMin?.setErrors({ required: true });
                    hasError = true;
                } else {
                    clientMin?.setErrors(null);
                }
                if (hasError) {
                    return { measurementFieldsRequired: true };
                }
            }
            return null;
        });
    };
}
