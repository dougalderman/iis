import { ValidatorFn, AbstractControl } from '@angular/forms'

export function checkForDuplicatesValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const duplicate = false;
    return duplicate ? {'duplicate': {value: control.value}} : null;
  };
}
