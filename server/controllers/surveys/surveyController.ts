import { SurveyModel, SurveyConfigModel } from  '../../../models/surveys/survey.model';
import { Pool } from 'pg';

class Survey extends SurveyModel {

  constructor(reqUniqueName: string, reqTitle: string, reqDescription: string, reqConfig: SurveyConfigModel) {
    super();

    this.uniqueName = reqUniqueName;
    this.title = reqTitle;
    this.description = reqDescription;
    this.config = reqConfig;
  };
}

export class SurveyController {

  static create(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.body) {
        const survey = new Survey(req.body.uniqueName, req.body.title, req.body.description, req.body.config);
        const query = {
          text: 'INSERT INTO Surveys(unique_name, title, description, config) VALUES($1, $2, $3, $4) RETURNING *',
          values: [survey.uniqueName, survey.title, survey.description, survey.config]
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
          text: 'SELECT * FROM Surveys WHERE id = $1',
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

  static readByUniqueName(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.uniqueName) {
        const uniqueName = req.params.uniqueName;
        const query = {
          text: 'SELECT * FROM Surveys WHERE unique_name = $1 ORDER BY unique_name',
          values: [uniqueName]
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

  static isUniqueNameTaken(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.uniqueName) {
        const uniqueName = req.params.uniqueName;
        const query = {
          text: 'SELECT * FROM Surveys WHERE unique_name = $1 ORDER BY unique_name',
          values: [uniqueName]
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
        text: 'SELECT * FROM Surveys ORDER BY title',
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
        const survey = new Survey(req.body.uniqueName, req.body.title, req.body.description, req.body.config);
        const id = req.params.id;
        const query = {
          text: 'UPDATE Surveys SET unique_name = $1, title = $2, description = $3, config = $4 WHERE id = $5',
          values: [survey.uniqueName, survey.title, survey.description, survey.config, id]
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
          text: 'DELETE FROM Surveys WHERE id = $1',
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
