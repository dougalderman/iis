import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms'

export function checkForDuplicatesValidator(type, index): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let duplicate = false;

    if (control && control.value && control.parent && control.parent.parent) {
      const val = control.value.trim().toLowerCase();
      const arr: any[] = control.parent.parent.value;
      for (let i = 0; i < arr.length; i++) {
        let previousVal = arr[i][type];
        if (previousVal) {
          previousVal = previousVal.trim().toLowerCase();
        }
        if (i !== index && val === previousVal) {
          duplicate = true;
        }
      }
    }

    return duplicate ? {'duplicate': {value: control.value}} : null;
  };
}

