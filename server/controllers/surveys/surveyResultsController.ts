import { SurveyResultModel } from  '../../../models/surveys/survey-result.model';
import { Pool } from 'pg';

class Results extends SurveyResultModel {

  constructor(
    reqSurveyId: number,
    reqQuestionsAnswered: number,
    reqDatetimeSurveyCompleted: string,
    reqSurveyDuration: string
  ) {
    super();

    this.surveyId = reqSurveyId;
    this.questionsAnswered = reqQuestionsAnswered;
    this.datetimeSurveyCompleted = reqDatetimeSurveyCompleted;
    this.surveyDuration = reqSurveyDuration;
  };
}

export class SurveyResultsController {

  static create(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.body) {
        const results = new Results(
          req.body.surveyId,
          req.body.questionsAnswered,
          req.body.datetimeSurveyCompleted,
          req.body.surveyDuration
        );
        const query = {
          text: 'INSERT INTO SurveyResults(survey_id, questions_answered, datetime_survey_completed, ' +
          'survey_duration) VALUES($1, $2, $3, $4) RETURNING *',
          values: [
            results.surveyId,
            results.questionsAnswered,
            results.datetimeSurveyCompleted,
            results.surveyDuration
          ]
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

  static readBySurveyId(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.surveyId) {
        const surveyId = req.params.surveyId;
        const query = {
          text: 'SELECT * FROM SurveyResults WHERE survey_id = $1 ORDER BY id DESC',
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
  }

  static readByDateRange(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.params && req.params.startDate && req.params.endDate) {
        const startDate = req.params.startDate;
        const endDate = req.params.endDate;
        const query = {
          text: 'SELECT * FROM SurveyResults WHERE datetime_survey_completed >= $1 AND datetime_survey_completed <= $2 ' +
          'ORDER BY datetime_survey_completed DESC',
          values: [startDate, endDate]
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

  static readAll(pgSqlPool: Pool): any {
    return (req, res) => {
      const query = {
        text: 'SELECT * FROM SurveyResults ORDER BY datetime_survey_completed DESC',
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
}
