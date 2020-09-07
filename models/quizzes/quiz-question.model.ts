import { QuizQuestionDataModel } from './data/quiz-question-data.model';

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

  constructor(data?: QuizQuestionDataModel) {
    if (data) {
      this.id = data.id;
      this.quizId = data.quiz_id;
      this.templateId = data.template_id;
      this.textQuestion = data.text_question;
      this.pictureQuestion = data.picture_question;
      this.questionType = data.question_type;
      this.options = data.options;
      this.booleanCorrectAnswer = data.boolean_correct_answer;
      this.correctAnswer = data.correct_answer;
      this.correctAnswerArray = data.correct_answer_array;
      this.locationCorrectAnswers = data.location_correct_answers;
      this.dateCorrectAnswer = data.date_correct_answer;
      this.dateStartCorrectAnswer = data.date_start_correct_answer;
      this.dateEndCorrectAnswer = data.date_end_correct_answer;
      this.integerCorrectAnswer = data.integer_correct_answer;
      this.integerStartCorrectAnswer = data.integer_start_correct_answer;
      this.integerEndCorrectAnswer = data.integer_end_correct_answer;
      this.realCorrectAnswer = data.real_correct_answer;
      this.realStartCorrectAnswer = data.real_start_correct_answer;
      this.realEndCorrectAnswer = data.real_end_correct_answer;
    }
  }
}

export class QuizQuestionOptionModel {
  optionCorrectAnswer: boolean;
  option: string;
}
