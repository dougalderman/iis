import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { QuizTemplate } from  '../../../../models/quizzes/quizTemplate';
import { QuizQuestion } from  '../../../../models/quizzes/quizQuestion';

@Injectable()
export class QuizAdminService {

  private quizTemplatesUrl = '/api/admin/quiz_templates';
  private quizTemplateByIdUrl = '/api/admin/quiz_templates/id/';
  private quizTemplateByNameUrl = '/api/admin/quiz_templates/name/';

  private quizQuestionsUrl = '/api/admin/quiz_questions'
  private questionsForQuizTemplateUrl = '/api/admin/quiz_questions/template_id/';

  constructor(
    private http: HttpClient
  ) {}

  getAllQuizTemplates(): Observable<QuizTemplate[]> {
    return this.http.get<QuizTemplate[]>(this.quizTemplatesUrl)
    .pipe(
      catchError(this.handleError('getAllQuizTemplates', []))
    );
  }

  getQuizTemplate(templateId: number): Observable<QuizTemplate[]> {
    if (templateId) {
      return this.http.get<QuizTemplate[]>(this.quizTemplateByIdUrl + templateId)
      .pipe(
        catchError(this.handleError('getQuizTemplate', []))
      );
    }
  }

  getQuizTemplateByName(templateName: string): Observable<QuizTemplate[]> {
    if (templateName) {
      return this.http.get<QuizTemplate[]>(this.quizTemplateByNameUrl + templateName)
      .pipe(
        catchError(this.handleError('getQuizTemplateByName', []))
      );
    }
  }

  getQuestionsForQuizTemplate(templateId: number): Observable<QuizQuestion[]> {
    if (templateId) {
      return this.http.get<any[]>(this.questionsForQuizTemplateUrl + templateId)
      .pipe(
        catchError(this.handleError('getQuestionsForQuizTemplate', []))
      );
    }
  }

  saveNewQuizTemplate(templateData: QuizTemplate) {
    if (templateData) {
      return this.http.post(this.quizTemplatesUrl, templateData)
      .pipe(
        catchError(this.handleError('saveNewQuizTemplate', []))
      );
    }
  }

  saveExistingQuizTemplate(templateId: number, templateData: QuizTemplate) {
    if (templateId && templateData) {
      return this.http.put(this.quizTemplatesUrl + '/' + templateId, templateData)
      .pipe(
        catchError(this.handleError('saveExistingQuizTemplate', []))
      );
    }
  }

  saveNewQuizQuestion(questionData: QuizQuestion) {
    if (questionData) {
      return this.http.post(this.quizQuestionsUrl, questionData)
      /* .pipe(
        catchError(this.handleError('saveNewQuizQuestion', []))
      ); */
    }
  }

  deleteQuizQuestionsByTemplateId(templateId: number) {
    if (templateId) {
      return this.http.delete(this.questionsForQuizTemplateUrl + templateId)
      .pipe(
        catchError(this.handleError('deleteQuizQuestionsByTemplateId', []))
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
