export class QuizAnswerModel {
  id: number;
  quizId: number;
  questionId: number;
  resultsId: number;
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

  constructor() {}
}
