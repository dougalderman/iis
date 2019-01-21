import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SurveyAnswerModel } from  '../../../../models/surveys/survey-answer.model';
import { SurveyResultModel } from '../../../../models/surveys/survey-result.model';

@Injectable({
  providedIn: 'root'
})
export class TakeSurveyService {

  private surveyId: number = 0;
  private surveyAnswersUrl = '/api/survey_answers';
  private surveyResultsUrl = '/api/survey_results';

  constructor(
    private http: HttpClient
  ) {}

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

  randomizeArray(arr: any[]): any[] {
    /*
    * Randomize array element order in-place.
    * Using Durstenfeld shuffle algorithm.
    */
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }

    return arr;
  }

  saveNewSurveyAnswer(answerData: SurveyAnswerModel): Observable<any> {
    if (answerData) {
      return this.http.post(this.surveyAnswersUrl, answerData);
    }
  }

  saveNewSurveyResult(resultData: SurveyResultModel): Observable<any> {
    if (resultData) {
      return this.http.post(this.surveyResultsUrl, resultData);
    }
  }
}
