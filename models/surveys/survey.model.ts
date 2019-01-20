import { SurveyDataModel } from './data/survey-data.model';

export class QuizModel {
  id: number;
  uniqueName: string;
  title: string;
  description: string;
  config: SurveyConfigModel;

  constructor(data?: SurveyDataModel) {
    if (data) {
      this.id = data.id;
      this.uniqueName = data.unique_name;
      this.description = data.description;
      this.title = data.title;
      this.config = data.config;
    }
  }
}

export class SurveyConfigModel {}
