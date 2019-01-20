import { SurveyAnswerModel } from  '../../../models/surveys/survey-answer.model';
import { Pool } from 'pg';

class Answer extends SurveyAnswerModel {

  constructor(
    reqSurveyId: number,
    reqQuestionId: number,
    reqResultId: number,
    reqTimeToAnswer: string,
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
    reqRealEndAnswer: number
  ) {
    super();

    this.surveyId = reqSurveyId;
    this.questionId = reqQuestionId;
    this.resultId = reqResultId;
    this.timeToAnswer = reqTimeToAnswer;
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
  }
}

export class SurveyAnswersController {

  static create(req, res) : void {
    if (req.body) {
      const pgSqlPool = new Pool();
      const answer = new Answer(
        req.body.surveyId,
        req.body.questionId,
        req.body.resultId,
        req.body.timeToAnswer,
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
        req.body.realEndAnswer
      );
      const query = {
        text: 'INSERT INTO SurveyAnswers(survey_id, question_id, result_id, time_to_answer, ' +
          'text_answer, boolean_answer, date_answer, date_start_answer, date_end_answer, location_answers, ' +
          'integer_answer, integer_start_answer, integer_end_answer, real_answer, real_start_answer, ' +
          'real_end_answer) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
        values: [
          answer.surveyId,
          answer.questionId,
          answer.resultId,
          answer.timeToAnswer,
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
          answer.realEndAnswer
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
        text: 'SELECT * FROM SurveyAnswers WHERE id = $1',
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

  static readBySurveyId(req, res) : void {
    if (req.params && req.params.surveyId) {
      const pgSqlPool = new Pool();
      const surveyId = req.params.surveyId;
      const query = {
        text: 'SELECT * FROM SurveyAnswers WHERE survey_id = $1 ORDER BY id',
        values: [surveyId]
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
        text: 'SELECT * FROM SurveyAnswers WHERE question_id = $1 ORDER BY id',
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
        text: 'SELECT * FROM SurveyAnswers WHERE result_id = $1 ORDER BY id',
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
        req.body.surveyId,
        req.body.questionId,
        req.body.resultId,
        req.body.timeToAnswer,
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
        req.body.realEndAnswer
      );
      const id = req.params.id;
      const query = {
        text: 'UPDATE SurveyAnswers SET survey_id = $1, question_id = $2, result_id = $3, ' +
        'time_to_answer = $4, text_answer = $5, boolean_answer = $6, date_answer = $7, date_start_answer = $8, ' +
        'date_end_answer = $9, location_answers = $10, integer_answer = $11, integer_start_answer = $12, ' +
        'integer_end_answer = $13, real_answer = $14, real_start_answer = $15, real_end_answer = $16 ' +
        'WHERE id = $17',
        values: [
          answer.surveyId,
          answer.questionId,
          answer.resultId,
          answer.timeToAnswer,
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
        text: 'DELETE FROM SurveyAnswers WHERE id = $1',
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
