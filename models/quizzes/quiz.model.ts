export class QuizModel {
  id: number;
  title: string;
  description: string;
  config: QuizConfigModel;

  constructor() {}
}

export class QuizConfigModel {
  randomizeQuestionSequence: boolean;
  randomizeAnswerSequence: boolean;
  autoSubmit: boolean;
  percentGreatJob: number;
}
