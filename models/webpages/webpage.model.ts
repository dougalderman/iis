import { WebpageDataModel } from './data/webpage-data.model';

export class WebpageModel {
  id: number;
  quizId: number;
  surveyId: number;
  title: string;

  constructor(data?: WebpageDataModel) {
    if (data) {
      this.id = data.id;
      this.quizId = data.quiz_id;
      this.surveyId = data.survey_id;
      this.title = data.title;
    }
  }
}
