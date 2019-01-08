import { QuizConfigModel } from '../quiz.model';

export class QuizDataModel {
  id: number;
  unique_name: string;
  title: string;
  description: string;
  config: QuizConfigModel;

  constructor() {}
}
