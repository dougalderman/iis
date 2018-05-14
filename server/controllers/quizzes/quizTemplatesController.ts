import { QuizTemplates } from  '../../models/quizzes/quizTemplates';
import { Pool } from 'pg';
import { TemplateBinding } from '@angular/compiler';

class Template implements QuizTemplates {
  name: string;
  description: string;

  constructor(reqName: string, reqDescription: string) {
    this.name = reqName;
    this.description = reqDescription;
  }
}

export class QuizTemplatesController {

  static create(req, res) : void {
    console.log('in QuizTemplatesController');
    console.log('req.body: ', req.body);
    if (req.body) {
      const pgSqlPool = new Pool();
      const template = new Template(req.body.name, req.body.description);
      const query = {
        text: 'INSERT INTO QuizTemplates(name, description) VALUES($1, $2)',
        values: [template.name, template.description]
      }
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
  }
}


