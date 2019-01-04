import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private quizByTitleUrl = '/api/admin/quizzes/title/';
  private isQuizTitleTakenUrl = '/api/admin/quizzes/title_taken/';

  private quizTemplatesUrl = '/api/admin/quiz_templates';
  private quizTemplateByIdUrl = '/api/admin/quiz_templates/id/';
  private quizTemplateByNameUrl = '/api/admin/quiz_templates/name/';
  private isQuizTemplateNameTakenUrl = '/api/admin/quiz_templates/name_taken/';

  private quizQuestionsUrl = '/api/admin/quiz_questions'
  private questionsForQuizTemplateUrl = '/api/admin/quiz_questions/template_id/';

  constructor(
    private http: HttpClient
  ) {}

  getQuiz(quizId: number): Observable<QuizDataModel[]> {
    if (quizId) {
      return this.http.get<QuizDataModel[]>(this.quizByIdUrl + quizId);
    }
  }

  getQuizByTitle(title: string): Observable<QuizDataModel[]> {
    if (title) {
      return this.http.get<QuizDataModel[]>(this.quizByTitleUrl + encodeURIComponent(title));
    }
  }

  isQuizTitleTaken(quizTitle: string): Observable<boolean> {
    if (quizTitle) {
      return this.http.get<boolean>(this.isQuizTitleTakenUrl + encodeURIComponent(quizTitle));
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

  saveNewQuizTemplate(templateData: QuizTemplateModel) {
    if (templateData) {
      return this.http.post(this.quizTemplatesUrl, templateData);
    }
  }

  saveExistingQuizTemplate(templateId: number, templateData: QuizTemplateModel) {
    if (templateId && templateData) {
      return this.http.put(this.quizTemplatesUrl + '/' + templateId, templateData);
    }
  }

  deleteQuizTemplate(templateId: number) {
    if (templateId) {
      return this.http.delete(this.quizTemplatesUrl + '/' + templateId);
    }
  }

  saveNewQuizQuestion(questionData: QuizQuestionModel) {
    if (questionData) {
      return this.http.post(this.quizQuestionsUrl, questionData);
    }
  }

  deleteQuizQuestionsByTemplateId(templateId: number) {
    if (templateId) {
      return this.http.delete(this.questionsForQuizTemplateUrl + templateId);
    }
  }
}
