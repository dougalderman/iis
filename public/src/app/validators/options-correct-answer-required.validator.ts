import { ValidatorFn, ValidationErrors, FormArray } from '@angular/forms';

export const optionsCorrectAnswerRequiredValidator: ValidatorFn = (control: FormArray):  ValidationErrors | null => {
  let noCorrectAnswer = true;

  if (control && control.value && control.value.length > 1) {
    for (let option of control.value) {
      if (option.optionCorrectAnswer) {
        noCorrectAnswer = false;
        break;
      }
    }
  }
  else {
    noCorrectAnswer = false;
  }

  return noCorrectAnswer ? { 'noOptionsCorrectAnswer': true } : null;
};

