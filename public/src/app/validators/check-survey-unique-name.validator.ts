import { Injectable } from '@angular/core';
import { AsyncValidator, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { SurveyAdminService } from '../services/survey-admin.service';

@Injectable({
  providedIn: 'root'
})
export class CheckSurveyUniqueNameValidator implements AsyncValidator {
  constructor(private surveyAdminService: SurveyAdminService) {}

  validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (ctrl.value && ctrl.value.trim()) {
      return this.surveyAdminService.isSurveyUniqueNameTaken(ctrl.value.trim()).pipe(
        map((isTaken: boolean) => {
          return isTaken ? { surveyUniqueNameTaken: true } : null;
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
