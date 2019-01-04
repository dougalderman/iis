import { QuizModel, QuizConfigModel } from  '../../../models/quizzes/quiz.model';
import { Pool } from 'pg';

class Quiz extends QuizModel {

  constructor(reqTitle: string, reqDescription: string, reqConfig: QuizConfigModel) {
    super();

    this.title = reqTitle;
    this.description = reqDescription;
    this.config = reqConfig;
  };
}

export class QuizController {

  static create(req, res) : void {
    console.log('in QuizController--create()');
    console.log('req.body: ', req.body);
    if (req.body) {
      const pgSqlPool = new Pool();
      const quiz = new Quiz(req.body.title, req.body.description, req.body.config);
      const query = {
        text: 'INSERT INTO Quizzes(title, description, config) VALUES($1, $2, $3)',
        values: [quiz.title, quiz.description, quiz.config]
      };
      console.log('query: ', query);
      pgSqlPool.query(query)
      .then(result => {
        console.log('result: ', result);
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

  static readByTitle(req, res) : void {
    console.log('in QuizController--readByTitle()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.title) {
      const pgSqlPool = new Pool();
      const title = req.params.title;
      const query = {
        text: 'SELECT * FROM Quizzes WHERE title = $1 ORDER BY title',
        values: [title]
      };
      console.log('query: ', query);
      pgSqlPool.query(query)
      .then(result => {
        console.log('result: ', result);
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

  static isTitleTaken(req, res) : void {
    console.log('in QuizController--isTitleTaken()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.title) {
      const pgSqlPool = new Pool();
      const title = req.params.title;
      const query = {
        text: 'SELECT * FROM Quizzes WHERE title = $1 ORDER BY title',
        values: [title]
      };
      console.log('query: ', query);
      pgSqlPool.query(query)
      .then(result => {
        console.log('result: ', result);
        if (result && result.rows && result.rows.length) {
          res.send(true);
        }
        else {
          res.send(false);
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

  static update(req, res) : void {
    console.log('in QuizController--update()');
    console.log('req.body: ', req.body);
    console.log('req.params: ', req.params);
    if (req.body && req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const quiz = new Quiz(req.body.title, req.body.description, req.body.config);
      const id = req.params.id;
      const query = {
        text: 'UPDATE Quizzes SET title = $1, description = $2, config = $3 WHERE id = $4',
        values: [quiz.title, quiz.description, quiz.config, id]
      };
      console.log('query: ', query);
      pgSqlPool.query(query)
      .then(result => {
        console.log('result: ', result);
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
