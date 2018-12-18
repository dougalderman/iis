import { Pool } from 'pg';

export class DeleteUnusedQuizQuestionsController {

  static deleteUnusedQuizQuestions() : void {
    console.log('in DeleteUnusedQuizQuestionsController--deleteUnusedQuizQuestions()');
    const pgSqlPool = new Pool();
    const query = {
      text: 'DELETE FROM QuizQuestions WHERE quiz_id IS NULL AND template_id IS NULL;',
      values: []
    };
    console.log('query: ', query);
    pgSqlPool.query(query)
    .then(result => {
      console.log('result: ', result);
    })
    .catch(e => {
      console.error('in error');
      console.error(e.stack);
    });
  }
}
