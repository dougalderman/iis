import { QuizModel, QuizConfigModel } from  '../../../models/quizzes/quiz.model';
import { Pool } from 'pg';

class Quiz extends QuizModel {

  constructor(reqUniqueName: string, reqTitle: string, reqDescription: string, reqConfig: QuizConfigModel) {
    super();

    this.uniqueName = reqUniqueName;
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
      const quiz = new Quiz(req.body.uniqueName, req.body.title, req.body.description, req.body.config);
      const query = {
        text: 'INSERT INTO Quizzes(unique_name, title, description, config) VALUES($1, $2, $3, $4) RETURNING *',
        values: [quiz.uniqueName, quiz.title, quiz.description, quiz.config]
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

  static readByUniqueName(req, res) : void {
    console.log('in QuizController--readByUniqueName()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.uniqueName) {
      const pgSqlPool = new Pool();
      const uniqueName = req.params.uniqueName;
      const query = {
        text: 'SELECT * FROM Quizzes WHERE unique_name = $1 ORDER BY unique_name',
        values: [uniqueName]
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

  static isUniqueNameTaken(req, res) : void {
    console.log('in QuizController--isUniqueNameTaken()');
    console.log('req.params: ', req.params);
    if (req.params && req.params.uniqueName) {
      const pgSqlPool = new Pool();
      const uniqueName = req.params.uniqueName;
      const query = {
        text: 'SELECT * FROM Quizzes WHERE unique_name = $1 ORDER BY unique_name',
        values: [uniqueName]
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
      const quiz = new Quiz(req.body.uniqueName, req.body.title, req.body.description, req.body.config);
      const id = req.params.id;
      const query = {
        text: 'UPDATE Quizzes SET unique_name = $1, title = $2, description = $3, config = $4 WHERE id = $5',
        values: [quiz.uniqueName, quiz.title, quiz.description, quiz.config, id]
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
