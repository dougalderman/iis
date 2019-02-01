import { SurveyQuestionModel } from  '../../../models/surveys/survey-question.model';
import { Pool } from 'pg';

class Question extends SurveyQuestionModel {

  constructor(
    reqSurveyId: number,
    reqTemplateId: number,
    reqTextQuestion: string,
    reqPictureQuestion: string,
    reqQuestionType: string,
    reqOptions: string[],
    reqIntegerStartAnswerRange: number,
    reqIntegerEndAnswerRange: number,
    reqRealStartAnswerRange: number,
    reqRealEndAnswerRange: number
  ) {
    super();

    this.surveyId = reqSurveyId;
    this.templateId = reqTemplateId;
    this.textQuestion = reqTextQuestion;
    this.pictureQuestion = reqPictureQuestion;
    this.questionType = reqQuestionType;
    this.options = reqOptions;
    this.integerStartAnswerRange = reqIntegerStartAnswerRange;
    this.integerEndAnswerRange = reqIntegerEndAnswerRange;
    this.realStartAnswerRange =  reqRealStartAnswerRange;
    this.realEndAnswerRange =  reqRealEndAnswerRange;
  }
}

export class SurveyQuestionsController {

  static create(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.body) {
        const question = new Question(
          req.body.surveyId,
          req.body.templateId,
          req.body.textQuestion,
          req.body.pictureQuestion,
          req.body.questionType,
          req.body.options,
          req.body.integerStartAnswerRange,
          req.body.integerEndAnswerRange,
          req.body.realStartAnswerRange,
          req.body.realEndAnswerRange
        );
        const query = {
          text: 'INSERT INTO SurveyQuestions(survey_id, template_id, text_question, ' +
            'picture_question, question_type, options, integer_start_answer_range, ' +
            'integer_end_answer_range, real_start_answer_range, real_end_answer_range) VALUES($1, $2, $3, $4, $5, $6, $7, ' +
            '$8, $9, $10)',
          values: [
            question.surveyId,
            question.templateId,
            question.textQuestion,
            question.pictureQuestion,
            question.questionType,
            JSON.stringify(question.options),
            question.integerStartAnswerRange,
            question.integerEndAnswerRange,
            question.realStartAnswerRange,
            question.realEndAnswerRange,
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
  }

  static readById(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.id) {
        const id = req.params.id;
        const query = {
          text: 'SELECT * FROM SurveyQuestions WHERE id = $1',
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
  }

  static readBySurveyId(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.surveyId) {
        const surveyId = req.params.surveyId;
        const query = {
          text: 'SELECT * FROM SurveyQuestions WHERE survey_id = $1 ORDER BY id',
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
  }

  static readByTemplateId(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.templateId) {
        const templateId = req.params.templateId;
        const query = {
          text: 'SELECT * FROM SurveyQuestions WHERE template_id = $1 ORDER BY id',
          values: [templateId]
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

  static update(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.body && req.params && req.params.id) {
        const question = new Question(
          req.body.surveyId,
          req.body.templateId,
          req.body.textQuestion,
          req.body.pictureQuestion,
          req.body.questionType,
          req.body.options,
          req.body.integerStartAnswerRange,
          req.body.integerEndAnswerRange,
          req.body.realStartAnswerRange,
          req.body.realEndAnswerRange
        );
        const id = req.params.id;
        const query = {
          text: 'UPDATE SurveyQuestions SET survey_id = $1, template_id = $2, text_question = $3, ' +
          'picture_question = $4, question_type = $5, options = $6, integer_start_answer_range = $7, ' +
          'integer_end_answer_range = $8, real_start_answer_range = $9, real_end_answer_range = $10 WHERE id = $11',
          values: [
            question.surveyId,
            question.templateId,
            question.textQuestion,
            question.pictureQuestion,
            question.questionType,
            JSON.stringify(question.options),
            question.integerStartAnswerRange,
            question.integerEndAnswerRange,
            question.realStartAnswerRange,
            question.realEndAnswerRange,
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
  }

  static updateSurveyId(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.body && req.params && req.params.id) {
        const id = req.params.id;
        const surveyId = req.body.surveyId;
        const query = {
          text: 'UPDATE SurveyQuestions SET survey_id = $1 WHERE id = $2',
          values: [
            surveyId,
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
  }

  static deleteById(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.id) {
        const id = req.params.id;
        const query = {
          text: 'DELETE FROM SurveyQuestions WHERE id = $1',
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

  static deleteBySurveyId(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.surveyId) {
        const surveyId = req.params.surveyId;
        const query = {
          text: 'UPDATE SurveyQuestions SET survey_id = NULL WHERE survey_id = $1',
          values: [surveyId]
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

  static deleteByTemplateId(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.templateId) {
        const templateId = req.params.templateId;
        const query = {
          text: 'UPDATE SurveyQuestions SET template_id = NULL WHERE template_id = $1',
          values: [templateId]
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
}
