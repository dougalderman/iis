import { SurveyResultDataModel } from './data/survey-result-data.model';

export class SurveyResultModel {
  id: number;
  surveyId: number;
  questionsAnswered: number;
  datetimeSurveyCompleted: string;
  surveyDuration: string;

  constructor(data?: SurveyResultDataModel) {
    if (data) {
      this.id = data.id;
      this.surveyId = data.survey_id;
      this.questionsAnswered = data.questions_answered;
      this.datetimeSurveyCompleted = data.datetime_survey_completed;
      this.surveyDuration = data.survey_duration;
    }
  }
}
