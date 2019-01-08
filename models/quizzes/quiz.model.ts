export class QuizModel {
  id: number;
  uniqueName: string;
  title: string;
  description: string;
  config: QuizConfigModel;

  constructor() {}
}

export class QuizConfigModel {
  autoSubmit: boolean;
  percentGreatJob: number;
}
