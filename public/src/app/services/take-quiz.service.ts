import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { QuizAnswerModel } from  '../../../../models/quizzes/quiz-answer.model';
import { QuizResultModel } from '../../../../models/quizzes/quiz-result.model';
import { QuizResultDataModel } from '../../../../models/quizzes/data/quiz-result-data.model';

@Injectable({
  providedIn: 'root'
})
export class TakeQuizService {

  private quizId: number = 0;
  private quizAnswersUrl = '/api/quiz_answers';
  private quizResultsUrl = '/api/quiz_results';
  private quizResultsReadByQuizIdUrl = '/api/quiz_results/quiz_id'

  constructor(
    private http: HttpClient
  ) { }

  getQuizId() {
    return this.quizId;
  }

  setQuizId(id: number) {
    if (id) {
      this.quizId = id;
    }
  }

  resetQuizId() {
    this.quizId = 0;
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

  saveNewQuizAnswer(answerData: QuizAnswerModel): Observable<any> {
    if (answerData) {
      return this.http.post(this.quizAnswersUrl, answerData);
    }
  }

  saveNewQuizResult(resultData: QuizResultModel): Observable<any> {
    if (resultData) {
      return this.http.post(this.quizResultsUrl, resultData);
    }
  }
}
