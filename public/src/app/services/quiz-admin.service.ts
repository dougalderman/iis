import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { QuizTemplate } from  '../../../../models/quizzes/quizTemplate';
import { QuizQuestion } from  '../../../../models/quizzes/quizQuestion';
import { QuizTemplateData } from  '../../../../models/quizzes/data/quizTemplateData';
import { QuizQuestionData } from  '../../../../models/quizzes/data/quizQuestionData';

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

  getAllQuizTemplates(): Observable<QuizTemplateData[]> {
    return this.http.get<QuizTemplate[]>(this.quizTemplatesUrl)
  }

  getQuizTemplate(templateId: number): Observable<QuizTemplateData[]> {
    if (templateId) {
      return this.http.get<QuizTemplate[]>(this.quizTemplateByIdUrl + templateId)
    }
  }

  getQuizTemplateByName(templateName: string): Observable<QuizTemplateData[]> {
    if (templateName) {
      return this.http.get<QuizTemplate[]>(this.quizTemplateByNameUrl + templateName)
    }
  }

  getQuestionsForQuizTemplate(templateId: number): Observable<QuizQuestionData[]> {
    if (templateId) {
      return this.http.get<any[]>(this.questionsForQuizTemplateUrl + templateId)
    }
  }

  saveNewQuizTemplate(templateData: QuizTemplate) {
    if (templateData) {
      return this.http.post(this.quizTemplatesUrl, templateData)
    }
  }

  saveExistingQuizTemplate(templateId: number, templateData: QuizTemplate) {
    if (templateId && templateData) {
      return this.http.put(this.quizTemplatesUrl + '/' + templateId, templateData)
    }
  }

  deleteQuizTemplate(templateId: number) {
    if (templateId) {
      return this.http.delete(this.quizTemplatesUrl + '/' + templateId)
    }
  }

  saveNewQuizQuestion(questionData: QuizQuestion) {
    if (questionData) {
      return this.http.post(this.quizQuestionsUrl, questionData)
    }
  }

  saveExistingQuizQuestion(questionId: number, questionData: QuizQuestion) {
    if (questionData) {
      return this.http.put(this.quizQuestionsUrl + '/' + questionId, questionData)
    }
  }

  deleteQuizQuestion(questionId: number) {
    if (questionId) {
      return this.http.delete(this.quizQuestionsUrl + '/' + questionId)
    }
  }

  deleteQuizQuestionsByTemplateId(templateId: number) {
    if (templateId) {
      return this.http.delete(this.questionsForQuizTemplateUrl + templateId)
    }
  }
}
