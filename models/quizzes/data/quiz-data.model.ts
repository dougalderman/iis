import { QuizConfigModel } from '../quiz.model';

export class QuizDataModel {
  id: number;
  title: string;
  description: string;
  config: QuizConfigModel;

  constructor() {}
}
