export class QuizQuestion {
  id: number;
  quizId: number;
  templateId: number;
  textQuestion: string;
  pictureQuestion: string;
  questionType: string;
  options: QuizQuestionOption[];
  booleanCorrectAnswer: boolean;
  correctAnswer: string;
  correctAnswerArray: string[];
  locationCorrectAnswers: object[];
  dateCorrectAnswer: Date;
  dateStartCorrectAnswer: Date;
  dateEndCorrectAnswer: Date;
  integerCorrectAnswer: number;
  integerStartCorrectAnswer: number;
  integerEndCorrectAnswer: number;
  realCorrectAnswer: number;
  realStartCorrectAnswer: number;
  realEndCorrectAnswer: number;

  constructor() {}
}

export class QuizQuestionOption {
  optionId: string;
  optionAnswer: string;
}
