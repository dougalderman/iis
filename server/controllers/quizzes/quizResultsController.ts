import { QuizResult } from  '../../../models/quizzes/quizResult';
import { Pool } from 'pg';

class Results implements QuizResult {
  quizId: number;
  dateTaken: Date;
  quizDuration: string;

  constructor(reqQuizId: number, reqDateTaken: Date, reqQuizDuration: string) {
    this.quizId = reqQuizId;
    this.dateTaken = reqDateTaken;
    this.quizDuration = reqQuizDuration;
  };
}

export class QuizResultsController {

  static create(req, res) : void {
    console.log('in QuizResultsController--create()');
    console.log('req.body: ', req.body);
    if (req.body) {
      const pgSqlPool = new Pool();
      const results = new Results(req.body.quizId, req.body.dateTaken, req.body.quizDuration);
      const query = {
        text: 'INSERT INTO QuizResults(quiz_id, date_taken, quiz_duration) VALUES($1, $2, $3)',
        values: [results.quizId, results.dateTaken, results.quizDuration]
      };
      console.log('query: ', query);
      pgSqlPool.query(query)
      .then(result => {
        console.log('result: ', result);
        if (result) {
          res.send(result);
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
        text: 'SELECT * FROM QuizResults WHERE quiz_id = $1',
        values: [quizId]
      };
      console.log('query: ', query);
      pgSqlPool.query(query)
      .then(result => {
        console.log('result: ', result);
        if (result) {
          res.send(result);
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
        text: 'SELECT * FROM QuizResults WHERE date_taken >= $1 AND date_taken <= $2 ORDER BY date_taken DESC',
        values: [startDate, endDate]
      };
      console.log('query: ', query);
      pgSqlPool.query(query)
      .then(result => {
        console.log('result: ', result);
        if (result) {
          res.send(result);
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
      text: 'SELECT * FROM QuizResults ORDER BY date_taken DESC',
      values: []
    };
    console.log('query: ', query);
    pgSqlPool.query(query)
    .then(result => {
      console.log('result: ', result);
      if (result) {
        res.send(result);
      }
    })
    .catch(e => {
      console.error('in error');
      console.error(e.stack);
      return res.status(500).send(e);
    });
  }
}


