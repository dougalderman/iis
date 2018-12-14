import { ValidatorFn, ValidationErrors, FormArray } from '@angular/forms'

export const optionsCorrectAnswerRequiredValidator: ValidatorFn = (control: FormArray):  ValidationErrors | null => {
  let noCorrectAnswer = true;

  if (control && control.value && control.value.length) {
    for (let option of control.value) {
      if (option.optionCorrectAnswer) {
        noCorrectAnswer = false;
        break;
      }
    }
  }

  return noCorrectAnswer ? { 'noOptionsCorrectAnswer': true } : null;
};
