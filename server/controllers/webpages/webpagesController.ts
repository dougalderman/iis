import { WebpageModel } from  '../../../models/webpages/webpage.model';
import { Pool } from 'pg';

class Webpage extends WebpageModel {

  constructor(reqQuizId: number, reqSurveyId: number, reqTitle: string) {
    super();

    this.quizId = reqQuizId;
    this.surveyId = reqSurveyId;
    this.title = reqTitle;
  };
}

export class WebpagesController {

  static create(req, res) : void {
     if (req.body) {
      const pgSqlPool = new Pool();
      const webpage = new Webpage(req.body.quizId, req.body.surveyId, req.body.title);
      const query = {
        text: 'INSERT INTO Webpages(quiz_id, survey_id, title) VALUES($1, $2, $3) RETURNING *',
        values: [webpage.quizId, webpage.surveyId, webpage.title]
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
        text: 'SELECT * FROM Webpages WHERE id = $1',
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
        text: 'SELECT * FROM Webpages WHERE quiz_id = $1 ORDER BY quiz_id',
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

  static readBySurveyId(req, res) : void {
    if (req.params && req.params.surveyId) {
      const pgSqlPool = new Pool();
      const surveyId = req.params.surveyId;
      const query = {
        text: 'SELECT * FROM Webpages WHERE survey_id = $1 ORDER BY survey_id',
        values: [surveyId]
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

  static readByTitle(req, res) : void {
    if (req.params && req.params.title) {
      const pgSqlPool = new Pool();
      const title = req.params.title;
      const query = {
        text: 'SELECT * FROM Webpages WHERE title ILIKE $1 ORDER BY title',
        values: [title]
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

  static readAll(req, res) : void {
    const pgSqlPool = new Pool();
    const query = {
      text: 'SELECT * FROM Webpages ORDER BY title',
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
      const webpage = new Webpage(req.body.quizId, req.body.surveyId, req.body.title);
      const id = req.params.id;
      const query = {
        text: 'UPDATE Webpages SET quiz_id = $1, survey_id = $2, title = $3 WHERE id = $4',
        values: [webpage.quizId, webpage.surveyId, webpage.title, id]
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
        text: 'DELETE FROM Webpages WHERE id = $1',
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
