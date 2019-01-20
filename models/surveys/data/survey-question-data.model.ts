import { SurveyQuestionOptionModel } from '../survey-question.model';

export class SurveyQuestionDataModel {
  id: number;
  survey_id: number;
  template_id: number;
  text_question: string;
  picture_question: string;
  question_type: string;
  options: SurveyQuestionOptionModel[];
  integer_start_answer_range: number;
  integer_end_answer_range: number;
  real_start_answer_range: number;
  real_end_answer_range: number;

  constructor() {}
}
