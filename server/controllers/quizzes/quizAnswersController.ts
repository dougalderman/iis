import { QuizAnswers } from  '../../models/quizzes/quizAnswers';
import { Pool } from 'pg';

class Answer implements QuizAnswers {
  quizId: number;
  questionId: number;
  resultsId: number;
  textAnswer: string;
  booleanAnswer: boolean;
  dateAnswer: Date;
  dateStartAnswer: Date;
  dateEndAnswer: Date;
  locationAnswers: [object];
  integerAnswer: number;
  realAnswer: number;
  answeredCorrectly: boolean;
  timeToAnswer: string;

  constructor(
    reqQuizId: number,
    reqQuestionId: number,
    reqResultsId: number,
    reqTextAnswer: string,
    reqBooleanAnswer: boolean,
    reqDateAnswer: Date,
    reqDateStartAnswer: Date,
    reqDateEndAnswer: Date,
    reqLocationAnswers: [object],
    reqIntegerAnswer: number,
    reqRealAnswer: number,
    reqAnsweredCorrectly: boolean,
    reqTimeToAnswer: string
  ) {
    this.quizId = reqQuizId;
    this.questionId = reqQuestionId;
    this.resultsId = reqResultsId;
    this.textAnswer = reqTextAnswer;
    this.booleanAnswer = reqBooleanAnswer;
    this.dateAnswer = reqDateAnswer;
    this.dateStartAnswer = reqDateStartAnswer;
    this.dateEndAnswer = reqDateEndAnswer;
    this.locationAnswers = reqLocationAnswers;
    this.integerAnswer = reqIntegerAnswer;
    this.realAnswer =  reqRealAnswer;
    this.answeredCorrectly = reqAnsweredCorrectly;
    this.timeToAnswer = reqTimeToAnswer;
  }
}

export class QuizAnswersController {

  static create(req, res) : void {
    console.log('in QuizAnswersController--create()');
    console.log('req.body: ', req.body);
    if (req.body) {
      const pgSqlPool = new Pool();
      const answer = new Answer(
        req.body.quizId,
        req.body.questionId,
        req.body.resultsId,
        req.body.textAnswer,
        req.body.booleanAnswer,
        req.body.dateAnswer,
        req.body.dateStartAnswer,
        req.body.dateEndAnswer,
        req.body.locationAnswers,
        req.body.integerAnswer,
        req.body.realAnswer,
        req.body.answeredCorrectly,
        req.body.timeToAnswer
      );
      const query = {
        text: 'INSERT INTO QuizAnswers(quiz_id, question_id, results_id, text_answer, ' +
          'boolean_answer, date_answer, date_start_answer, date_end_answer, location_answers, ' +
          'integer_answer, real_answer, answered_correct, time_to_answer) VALUES($1, $2, $3, ' +
          '$4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        values: [
          answer.quizId,
          answer.questionId,
          answer.resultsId,
          answer.textAnswer,
          answer.booleanAnswer,
          answer.dateAnswer,
          answer.dateStartAnswer,
          answer.dateEndAnswer,
          answer.locationAnswers,
          answer.integerAnswer,
          answer.realAnswer,
          answer.answeredCorrectly,
          answer.timeToAnswer
        ]
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

  static readById(req, res) : void {
    console.log('in QuizAnswersController--readById()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const query = {
        text: 'SELECT * FROM QuizAnswers WHERE id = $1',
        values: [id]
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
    console.log('in QuizAnswersController--readByQuizId()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.quizId) {
      const pgSqlPool = new Pool();
      const quizId = req.params.quizId;
      const query = {
        text: 'SELECT * FROM QuizAnswers WHERE quiz_id = $1 ORDER BY id',
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

  static readByQuestionId(req, res) : void {
    console.log('in QuizAnswersController--readByQuestionId()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.questionId) {
      const pgSqlPool = new Pool();
      const questionId = req.params.questionId;
      const query = {
        text: 'SELECT * FROM QuizAnswers WHERE question_id = $1 ORDER BY id',
        values: [questionId]
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

  static readByResultsId(req, res) : void {
    console.log('in QuizAnswersController--readByResultsId()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.resultsId) {
      const pgSqlPool = new Pool();
      const resultsId = req.params.resultsId;
      const query = {
        text: 'SELECT * FROM QuizAnswers WHERE results_id = $1 ORDER BY id',
        values: [resultsId]
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

  static update(req, res) : void {
    console.log('in QuizAnswersController--update()');
    console.log('req.body: ', req.body);
    console.log('req.params: ', req.params);
    if (req.body && req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const answer = new Answer(
        req.body.quizId,
        req.body.questionId,
        req.body.resultsId,
        req.body.textAnswer,
        req.body.booleanAnswer,
        req.body.dateAnswer,
        req.body.dateStartAnswer,
        req.body.dateEndAnswer,
        req.body.locationAnswers,
        req.body.integerAnswer,
        req.body.realAnswer,
        req.body.answeredCorrectly,
        req.body.timeToAnswer
      );
      const id = req.params.id;
      const query = {
        text: 'UPDATE QuizAnswers SET quiz_id = $1, question_id = $2, results_id = $3, ' +
        'text_answer = $4, boolean_answer = $5, date_answer = $6, date_start_answer = $7, ' +
        'date_end_answer = $8, location_answers = $9, integer_answer = $10, real_answer = $11, ' +
        'answered_correctly = $12, time_to_answer = $13 WHERE id = $14',
        values: [
          answer.quizId,
          answer.questionId,
          answer.resultsId,
          answer.textAnswer,
          answer.booleanAnswer,
          answer.dateAnswer,
          answer.dateStartAnswer,
          answer.dateEndAnswer,
          answer.locationAnswers,
          answer.integerAnswer,
          answer.realAnswer,
          answer.answeredCorrectly,
          answer.timeToAnswer,
          id
        ]
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

  static delete(req, res) : void {
    console.log('in QuizAnswersController--delete()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const query = {
        text: 'DELETE FROM QuizAnswers WHERE id = $1',
        values: [id]
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
}

