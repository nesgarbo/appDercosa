import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function testConditionalValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isBoolean = control.get('isBoolean')?.value;
        const defaultMax = control.get('defaultMax');
        const defaultMin = control.get('defaultMin');
        const booleanOkValue = control.get('booleanOkValue');
        const measurementUnitId = control.get('measurementUnitId');

        if (isBoolean) {
            // Validar booleanOkValue
            if (booleanOkValue?.value === null || booleanOkValue?.value === undefined) {
                booleanOkValue?.setErrors({ required: true });
                return { booleanOkValueRequired: true };
            } else {
                booleanOkValue?.setErrors(null);
            }

            // Quitar errores de defaultMax, defaultMin y measurementUnitId
            defaultMax?.setErrors(null);
            defaultMin?.setErrors(null);
            measurementUnitId?.setErrors(null);
        } else {
            let hasError = false;

            // Validar measurementUnitId
            if (!measurementUnitId?.value) {
                measurementUnitId?.setErrors({ required: true });
                hasError = true;
            } else {
                measurementUnitId?.setErrors(null);
            }

            // Validar defaultMax
            if (!defaultMax?.value) {
                defaultMax?.setErrors({ required: true });
                hasError = true;
            } else {
                defaultMax?.setErrors(null);
            }

            // Validar defaultMin
            if (!defaultMin?.value) {
                defaultMin?.setErrors({ required: true });
                hasError = true;
            } else {
                defaultMin?.setErrors(null);
            }

            // Quitar errores de booleanOkValue
            booleanOkValue?.setErrors(null);

            if (hasError) {
                return { requiredFieldsMissing: true };
            }
        }

        return null;
    };
}