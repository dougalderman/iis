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
    console.log('in QuizTemplatesController--create()');
    console.log('req.body: ', req.body);
    if (req.body) {
      const pgSqlPool = new Pool();
      const template = new Template(req.body.name, req.body.description);
      const query = {
        text: 'INSERT INTO QuizTemplates(name, description) VALUES($1, $2)',
        values: [template.name, template.description]
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
    console.log('in QuizTemplatesController--readById()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const query = {
        text: 'SELECT * FROM QuizTemplates WHERE id = $1',
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

  static readByName(req, res) : void {
    console.log('in QuizTemplatesController--readByName()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.name) {
      const pgSqlPool = new Pool();
      const name = '%' + req.params.name + '%';
      const query = {
        text: 'SELECT * FROM QuizTemplates WHERE name ILIKE $1 ORDER BY name',
        values: [name]
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
    console.log('in QuizTemplatesController--readAll()');
    const pgSqlPool = new Pool();
    const query = {
      text: 'SELECT * FROM QuizTemplates ORDER BY name',
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

  static update(req, res) : void {
    console.log('in QuizTemplatesController--update()');
    console.log('req.body: ', req.body);
    console.log('req.params: ', req.params);
    if (req.body && req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const template = new Template(req.body.name, req.body.description);
      const id = req.params.id;
      const query = {
        text: 'UPDATE QuizTemplates SET name = $1, description = $2 WHERE id = $3',
        values: [template.name, template.description, id]
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
    console.log('in QuizTemplatesController--update()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const query = {
        text: 'DELETE FROM QuizTemplates WHERE id = $1',
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


