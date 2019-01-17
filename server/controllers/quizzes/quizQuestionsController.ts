import { QuizQuestionModel, QuizQuestionOptionModel } from  '../../../models/quizzes/quiz-question.model';
import { Pool } from 'pg';

class Question extends QuizQuestionModel {

  constructor(
    reqQuizId: number,
    reqTemplateId: number,
    reqTextQuestion: string,
    reqPictureQuestion: string,
    reqQuestionType: string,
    reqOptions: QuizQuestionOptionModel[],
    reqBooleanCorrectAnswer: boolean,
    reqCorrectAnswerArray: string[],
    reqLocationCorrectAnswers: any[],
    reqDateCorrectAnswer: Date,
    reqDateStartCorrectAnswer: Date,
    reqDateEndCorrectAnswer: Date,
    reqIntegerCorrectAnswer: number,
    reqIntegerStartCorrectAnswer: number,
    reqIntegerEndCorrectAnswer: number,
    reqRealCorrectAnswer: number,
    reqRealStartCorrectAnswer: number,
    reqRealEndCorrectAnswer: number
  ) {
    super();

    this.quizId = reqQuizId;
    this.templateId = reqTemplateId;
    this.textQuestion = reqTextQuestion;
    this.pictureQuestion = reqPictureQuestion;
    this.questionType = reqQuestionType;
    this.options = reqOptions;
    this.booleanCorrectAnswer = reqBooleanCorrectAnswer;
    this.correctAnswerArray = reqCorrectAnswerArray;
    this.locationCorrectAnswers = reqLocationCorrectAnswers;
    this.dateCorrectAnswer = reqDateCorrectAnswer;
    this.dateStartCorrectAnswer = reqDateStartCorrectAnswer;
    this.dateEndCorrectAnswer = reqDateEndCorrectAnswer;
    this.integerCorrectAnswer = reqIntegerCorrectAnswer;
    this.integerStartCorrectAnswer = reqIntegerStartCorrectAnswer;
    this.integerEndCorrectAnswer = reqIntegerEndCorrectAnswer;
    this.realCorrectAnswer =  reqRealCorrectAnswer;
    this.realStartCorrectAnswer =  reqRealStartCorrectAnswer;
    this.realEndCorrectAnswer =  reqRealEndCorrectAnswer;
  }
}

export class QuizQuestionsController {

  static create(req, res) : void {
    if (req.body) {
      const pgSqlPool = new Pool();
      const question = new Question(
        req.body.quizId,
        req.body.templateId,
        req.body.textQuestion,
        req.body.pictureQuestion,
        req.body.questionType,
        req.body.options,
        req.body.booleanCorrectAnswer,
        req.body.correctAnswerArray,
        req.body.locationCorrectAnswers,
        req.body.dateCorrectAnswer,
        req.body.dateStartCorrectAnswer,
        req.body.dateEndCorrectAnswer,
        req.body.integerCorrectAnswer,
        req.body.integerStartCorrectAnswer,
        req.body.integerEndCorrectAnswer,
        req.body.realCorrectAnswer,
        req.body.realStartCorrectAnswer,
        req.body.realEndCorrectAnswer
      );
      const query = {
        text: 'INSERT INTO QuizQuestions(quiz_id, template_id, text_question, ' +
          'picture_question, question_type, options, boolean_correct_answer, ' +
          'correct_answer_array, location_correct_answers, date_correct_answer, ' +
          'date_start_correct_answer, date_end_correct_answer, integer_correct_answer, ' +
          'integer_start_correct_answer, integer_end_correct_answer, real_correct_answer, ' +
          'real_start_correct_answer, real_end_correct_answer) VALUES($1, $2, $3, $4, $5, $6, $7, ' +
          '$8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)',
        values: [
          question.quizId,
          question.templateId,
          question.textQuestion,
          question.pictureQuestion,
          question.questionType,
          JSON.stringify(question.options),
          question.booleanCorrectAnswer,
          question.correctAnswerArray,
          question.locationCorrectAnswers,
          question.dateCorrectAnswer,
          question.dateStartCorrectAnswer,
          question.dateEndCorrectAnswer,
          question.integerCorrectAnswer,
          question.integerStartCorrectAnswer,
          question.integerEndCorrectAnswer,
          question.realCorrectAnswer,
          question.realStartCorrectAnswer,
          question.realEndCorrectAnswer,
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
        text: 'SELECT * FROM QuizQuestions WHERE id = $1',
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
        text: 'SELECT * FROM QuizQuestions WHERE quiz_id = $1 ORDER BY id',
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

  static readByTemplateId(req, res) : void {
    if (req.params && req.params.templateId) {
      const pgSqlPool = new Pool();
      const templateId = req.params.templateId;
      const query = {
        text: 'SELECT * FROM QuizQuestions WHERE template_id = $1 ORDER BY id',
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

  static update(req, res) : void {
    if (req.body && req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const question = new Question(
        req.body.quizId,
        req.body.templateId,
        req.body.textQuestion,
        req.body.pictureQuestion,
        req.body.questionType,
        req.body.options,
        req.body.booleanCorrectAnswer,
        req.body.correctAnswerArray,
        req.body.locationCorrectAnswers,
        req.body.dateCorrectAnswer,
        req.body.dateStartCorrectAnswer,
        req.body.dateEndCorrectAnswer,
        req.body.integerCorrectAnswer,
        req.body.integerStartCorrectAnswer,
        req.body.integerEndCorrectAnswer,
        req.body.realCorrectAnswer,
        req.body.realStartCorrectAnswer,
        req.body.realEndCorrectAnswer
      );
      const id = req.params.id;
      const query = {
        text: 'UPDATE QuizQuestions SET quiz_id = $1, template_id = $2, text_question = $3, ' +
        'picture_question = $4, question_type = $5, options = $6, boolean_correct_answer = $7, ' +
        'correct_answer_array = $8, location_correct_answers = $9, date_correct_answer = $10, ' +
        'date_start_correct_answer = $11, date_end_correct_answer = $12, integer_correct_answer = $13, ' +
        'integer_start_correct_answer = $14, integer_end_correct_answer = $15, real_correct_answer = $16, ' +
        'real_start_correct_answer = $17, real_end_correct_answer = $18 WHERE id = $19',
        values: [
          question.quizId,
          question.templateId,
          question.textQuestion,
          question.pictureQuestion,
          question.questionType,
          JSON.stringify(question.options),
          question.booleanCorrectAnswer,
          question.correctAnswerArray,
          question.locationCorrectAnswers,
          question.dateCorrectAnswer,
          question.dateStartCorrectAnswer,
          question.dateEndCorrectAnswer,
          question.integerCorrectAnswer,
          question.integerStartCorrectAnswer,
          question.integerEndCorrectAnswer,
          question.realCorrectAnswer,
          question.realStartCorrectAnswer,
          question.realEndCorrectAnswer,
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

  static updateQuizId(req, res) : void {
    if (req.body && req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const quizId = req.body.quizId;
      const query = {
        text: 'UPDATE QuizQuestions SET quiz_id = $1 WHERE id = $2',
        values: [
          quizId,
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

  static deleteById(req, res) : void {
    if (req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const query = {
        text: 'DELETE FROM QuizQuestions WHERE id = $1',
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

  static deleteByQuizId(req, res) : void {
    if (req.params && req.params.quizId) {
      const pgSqlPool = new Pool();
      const quizId = req.params.quizId;
      const query = {
        text: 'UPDATE QuizQuestions SET quiz_id = NULL WHERE quiz_id = $1',
        values: [quizId]
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

  static deleteByTemplateId(req, res) : void {
    if (req.params && req.params.templateId) {
      const pgSqlPool = new Pool();
      const templateId = req.params.templateId;
      const query = {
        text: 'UPDATE QuizQuestions SET template_id = NULL WHERE template_id = $1',
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
