import { QuizTemplates } from  '../../models/quizzes/quizTemplates';
import { Pool } from 'pg';
import { TemplateBinding } from '@angular/compiler';

class Template implements QuizTemplates {
  name: string;
  description: string;

  constructor(reqName: string, reqDescription: string) {
    this.name = reqName;
    this.description = reqDescription;
  };
}

export class QuizTemplatesController {

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
        text: 'SELECT * FROM QuizTemplates WHERE ID = $1',
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
        text: 'SELECT * FROM QuizTemplates WHERE NAME ILIKE $1 ORDER BY NAME',
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
      text: 'SELECT * FROM QuizTemplates ORDER BY NAME',
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
        text: 'UPDATE QuizTemplates SET NAME = $1, DESCRIPTION = $2 WHERE ID = $3',
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
        text: 'DELETE FROM QuizTemplates WHERE ID = $1',
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


