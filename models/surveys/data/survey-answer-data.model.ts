export class SurveyAnswerDataModel {
  id: number;
  survey_id: number;
  question_id: number;
  result_id: number;
  text_answer: string;
  boolean_answer: boolean;
  date_answer: Date;
  date_start_answer: Date;
  date_end_answer: Date;
  location_answers: object[];
  integer_answer: number;
  integer_start_answer: number;
  integer_end_answer: number;
  real_answer: number;
  real_start_answer: number;
  real_end_answer: number;
  answered_correctly: boolean;
  time_to_answer: string;

  constructor() {}
}
