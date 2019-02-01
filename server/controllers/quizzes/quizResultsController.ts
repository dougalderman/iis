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

  static create(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.body) {
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
        pgSqlPool.query(query)
        .then(result => {
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
  }

  static readByQuizId(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.quizId) {
        const quizId = req.params.quizId;
        const query = {
          text: 'SELECT * FROM QuizResults WHERE quiz_id = $1 ORDER BY id DESC',
          values: [quizId]
        };
        pgSqlPool.query(query)
        .then(result => {
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
  }

  static readByDateRange(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.startDate && req.params.endDate) {
        const startDate = req.params.startDate;
        const endDate = req.params.endDate;
        const query = {
          text: 'SELECT * FROM QuizResults WHERE datetime_quiz_completed >= $1 AND datetime_quiz_completed <= $2 ' +
          'ORDER BY datetime_quiz_completed DESC',
          values: [startDate, endDate]
        };
        pgSqlPool.query(query)
        .then(result => {
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
  }

  static readAll(pgSqlPool: Pool): any {
    return (req, res) => {
      const query = {
        text: 'SELECT * FROM QuizResults ORDER BY datetime_quiz_completed DESC',
        values: []
      };
      pgSqlPool.query(query)
      .then(result => {
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
}
