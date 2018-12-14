import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms'

export function requiredTrimWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let noField = true;

    if (control && control.value && control.value.trim()) {
      noField = false;
    }

    return noField ? {'requiredTrimWhitespace': true} : null;
  };
}

