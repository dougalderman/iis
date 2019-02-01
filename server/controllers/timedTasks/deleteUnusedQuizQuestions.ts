import { Pool } from 'pg';

export class DeleteUnusedQuizQuestionsController {

  static deleteUnusedQuizQuestions(pgSqlPool: Pool) : void {
    const query = {
      text: 'DELETE FROM QuizQuestions WHERE quiz_id IS NULL AND template_id IS NULL;',
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
