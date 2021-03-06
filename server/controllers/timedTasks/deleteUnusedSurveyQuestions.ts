import { Pool } from 'pg';

export class DeleteUnusedSurveyQuestionsController {

  static deleteUnusedSurveyQuestions(pgSqlPool: Pool) : void {
    const query = {
      text: 'DELETE FROM SurveyQuestions WHERE survey_id IS NULL AND template_id IS NULL;',
      values: []
    };
    pgSqlPool.query(query)
    .then(result => {})
    .catch(e => {
      console.error('in error');
      console.error(e.stack);
    });
  }
}
