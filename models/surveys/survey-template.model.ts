import { SurveyTemplateDataModel } from './data/survey-template-data.model';

export class SurveyTemplateModel {
  id: number;
  name: string;
  description: string;

  constructor(data?: SurveyTemplateDataModel) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.description = data.description;
    }
  }
}
