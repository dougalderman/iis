import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms'

export function optionsCorrectAnswerRequiredValidator(index): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
  let noCorrectAnswer = true;

  if (control && control.value && control.parent && control.parent.parent) {
    const previousArray: any[] = control.parent.parent.value;
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
