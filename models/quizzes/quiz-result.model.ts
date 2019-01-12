import { QuizResultDataModel } from './data/quiz-result-data.model';

export class QuizResultModel {
  id: number;
  quizId: number;
  questionsAnswered: number;
  questionsAnsweredCorrectly: number;
  percentAnsweredCorrectly: number;
  dateTaken: Date;
  quizDuration: string;

  constructor(data?: QuizResultDataModel) {
    if (data) {
      this.id = data.id;
      this.quizId = data.quiz_id;
      this.questionsAnswered = data.questions_answered;
      this.questionsAnsweredCorrectly = data.questions_answered_correctly;
      this.percentAnsweredCorrectly = data.percent_answered_correctly;
      this.dateTaken = data.date_taken;
      this.quizDuration = data.quiz_duration;
    }
  }
}
