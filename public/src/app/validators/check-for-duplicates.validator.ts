import { ValidatorFn, ValidationErrors, AbstractControl, FormArray } from '@angular/forms';

export function checkForDuplicatesValidator(key: string): ValidatorFn  {
  return (control: FormArray): ValidationErrors | null => {
    let duplicate = false;
    let arr = [];

    if (control && control.value && control.value.length > 1) {
      for (let i = 0; i < control.value.length; i++) {
        const val = control.value[i];
        if (val[key]) {
          arr.push(val[key].trim());
        }
      }

      if (arr.length > 1) {
        arr.sort();
        for (let i = 0; i < arr.length - 1; i++) {
          if (arr[i + 1] === arr[i]) {
            duplicate = true;
          }
        }
      }
    }

    return duplicate ? { 'duplicate': true } : null;
  };
}
