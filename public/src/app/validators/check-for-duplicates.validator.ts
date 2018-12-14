import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms'

export function checkForDuplicatesValidator(type, index): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let duplicate = false;

    if (control && control.value && control.parent && control.parent.parent) {
      const val = control.value.trim().toLowerCase();
      const previousArray: any[] = control.parent.parent.value;
      for (let i = 0; i < previousArray.length; i++) {
        let previousVal = previousArray[i][type];
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

