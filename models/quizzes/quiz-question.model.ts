export class QuizQuestionModel {
  id: number;
  quizId: number;
  templateId: number;
  textQuestion: string;
  pictureQuestion: string;
  questionType: string;
  options: QuizQuestionOptionModel[];
  booleanCorrectAnswer: boolean;
  correctAnswer: string;
  correctAnswerArray: string[];
  locationCorrectAnswers: any[];
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

export class QuizQuestionOptionModel {
  optionCorrectAnswer: boolean;
  option: string
}
