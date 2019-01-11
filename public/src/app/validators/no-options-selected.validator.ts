import { ValidatorFn, ValidationErrors, FormArray } from '@angular/forms'

export const noOptionsSelectedValidator: ValidatorFn = (control: FormArray):  ValidationErrors | null => {
  let noOptionsSelected = true;

  if (control && control.value && control.value.length > 1) {
    for (let option of control.value) {
      if (option.optionSelect) {
        noOptionsSelected = false;
        break;
      }
    }
  }
  else {
    noOptionsSelected = false;
  }

  return noOptionsSelected ? { 'noOptionsSelected': true } : null;
};

