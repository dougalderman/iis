import { ValidatorFn, AbstractControl } from '@angular/forms'

export function checkForDuplicatesValidator(type, index): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    let duplicate = false;
    const val = control.value;

    if (control && control.value && control.parent && control.parent.parent) {
      const previousArray: any[] = control.parent.parent.value;
      for (let i = 0; i < previousArray.length; i++) {
        if (i !== index && val === previousArray[i][type]) {
          duplicate = true;
        }
      }
    }

    return duplicate ? {'duplicate': {value: val}} : null;
  };
}

