import { QuizAnswerDataModel } from './data/quiz-answer-data.model';

export class QuizAnswerModel {
  id: number;
  quizId: number;
  questionId: number;
  resultId: number;
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
  answeredCorrectly: boolean;
  timeToAnswer: string;

  constructor(data?: QuizAnswerDataModel) {
    if (data) {
      this.id = data.id;
      this.quizId = data.quiz_id;
      this.questionId = data.question_id;
      this.resultId = data.result_id;
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
      this.answeredCorrectly = data.answered_correctly;
      this.timeToAnswer = data.time_to_answer;
    }
  }
}
