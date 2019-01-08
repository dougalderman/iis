import { QuizResultDataModel } from './data/quiz-result-data.model';

export class QuizResultModel {
  id: number;
  quizId: number;
  dateTaken: Date;
  quizDuration: string;

  constructor(data?: QuizResultDataModel) {
    if (data) {
      this.id = data.id;
      this.quizId = data.quiz_id;
      this.dateTaken = data.date_taken;
      this.quizDuration = data.quiz_duration;
    }
  }
}
