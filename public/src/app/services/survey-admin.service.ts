import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SurveyModel } from  '../../../../models/surveys/survey.model';
import { SurveyDataModel } from  '../../../../models/surveys/data/survey-data.model';
import { SurveyTemplateModel } from  '../../../../models/surveys/survey-template.model';
import { SurveyQuestionModel } from  '../../../../models/surveys/survey-question.model';
import { SurveyTemplateDataModel } from  '../../../../models/surveys/data/survey-template-data.model';
import { SurveyQuestionDataModel } from  '../../../../models/surveys/data/survey-question-data.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyAdminService {

  private surveyUrl = '/api/admin/surveys'
  private surveyByIdUrl = '/api/admin/surveys/id/';
  private surveyByUniqueNameUrl = '/api/admin/surveys/unique_name/';
  private surveyUniqueNameOriginal = '';
  private isSurveyUniqueNameTakenUrl = '/api/admin/surveys/unique_name_taken/';

  private surveyTemplatesUrl = '/api/admin/survey_templates';
  private surveyTemplateByIdUrl = '/api/admin/survey_templates/id/';
  private surveyTemplateByNameUrl = '/api/admin/survey_templates/name/';
  private isSurveyTemplateNameTakenUrl = '/api/admin/survey_templates/name_taken/';

  private surveyQuestionsUrl = '/api/admin/survey_questions'
  private surveyQuestionsUpdateSurveyIdUrl = '/api/admin/survey_questions/survey_id/'
  private questionsForSurveyTemplateUrl = '/api/admin/survey_questions/template_id/';
  private questionsForSurveyUrl = '/api/admin/survey_questions/survey_id/';


  constructor(
    private http: HttpClient
  ) {}

  getSurvey(surveyId: number): Observable<SurveyDataModel[]> {
    if (surveyId) {
      return this.http.get<SurveyDataModel[]>(this.surveyByIdUrl + surveyId);
    }
  }

  getSurveyByUniqueName(uniqueName: string): Observable<SurveyDataModel[]> {
    if (uniqueName) {
      return this.http.get<SurveyDataModel[]>(this.surveyByUniqueNameUrl + encodeURIComponent(uniqueName));
    }
  }

  setSurveyUniqueNameOriginal(uniqueName: string): void {
    this.surveyUniqueNameOriginal = uniqueName;
  }

  isSurveyUniqueNameTaken(uniqueName: string): Observable<boolean> {
    if (uniqueName) {
      if (uniqueName === this.surveyUniqueNameOriginal) {
        return of(false);
      }
      else {
        return this.http.get<boolean>(this.isSurveyUniqueNameTakenUrl + encodeURIComponent(uniqueName));
      }
    }
  }

  saveNewSurvey(surveyData: SurveyModel) {
    if (surveyData) {
      return this.http.post(this.surveyUrl, surveyData);
    }
  }

  saveExistingSurvey(surveyId: number, surveyData: SurveyModel) {
    if (surveyData) {
      return this.http.put(this.surveyUrl + '/' + surveyId, surveyData);
    }
  }

  getAllSurveyTemplates(): Observable<SurveyTemplateDataModel[]> {
    return this.http.get<SurveyTemplateDataModel[]>(this.surveyTemplatesUrl);
  }

  getSurveyTemplate(templateId: number): Observable<SurveyTemplateDataModel[]> {
    if (templateId) {
      return this.http.get<SurveyTemplateDataModel[]>(this.surveyTemplateByIdUrl + templateId);
    }
  }

  getSurveyTemplateByName(templateName: string): Observable<SurveyTemplateDataModel[]> {
    if (templateName) {
      return this.http.get<SurveyTemplateDataModel[]>(this.surveyTemplateByNameUrl + encodeURIComponent(templateName));
    }
  }

  isSurveyTemplateNameTaken(templateName: string): Observable<boolean> {
    if (templateName) {
      return this.http.get<boolean>(this.isSurveyTemplateNameTakenUrl + encodeURIComponent(templateName));
    }
  }

  getQuestionsForSurveyTemplate(templateId: number): Observable<SurveyQuestionDataModel[]> {
    if (templateId) {
      return this.http.get<SurveyQuestionDataModel[]>(this.questionsForSurveyTemplateUrl + templateId);
    }
  }

  getQuestionsForSurvey(surveyId: number): Observable<SurveyQuestionDataModel[]> {
    if (surveyId) {
      return this.http.get<SurveyQuestionDataModel[]>(this.questionsForSurveyUrl + surveyId);
    }
  }

  saveNewSurveyTemplate(templateData: SurveyTemplateModel): Observable<any> {
    if (templateData) {
      return this.http.post(this.surveyTemplatesUrl, templateData);
    }
  }

  saveExistingSurveyTemplate(templateId: number, templateData: SurveyTemplateModel): Observable<any> {
    if (templateId && templateData) {
      return this.http.put(this.surveyTemplatesUrl + '/' + templateId, templateData);
    }
  }

  deleteSurveyTemplate(templateId: number): Observable<any> {
    if (templateId) {
      return this.http.delete(this.surveyTemplatesUrl + '/' + templateId);
    }
  }

  saveNewSurveyQuestion(questionData: SurveyQuestionModel): Observable<any> {
    if (questionData) {
      return this.http.post(this.surveyQuestionsUrl, questionData);
    }
  }

  saveExistingSurveyQuestionSurveyId(questionId: number, questionData: SurveyQuestionModel): Observable<any> {
    if (questionData) {
      return this.http.put(this.surveyQuestionsUpdateSurveyIdUrl + questionId, questionData);
    }
  }

  deleteSurveyQuestionsByTemplateId(templateId: number): Observable<any> {
    if (templateId) {
      return this.http.delete(this.questionsForSurveyTemplateUrl + templateId);
    }
  }
}
