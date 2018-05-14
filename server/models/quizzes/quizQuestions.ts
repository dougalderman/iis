export interface QuizQuestions {
  quizId: number,
  quizTemplate: number,
  textQuestion: string,
  pictureQuestion: string,
  questionType: string,
  options: object,
  booleanCorectAnswer: boolean,
  correctAnswer: string,
  locationCorrectAnswers: [object],
  dateCorrectAnswer: Date,
  dateStartCorrectAnswer: Date,
  dateEndCorrectAnswer: Date,
  integerCorrectAnswer: number,
  realCorrectAnswer: number
}
