import { ValidatorFn, ValidationErrors, FormArray, ControlContainer } from '@angular/forms';

export const numericRangeValidator: ValidatorFn = (control: FormArray):  ValidationErrors | null => {
  let numericRangeIncorrect = true;

  if (control && control.value && typeof control.value.numericLowRange === 'number' &&
    typeof control.value.numericHighRange === 'number') {
    if (control.value.numericLowRange > 0 && control.value.numericHighRange > control.value.numericLowRange) {
      numericRangeIncorrect = false;
    }
  }
  else {
    numericRangeIncorrect = false;
  }

  return numericRangeIncorrect ? { 'numericRangeIncorrect': true } : null;
};

