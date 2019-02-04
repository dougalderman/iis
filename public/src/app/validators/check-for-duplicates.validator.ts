import { ValidatorFn, ValidationErrors, AbstractControl, FormArray } from '@angular/forms';

export const checkForDuplicatesValidator: ValidatorFn = (control: FormArray):  ValidationErrors | null => {
  let duplicate = false;

  if (control && control.value && control.value.length > 1) {
    for (let i = 0; i < control.value.length && !duplicate; i++) {
      const val = control.value[i];
      if (val) {
        for (let j = 0; j < control.value.length; j++) {
          if (i !== j) {
            const val2 = control.value[j];
            if (val.option === val2.option) {
              duplicate = true;
              break;
            }
          }
        }
      }
    }
  }

  return duplicate ? { 'duplicate': true } : null;
};
