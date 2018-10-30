import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { QuizTemplate } from  '../../../../models/quizzes/quizTemplate';
import { QuizQuestion } from  '../../../../models/quizzes/quizQuestion';

@Injectable()
export class AdminService {

  private getAllQuizTemplatesUrl = '/api/admin/quiz_templates'; // URL to web api
  private getQuizTemplateUrl = '/api/admin/quiz_templates/id/'; // URL to web api
  private getQuestionsForQuizTemplateUrl = '/api/admin/quiz_questions/template_id/' // URL to web api

  constructor(
    private http: HttpClient
  ) {}

  getAllQuizTemplates(): Observable<QuizTemplate[]> {
    return this.http.get<QuizTemplate[]>(this.getAllQuizTemplatesUrl)
    .pipe(
      catchError(this.handleError('getAllTemplates', []))
    );
  }

  getQuizTemplate(templateId): Observable<QuizTemplate[]> {
    if (templateId) {
      return this.http.get<QuizTemplate[]>(this.getQuizTemplateUrl + templateId)
      .pipe(
        catchError(this.handleError('getQuizTemplates', []))
      );
    }
  }

  getQuestionsForQuizTemplate(templateId): Observable<QuizQuestion[]> {
    if (templateId) {
      return this.http.get<QuizQuestion[]>(this.getQuestionsForQuizTemplateUrl + templateId)
      .pipe(
        catchError(this.handleError('getQuestionsForQuizTemplate', []))
      );
    }
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
