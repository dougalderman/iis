import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { QuizTemplate } from  '../../../../models/quizzes/quizTemplate';
import { QuizQuestion } from  '../../../../models/quizzes/quizQuestion';

@Injectable()
export class AdminService {

  private QuizTemplatesUrl = '/api/admin/quiz_templates';
  private getQuizTemplateUrl = '/api/admin/quiz_templates/id/';
  private getQuestionsForQuizTemplateUrl = '/api/admin/quiz_questions/template_id/';

  constructor(
    private http: HttpClient
  ) {}

  getAllQuizTemplates(): Observable<QuizTemplate[]> {
    return this.http.get<QuizTemplate[]>(this.QuizTemplatesUrl)
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

  saveQuizTemplate(templateData: QuizTemplate) {
    if (templateData) {
      return this.http.post(this.QuizTemplatesUrl, templateData)
      .pipe(
        catchError(this.handleError('getQuizTemplates', []))
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
