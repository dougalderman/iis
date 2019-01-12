export class QuizResultDataModel {
  id: number;
  quiz_id: number;
  questions_answered: number;
  questions_answered_correctly: number;
  percent_answered_correctly: number;
  date_taken: Date;
  quiz_duration: string;

  constructor() {}
}
