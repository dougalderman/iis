import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TakeSurveyService {

  private surveyId: number = 0;

  constructor() { }

  getSurveyId() {
    return this.surveyId;
  }

  setSurveyId(id: number) {
    if (id) {
      this.surveyId = id;
    }
  }

  resetSurveyId() {
    this.surveyId = 0;
  }
}
