export interface QuizAnswers {
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
  realAnswer: number;
  answeredCorrectly: boolean;
  timeToAnswer: string;
}
