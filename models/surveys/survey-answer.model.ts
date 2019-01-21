import { SurveyAnswerDataModel } from './data/survey-answer-data.model';

export class SurveyAnswerModel {
  id: number;
  surveyId: number;
  questionId: number;
  resultId: number;
  timeToAnswer: string;
  textAnswer: string;
  booleanAnswer: boolean;
  dateAnswer: Date;
  dateStartAnswer: Date;
  dateEndAnswer: Date;
  locationAnswers: object[];
  integerAnswer: number;
  integerStartAnswer: number;
  integerEndAnswer: number;
  realAnswer: number;
  realStartAnswer: number;
  realEndAnswer: number;

  constructor(data?: SurveyAnswerDataModel) {
    if (data) {
      this.id = data.id;
      this.surveyId = data.survey_id;
      this.questionId = data.question_id;
      this.resultId = data.result_id;
      this.timeToAnswer = data.time_to_answer;
      this.textAnswer = data.text_answer;
      this.booleanAnswer = data.boolean_answer;
      this.dateAnswer = data.date_answer;
      this.dateStartAnswer = data.date_start_answer;
      this.dateEndAnswer = data.date_end_answer;
      this.locationAnswers = data.location_answers;
      this.integerAnswer = data.integer_answer;
      this.integerStartAnswer = data.integer_start_answer;
      this.integerEndAnswer = data.integer_end_answer;
      this.realAnswer = data.real_answer;
      this.realStartAnswer = data.real_start_answer;
      this.realEndAnswer = data.real_end_answer;
    }
  }
}
