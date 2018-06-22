import { QuizQuestions } from  '../../models/quizzes/quizQuestions';
import { Pool } from 'pg';

class Question implements QuizQuestions {
  quizId: number;
  templateId: number;
  textQuestion: string;
  pictureQuestion: string;
  questionType: string;
  options: object;
  booleanCorectAnswer: boolean;
  correctAnswer: string;
  locationCorrectAnswers: [object];
  dateCorrectAnswer: Date;
  dateStartCorrectAnswer: Date;
  dateEndCorrectAnswer: Date;
  integerCorrectAnswer: number;
  realCorrectAnswer: number;

  constructor(
    reqQuizId: number,
    reqTemplateId: number,
    reqTextQuestion: string,
    reqPictureQuestion: string,
    reqQuestionType: string,
    reqOptions: object,
    reqBooleanCorrectAnswer: boolean,
    reqCorrectAnswer: string,
    reqLocationCorrectAnswers: [object],
    reqDateCorrectAnswer: Date,
    reqDateStartCorrectAnswer: Date,
    reqDateEndCorrectAnswer: Date,
    reqIntegerCorrectAnswer: number,
    reqRealCorrectAnswer: number
  ) {
    this.quizId = reqQuizId;
    this.templateId = reqTemplateId;
    this.textQuestion = reqTextQuestion;
    this.pictureQuestion = reqPictureQuestion;
    this.questionType = reqQuestionType;
    this.options = reqOptions;
    this.booleanCorectAnswer = reqBooleanCorrectAnswer;
    this.correctAnswer = reqCorrectAnswer;
    this.locationCorrectAnswers = reqLocationCorrectAnswers;
    this.dateCorrectAnswer = reqDateCorrectAnswer;
    this.dateStartCorrectAnswer = reqDateStartCorrectAnswer;
    this.dateEndCorrectAnswer = reqDateEndCorrectAnswer;
    this.integerCorrectAnswer = reqIntegerCorrectAnswer;
    this.realCorrectAnswer =  reqRealCorrectAnswer;
  }
}

export class QuizQuestionsController {

  static create(req, res) : void {
    console.log('in QuizQuestionsController--create()');
    console.log('req.body: ', req.body);
    if (req.body) {
      const pgSqlPool = new Pool();
      const question = new Question(
        req.body.quizId,
        req.body.templateId,
        req.body.textQuestion,
        req.body.pictureQuestion,
        req.body.questionType,
        req.body.options,
        req.body.booleanCorectAnswer,
        req.body.correctAnswer,
        req.body.locationCorrectAnswers,
        req.body.dateCorrectAnswer,
        req.body.dateStartCorrectAnswer,
        req.body.dateEndCorrectAnswer,
        req.body.integerCorrectAnswer,
        req.body.realCorrectAnswer
      );
      const query = {
        text: 'INSERT INTO QuizQuestions(quiz_id, template_id, text_question, ' +
          'picture_question, question_type, options, boolean_correct_answer, ' +
          'correct_answer, location_correct_answers, date_correct_answer, ' +
          'date_start_correct_answer, date_end_correct_answer, integer_correct_answer, ' +
          'real_correct_answer) VALUES($1, $2, $3, $4, $5, $6, $7, ' +
          '$8, $9, $10, $11, $12, $13, $14)',
        values: [
          question.quizId,
          question.templateId,
          question.textQuestion,
          question.pictureQuestion,
          question.questionType,
          question.options,
          question.booleanCorectAnswer,
          question.correctAnswer,
          question.locationCorrectAnswers,
          question.dateCorrectAnswer,
          question.dateStartCorrectAnswer,
          question.dateEndCorrectAnswer,
          question.integerCorrectAnswer,
          question.realCorrectAnswer
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
    console.log('in QuizQuestionsController--readById()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const query = {
        text: 'SELECT * FROM QuizQuestions WHERE id = $1',
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
    console.log('in QuizQuestionsController--readByQuizId()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.quizId) {
      const pgSqlPool = new Pool();
      const quizId = req.params.quizId;
      const query = {
        text: 'SELECT * FROM QuizQuestions WHERE quiz_id = $1 ORDER BY id',
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

  static readByTemplateId(req, res) : void {
    console.log('in QuizQuestionsController--readByTemplateId()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.templateId) {
      const pgSqlPool = new Pool();
      const templateId = req.params.templateId;
      const query = {
        text: 'SELECT * FROM QuizQuestions WHERE template_id = $1 ORDER BY id',
        values: [templateId]
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
    console.log('in QuizQuestionsController--update()');
    console.log('req.body: ', req.body);
    console.log('req.params: ', req.params);
    if (req.body && req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const question = new Question(
        req.body.quizId,
        req.body.templateId,
        req.body.textQuestion,
        req.body.pictureQuestion,
        req.body.questionType,
        req.body.options,
        req.body.booleanCorectAnswer,
        req.body.correctAnswer,
        req.body.locationCorrectAnswers,
        req.body.dateCorrectAnswer,
        req.body.dateStartCorrectAnswer,
        req.body.dateEndCorrectAnswer,
        req.body.integerCorrectAnswer,
        req.body.realCorrectAnswer
      );
      const id = req.params.id;
      const query = {
        text: 'UPDATE QuizQuestions SET quiz_id = $1, template_id = $2, text_question = $3, ' +
        'picture_question = $4, question_type = $5, options = $6, boolean_correct_answer = $7, ' +
        'correct_answer = $8, location_correct_answers = $9, date_correct_answer = $10, ' +
        'date_start_correct_answer = $11, date_end_correct_answer = $12, integer_correct_answer = $13, ' +
        'real_correct_answer = $14 WHERE id = $15',
        values: [
          question.quizId,
          question.templateId,
          question.textQuestion,
          question.pictureQuestion,
          question.questionType,
          question.options,
          question.booleanCorectAnswer,
          question.correctAnswer,
          question.locationCorrectAnswers,
          question.dateCorrectAnswer,
          question.dateStartCorrectAnswer,
          question.dateEndCorrectAnswer,
          question.integerCorrectAnswer,
          question.realCorrectAnswer,
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
    console.log('in QuizQuestionsController--delete()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const query = {
        text: 'DELETE FROM QuizQuestions WHERE id = $1',
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


