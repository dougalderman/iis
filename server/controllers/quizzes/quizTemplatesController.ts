import { QuizTemplateModel } from  '../../../models/quizzes/quiz-template.model';
import { Pool } from 'pg';

class Template extends QuizTemplateModel {

  constructor(reqName: string, reqDescription: string) {
    super();

    this.name = reqName;
    this.description = reqDescription;
  };
}

export class QuizTemplatesController {

  static create(req, res) : void {
    if (req.body) {
      const pgSqlPool = new Pool();
      const template = new Template(req.body.name, req.body.description);
      const query = {
        text: 'INSERT INTO QuizTemplates(name, description) VALUES($1, $2) RETURNING *',
        values: [template.name, template.description]
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

  static readById(req, res) : void {
    if (req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const id = req.params.id;
      const query = {
        text: 'SELECT * FROM QuizTemplates WHERE id = $1',
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

  static readByName(req, res) : void {
    if (req.params && req.params.name) {
      const pgSqlPool = new Pool();
      const name = req.params.name;
      const query = {
        text: 'SELECT * FROM QuizTemplates WHERE name = $1 ORDER BY name',
        values: [name]
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

  static isNameTaken(req, res) : void {
    if (req.params && req.params.name) {
      const pgSqlPool = new Pool();
      const name = req.params.name;
      const query = {
        text: 'SELECT * FROM QuizTemplates WHERE name = $1 ORDER BY name',
        values: [name]
      };
      pgSqlPool.query(query)
      .then(result => {
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
    const pgSqlPool = new Pool();
    const query = {
      text: 'SELECT * FROM QuizTemplates ORDER BY name',
      values: []
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

  static update(req, res) : void {
    if (req.body && req.params && req.params.id) {
      const pgSqlPool = new Pool();
      const template = new Template(req.body.name, req.body.description);
      const id = req.params.id;
      const query = {
        text: 'UPDATE QuizTemplates SET name = $1, description = $2 WHERE id = $3',
        values: [template.name, template.description, id]
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
        text: 'DELETE FROM QuizTemplates WHERE id = $1',
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
