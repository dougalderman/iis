import { SurveyTemplateModel } from  '../../../models/surveys/survey-template.model';
import { Pool } from 'pg';

class Template extends SurveyTemplateModel {

  constructor(reqName: string, reqDescription: string) {
    super();

    this.name = reqName;
    this.description = reqDescription;
  };
}

export class SurveyTemplatesController {

  static create(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.body) {
        const template = new Template(req.body.name, req.body.description);
        const query = {
          text: 'INSERT INTO SurveyTemplates(name, description) VALUES($1, $2) RETURNING *',
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
  }

  static readById(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.id) {
        const id = req.params.id;
        const query = {
          text: 'SELECT * FROM SurveyTemplates WHERE id = $1',
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

  static readByName(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.name) {
        const name = req.params.name;
        const query = {
          text: 'SELECT * FROM SurveyTemplates WHERE name = $1 ORDER BY name',
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
  }

  static isNameTaken(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.name) {
        const name = req.params.name;
        const query = {
          text: 'SELECT * FROM SurveyTemplates WHERE name = $1 ORDER BY name',
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
  }

  static readAll(pgSqlPool: Pool): any {
    return (req, res) => {
      const query = {
        text: 'SELECT * FROM SurveyTemplates ORDER BY name',
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
  }

  static update(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.body && req.params && req.params.id) {
        const template = new Template(req.body.name, req.body.description);
        const id = req.params.id;
        const query = {
          text: 'UPDATE SurveyTemplates SET name = $1, description = $2 WHERE id = $3',
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
  }

  static delete(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.id) {
        const id = req.params.id;
        const query = {
          text: 'DELETE FROM SurveyTemplates WHERE id = $1',
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
}
