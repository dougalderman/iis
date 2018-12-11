import { Injectable } from '@angular/core';
import { AsyncValidator, ValidationErrors, AbstractControl } from '@angular/forms'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QuizAdminService } from '../services/quiz-admin.service';
import { QuizTemplateData } from  '../../../../models/quizzes/data/quizTemplateData';

@Injectable()
export class CheckTemplateNameValidator implements AsyncValidator {
  constructor(private quizAdminService: QuizAdminService) {}

  validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (ctrl.value) {
      return this.quizAdminService.getQuizTemplateByName(ctrl.value).pipe(
        map(
          (template: QuizTemplateData[]) => {
            return template && template.length ? { templateNameTaken: true } : null;
          }),
          error => {
            console.error(error);
            return null;
          }
        );
    }
    else {
      return new Observable(() => null);
    }
  }
}
