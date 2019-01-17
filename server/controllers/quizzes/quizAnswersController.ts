import { QuizAnswerModel } from  '../../../models/quizzes/quiz-answer.model';
import { Pool } from 'pg';

class Answer extends QuizAnswerModel {

  constructor(
    reqQuizId: number,
    reqQuestionId: number,
    reqResultId: number,
    reqTextAnswer: string,
    reqBooleanAnswer: boolean,
    reqDateAnswer: Date,
    reqDateStartAnswer: Date,
    reqDateEndAnswer: Date,
    reqLocationAnswers: [object],
    reqIntegerAnswer: number,
    reqIntegerStartAnswer: number,
    reqIntegerEndAnswer: number,
    reqRealAnswer: number,
    reqRealStartAnswer: number,
    reqRealEndAnswer: number,
    reqAnsweredCorrectly: boolean,
    reqTimeToAnswer: string
  ) {
    super();

    this.quizId = reqQuizId;
    this.questionId = reqQuestionId;
    this.resultId = reqResultId;
    this.textAnswer = reqTextAnswer;
    this.booleanAnswer = reqBooleanAnswer;
    this.dateAnswer = reqDateAnswer;
    this.dateStartAnswer = reqDateStartAnswer;
    this.dateEndAnswer = reqDateEndAnswer;
    this.locationAnswers = reqLocationAnswers;
    this.integerAnswer = reqIntegerAnswer;
    this.integerStartAnswer = reqIntegerStartAnswer;
    this.integerEndAnswer = reqIntegerEndAnswer;
    this.realAnswer =  reqRealAnswer;
    this.realStartAnswer =  reqRealStartAnswer;
    this.realEndAnswer =  reqRealEndAnswer;
    this.answeredCorrectly = reqAnsweredCorrectly;
    this.timeToAnswer = reqTimeToAnswer;
  }
}

export class QuizAnswersController {

  static create(req, res) : void {
    if (req.body) {
      const pgSqlPool = new Pool();
      const answer = new Answer(
        req.body.quizId,
        req.body.questionId,
        req.body.resultId,
        req.body.textAnswer,
        req.body.booleanAnswer,
        req.body.dateAnswer,
        req.body.dateStartAnswer,
        req.body.dateEndAnswer,
        req.body.locationAnswers,
        req.body.integerAnswer,
        req.body.integerStartAnswer,
        req.body.integerEndAnswer,
        req.body.realAnswer,
        req.body.realStartAnswer,
        req.body.realEndAnswer,
        req.body.answeredCorrectly,
        req.body.timeToAnswer
      );
      const query = {
        text: 'INSERT INTO QuizAnswers(quiz_id, question_id, result_id, text_answer, ' +
          'boolean_answer, date_answer, date_start_answer, date_end_answer, location_answers, ' +
          'integer_answer, integer_start_answer, integer_end_answer, real_answer, real_start_answer, ' +
          'real_end_answer, answered_correctly, time_to_answer) VALUES($1, $2, $3, ' +
          '$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)',
        values: [
          answer.quizId,
          answer.questionId,
          answer.resultId,
          answer.textAnswer,
          answer.booleanAnswer,
          answer.dateAnswer,
          answer.dateStartAnswer,
          answer.dateEndAnswer,
          answer.locationAnswers,
          answer.integerAnswer,
          answer.integerStartAnswer,
          answer.integerEndAnswer,
          answer.realAnswer,
          answer.realStartAnswer,
          answer.realEndAnswer,
          answer.answeredCorrectly,
          answer.timeToAnswer
        ]
      };
     pgSqlPool.query(query)
      .then(result => {
        if (result) {
          res.send(result);
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

  static readById(req, res) : void {
    if (req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const query = {
        text: 'SELECT * FROM QuizAnswers WHERE id = $1',
        values: [id]
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

  static readByQuizId(req, res) : void {
    if (req.params && req.params.quizId) {
      const pgSqlPool = new Pool();
      const quizId = req.params.quizId;
      const query = {
        text: 'SELECT * FROM QuizAnswers WHERE quiz_id = $1 ORDER BY id',
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

  static readByQuestionId(req, res) : void {
    if (req.params && req.params.questionId) {
      const pgSqlPool = new Pool();
      const questionId = req.params.questionId;
      const query = {
        text: 'SELECT * FROM QuizAnswers WHERE question_id = $1 ORDER BY id',
        values: [questionId]
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

  static readByResultId(req, res) : void {
    if (req.params && req.params.resultId) {
      const pgSqlPool = new Pool();
      const resultId = req.params.resultId;
      const query = {
        text: 'SELECT * FROM QuizAnswers WHERE result_id = $1 ORDER BY id',
        values: [resultId]
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

  static update(req, res) : void {
    if (req.body && req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const answer = new Answer(
        req.body.quizId,
        req.body.questionId,
        req.body.resultId,
        req.body.textAnswer,
        req.body.booleanAnswer,
        req.body.dateAnswer,
        req.body.dateStartAnswer,
        req.body.dateEndAnswer,
        req.body.locationAnswers,
        req.body.integerAnswer,
        req.body.integerStartAnswer,
        req.body.integerEndAnswer,
        req.body.realAnswer,
        req.body.realStartAnswer,
        req.body.realEndAnswer,
        req.body.answeredCorrectly,
        req.body.timeToAnswer
      );
      const id = req.params.id;
      const query = {
        text: 'UPDATE QuizAnswers SET quiz_id = $1, question_id = $2, result_id = $3, ' +
        'text_answer = $4, boolean_answer = $5, date_answer = $6, date_start_answer = $7, ' +
        'date_end_answer = $8, location_answers = $9, integer_answer = $10, integer_start_answer = $11, ' +
        'integer_end_answer = $12, real_answer = $13, real_start_answer = $14, real_end_answer = $15, ' +
        'answered_correctly = $16, time_to_answer = $17 WHERE id = $18',
        values: [
          answer.quizId,
          answer.questionId,
          answer.resultId,
          answer.textAnswer,
          answer.booleanAnswer,
          answer.dateAnswer,
          answer.dateStartAnswer,
          answer.dateEndAnswer,
          answer.locationAnswers,
          answer.integerAnswer,
          answer.integerStartAnswer,
          answer.integerEndAnswer,
          answer.realAnswer,
          answer.realStartAnswer,
          answer.realEndAnswer,
          answer.answeredCorrectly,
          answer.timeToAnswer,
          id
        ]
      };
      pgSqlPool.query(query)
      .then(result => {
        if (result) {
          res.send(result);
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

  static delete(req, res) : void {
    if (req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const query = {
        text: 'DELETE FROM QuizAnswers WHERE id = $1',
        values: [id]
      };
      pgSqlPool.query(query)
      .then(result => {
        if (result) {
          res.send(result);
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
