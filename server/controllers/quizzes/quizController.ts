import { Quizzes } from  '../../models/quizzes/quizzes';
import { Pool } from 'pg';

class Quiz implements Quizzes {
  briefName: string
  title: string;
  config: object;

  constructor(reqBriefName: string, reqTitle: string, reqConfig: object) {
    this.briefName = reqBriefName;
    this.title = reqTitle;
    this.config = reqConfig;
  };
}

export class QuizController {

  static create(req, res) : void {
    console.log('in QuizController--create()');
    console.log('req.body: ', req.body);
    if (req.body) {
      const pgSqlPool = new Pool();
      const quiz = new Quiz(req.body.briefName, req.body.title, req.body.config);
      const query = {
        text: 'INSERT INTO Quizzes(brief_name, title, config) VALUES($1, $2, $3)',
        values: [quiz.briefName, quiz.title, quiz.config]
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
    console.log('in QuizController--readById()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const query = {
        text: 'SELECT * FROM Quizzes WHERE id = $1',
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

  static readByBriefName(req, res) : void {
    console.log('in QuizController--readByBriefName()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.briefName) {
      const pgSqlPool = new Pool();
      const name = '%' + req.params.briefName + '%';
      const query = {
        text: 'SELECT * FROM Quizzes WHERE brief_name ILIKE $1 ORDER BY brief_name',
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

  static readByTitle(req, res) : void {
    console.log('in QuizController--readByTitle()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.title) {
      const pgSqlPool = new Pool();
      const title = '%' + req.params.title + '%';
      const query = {
        text: 'SELECT * FROM Quizzes WHERE title ILIKE $1 ORDER BY title',
        values: [title]
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
    console.log('in QuizController--readAll()');
    const pgSqlPool = new Pool();
    const query = {
      text: 'SELECT * FROM Quizzes ORDER BY title',
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
    console.log('in QuizController--update()');
    console.log('req.body: ', req.body);
    console.log('req.params: ', req.params);
    if (req.body && req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const quiz = new Quiz(req.body.briefName, req.body.title, req.body.config);
      const id = req.params.id;
      const query = {
        text: 'UPDATE Quizzes SET brief_name = $1, title = $2, config = $3 WHERE id = $4',
        values: [quiz.briefName, quiz.title, quiz.config, id]
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
    console.log('in QuizController--delete()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const query = {
        text: 'DELETE FROM Quizzes WHERE id = $1',
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
