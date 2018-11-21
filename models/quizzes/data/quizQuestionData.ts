export class QuizQuestionData {
  id: number;
  quiz_id: number;
  template_id: number;
  text_question: string;
  picture_question: string;
  question_type: string;
  options: QuizQuestionOption[];
  boolean_correct_answer: boolean;
  correct_answer: string;
  correct_answer_array: string[];
  location_correct_answers: object[];
  date_correct_answer: Date;
  date_start_correct_answer: Date;
  date_end_correct_answer: Date;
  integer_correct_answer: number;
  integer_start_correct_answer: number;
  integer_end_correct_answer: number;
  real_correct_answer: number;
  real_start_correct_answer: number;
  real_end_correct_answer: number;

  constructor() {}
}

export class QuizQuestionOption {
  optionId: string;
  optionAnswer: string;
}
