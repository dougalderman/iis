import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { QuizTemplate } from  '../../../../models/quizzes/quizTemplate';

@Injectable()
export class AdminService {

  private quizTemplatesUrl = '/api/admin/quiz_templates';  // URL to web api

  constructor(
    private http: HttpClient
  ) {}

  getAllQuizTemplates(): Observable<QuizTemplate[]> {
    return this.http.get<QuizTemplate[]>(this.quizTemplatesUrl)
    .pipe(
      catchError(this.handleError('getAllTemplates', []))
    );
  }

   /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
