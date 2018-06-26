export interface QuizQuestions {
  quizId: number;
  templateId: number;
  textQuestion: string;
  pictureQuestion: string;
  questionType: string;
  options: object;
  booleanCorrectAnswer: boolean;
  correctAnswer: string;
  locationCorrectAnswers: [object];
  dateCorrectAnswer: Date;
  dateStartCorrectAnswer: Date;
  dateEndCorrectAnswer: Date;
  integerCorrectAnswer: number;
  realCorrectAnswer: number;
}
