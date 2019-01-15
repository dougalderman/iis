import { QuizResultModel } from  '../../../models/quizzes/quiz-result.model';
import { Pool } from 'pg';

class Results extends QuizResultModel {

  constructor(
    reqQuizId: number,
    reqQuestionsAnswered: number,
    reqQuestionsAnsweredCorrectly: number,
    reqDatetimeQuizCompleted: string,
    reqQuizDuration: string
  ) {
    super();

    this.quizId = reqQuizId;
    this.questionsAnswered = reqQuestionsAnswered;
    this.questionsAnsweredCorrectly = reqQuestionsAnsweredCorrectly;
    this.datetimeQuizCompleted = reqDatetimeQuizCompleted;
    this.quizDuration = reqQuizDuration;
  };
}

export class QuizResultsController {

  static create(req, res) : void {
    console.log('in QuizResultsController--create()');
    console.log('req.body: ', req.body);
    if (req.body) {
      const pgSqlPool = new Pool();
      const results = new Results(
        req.body.quizId,
        req.body.questionsAnswered,
        req.body.questionsAnsweredCorrectly,
        req.body.datetimeQuizCompleted,
        req.body.quizDuration
      );
      const query = {
        text: 'INSERT INTO QuizResults(quiz_id, questions_answered, questions_answered_correctly, ' +
        'datetime_quiz_completed, quiz_duration) VALUES($1, $2, $3, $4, $5) RETURNING *',
        values: [
          results.quizId,
          results.questionsAnswered,
          results.questionsAnsweredCorrectly,
          results.datetimeQuizCompleted,
          results.quizDuration
        ]
      };
      console.log('query: ', query);
      pgSqlPool.query(query)
      .then(result => {
        console.log('result: ', result);
        if (result && result.rows) {
          res.send(result.rows);
        }
        else {
          res.send([]);
        }
      })
      .catch(e => {
        console.error('in error');
        console.error(e.stack);
        return res.status(500).send(e);
      });
    }
    else {
      return res.status(500).send('invalid request');
    }
  }

  static readByQuizId(req, res) : void {
    console.log('in QuizResultsController--readByQuizId()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.quizId) {
      const pgSqlPool = new Pool();
      const quizId = req.params.quizId;
      const query = {
        text: 'SELECT * FROM QuizResults WHERE quiz_id = $1 ORDER BY id DESC',
        values: [quizId]
      };
      console.log('query: ', query);
      pgSqlPool.query(query)
      .then(result => {
        console.log('result: ', result);
        if (result && result.rows) {
          res.send(result.rows);
        }
        else {
          res.send([]);
        }
      })
      .catch(e => {
        console.error('in error');
        console.error(e.stack);
        return res.status(500).send(e);
      });
    }
    else {
      return res.status(500).send('invalid request');
    }
  }

  static readByDateRange(req, res) : void {
    console.log('in QuizResultsController--readByDateRange()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.startDate && req.params.endDate) {
      const pgSqlPool = new Pool();
      const startDate = req.params.startDate;
      const endDate = req.params.endDate;
      const query = {
        text: 'SELECT * FROM QuizResults WHERE datetime_quiz_completed >= $1 AND datetime_quiz_completed <= $2 ' +
        'ORDER BY datetime_quiz_completed DESC',
        values: [startDate, endDate]
      };
      console.log('query: ', query);
      pgSqlPool.query(query)
      .then(result => {
        console.log('result: ', result);
        if (result && result.rows) {
          res.send(result.rows);
        }
        else {
          res.send([]);
        }
      })
      .catch(e => {
        console.error('in error');
        console.error(e.stack);
        return res.status(500).send(e);
      });
    }
    else {
      return res.status(500).send('invalid request');
    }
  }

  static readAll(req, res) : void {
    console.log('in QuizResultsController--readAll()');
    const pgSqlPool = new Pool();
    const query = {
      text: 'SELECT * FROM QuizResults ORDER BY datetime_quiz_completed DESC',
      values: []
    };
    console.log('query: ', query);
    pgSqlPool.query(query)
    .then(result => {
      console.log('result: ', result);
      if (result && result.rows) {
        res.send(result.rows);
      }
      else {
        res.send([]);
      }
    })
    .catch(e => {
      console.error('in error');
      console.error(e.stack);
      return res.status(500).send(e);
    });
  }
}


