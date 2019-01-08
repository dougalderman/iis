import { QuizTemplateDataModel } from './data/quiz-template-data.model';

export class QuizTemplateModel {
  id: number;
  name: string;
  description: string;

  constructor(data?: QuizTemplateDataModel) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.description = data.description;
    }
  }
}
