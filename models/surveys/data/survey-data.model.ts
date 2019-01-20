import { SurveyConfigModel } from '../survey.model';

export class SurveyDataModel {
  id: number;
  unique_name: string;
  title: string;
  description: string;
  config: SurveyConfigModel;

  constructor() {}
}
