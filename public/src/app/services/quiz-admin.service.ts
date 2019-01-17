import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { QuizModel } from  '../../../../models/quizzes/quiz.model';
import { QuizDataModel } from  '../../../../models/quizzes/data/quiz-data.model';
import { QuizTemplateModel } from  '../../../../models/quizzes/quiz-template.model';
import { QuizQuestionModel } from  '../../../../models/quizzes/quiz-question.model';
import { QuizTemplateDataModel } from  '../../../../models/quizzes/data/quiz-template-data.model';
import { QuizQuestionDataModel } from  '../../../../models/quizzes/data/quiz-question-data.model';

@Injectable({
  providedIn: 'root'
})
export class QuizAdminService {

  private quizUrl = '/api/admin/quizzes'
  private quizByIdUrl = '/api/admin/quizzes/id/';
  private quizByUniqueNameUrl = '/api/admin/quizzes/unique_name/';
  private quizUniqueNameOriginal = '';
  private isQuizUniqueNameTakenUrl = '/api/admin/quizzes/unique_name_taken/';

  private quizTemplatesUrl = '/api/admin/quiz_templates';
  private quizTemplateByIdUrl = '/api/admin/quiz_templates/id/';
  private quizTemplateByNameUrl = '/api/admin/quiz_templates/name/';
  private isQuizTemplateNameTakenUrl = '/api/admin/quiz_templates/name_taken/';

  private quizQuestionsUrl = '/api/admin/quiz_questions'
  private quizQuestionsUpdateQuizIdUrl = '/api/admin/quiz_questions/quiz_id/'
  private questionsForQuizTemplateUrl = '/api/admin/quiz_questions/template_id/';
  private questionsForQuizUrl = '/api/admin/quiz_questions/quiz_id/';


  constructor(
    private http: HttpClient
  ) {}

  getQuiz(quizId: number): Observable<QuizDataModel[]> {
    if (quizId) {
      return this.http.get<QuizDataModel[]>(this.quizByIdUrl + quizId);
    }
  }

  getQuizByUniqueName(uniqueName: string): Observable<QuizDataModel[]> {
    if (uniqueName) {
      return this.http.get<QuizDataModel[]>(this.quizByUniqueNameUrl + encodeURIComponent(uniqueName));
    }
  }

  setQuizUniqueNameOriginal(uniqueName: string): void {
    this.quizUniqueNameOriginal = uniqueName;
  }

  isQuizUniqueNameTaken(uniqueName: string): Observable<boolean> {
    if (uniqueName) {
      if (uniqueName === this.quizUniqueNameOriginal) {
        return of(false);
      }
      else {
        return this.http.get<boolean>(this.isQuizUniqueNameTakenUrl + encodeURIComponent(uniqueName));
      }
    }
  }

  saveNewQuiz(quizData: QuizModel) {
    if (quizData) {
      return this.http.post(this.quizUrl, quizData);
    }
  }

  saveExistingQuiz(quizId: number, quizData: QuizModel) {
    if (quizData) {
      return this.http.put(this.quizUrl + '/' + quizId, quizData);
    }
  }

  getAllQuizTemplates(): Observable<QuizTemplateDataModel[]> {
    return this.http.get<QuizTemplateDataModel[]>(this.quizTemplatesUrl);
  }

  getQuizTemplate(templateId: number): Observable<QuizTemplateDataModel[]> {
    if (templateId) {
      return this.http.get<QuizTemplateDataModel[]>(this.quizTemplateByIdUrl + templateId);
    }
  }

  getQuizTemplateByName(templateName: string): Observable<QuizTemplateDataModel[]> {
    if (templateName) {
      return this.http.get<QuizTemplateDataModel[]>(this.quizTemplateByNameUrl + encodeURIComponent(templateName));
    }
  }

  isQuizTemplateNameTaken(templateName: string): Observable<boolean> {
    if (templateName) {
      return this.http.get<boolean>(this.isQuizTemplateNameTakenUrl + encodeURIComponent(templateName));
    }
  }

  getQuestionsForQuizTemplate(templateId: number): Observable<QuizQuestionDataModel[]> {
    if (templateId) {
      return this.http.get<QuizQuestionDataModel[]>(this.questionsForQuizTemplateUrl + templateId);
    }
  }

  getQuestionsForQuiz(quizId: number): Observable<QuizQuestionDataModel[]> {
    if (quizId) {
      return this.http.get<QuizQuestionDataModel[]>(this.questionsForQuizUrl + quizId);
    }
  }

  saveNewQuizTemplate(templateData: QuizTemplateModel): Observable<any> {
    if (templateData) {
      return this.http.post(this.quizTemplatesUrl, templateData);
    }
  }

  saveExistingQuizTemplate(templateId: number, templateData: QuizTemplateModel): Observable<any> {
    if (templateId && templateData) {
      return this.http.put(this.quizTemplatesUrl + '/' + templateId, templateData);
    }
  }

  deleteQuizTemplate(templateId: number): Observable<any> {
    if (templateId) {
      return this.http.delete(this.quizTemplatesUrl + '/' + templateId);
    }
  }

  saveNewQuizQuestion(questionData: QuizQuestionModel): Observable<any> {
    if (questionData) {
      return this.http.post(this.quizQuestionsUrl, questionData);
    }
  }

  saveExistingQuizQuestionQuizId(questionId: number, questionData: QuizQuestionModel): Observable<any> {
    if (questionData) {
      return this.http.put(this.quizQuestionsUpdateQuizIdUrl + questionId, questionData);
    }
  }

  deleteQuizQuestionsByTemplateId(templateId: number): Observable<any> {
    if (templateId) {
      return this.http.delete(this.questionsForQuizTemplateUrl + templateId);
    }
  }
}
