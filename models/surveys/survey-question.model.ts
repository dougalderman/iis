import { SurveyQuestionDataModel } from './data/survey-question-data.model';

export class SurveyQuestionModel {
  id: number;
  surveyId: number;
  templateId: number;
  textQuestion: string;
  pictureQuestion: string;
  questionType: string;
  options: string[];
  integerStartAnswerRange: number;
  integerEndAnswerRange: number;
  realStartAnswerRange: number;
  realEndAnswerRange: number;

  constructor(data?: SurveyQuestionDataModel) {
    if (data) {
      this.id = data.id;
      this.surveyId = data.survey_id;
      this.templateId = data.template_id;
      this.textQuestion = data.text_question;
      this.pictureQuestion = data.picture_question;
      this.questionType = data.question_type;
      this.options = data.options;
      this.integerStartAnswerRange = data.integer_start_answer_range;
      this.integerEndAnswerRange = data.integer_end_answer_range;
      this.realStartAnswerRange = data.real_start_answer_range;
      this.realEndAnswerRange = data.real_end_answer_range;
    }
  }
}
