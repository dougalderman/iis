import { Injectable } from '@angular/core';
import { AsyncValidator, ValidationErrors, AbstractControl } from '@angular/forms'
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { QuizAdminService } from '../services/quiz-admin.service';

@Injectable({
  providedIn: 'root',
})
export class CheckTemplateNameValidator implements AsyncValidator {
  constructor(private quizAdminService: QuizAdminService) {}

  validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if ((ctrl.dirty || ctrl.touched) && ctrl.value && ctrl.value.trim()) {
      return this.quizAdminService.isQuizTemplateNameTaken(ctrl.value.trim()).pipe(
        map((isTaken: boolean) => {
          return isTaken ? { templateNameTaken: true } : null;
        }),
        catchError(err => {
          console.error(err);
          return null;
        })
      );
    }
    else {
      return of(null);
    }
  }
}
