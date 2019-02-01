import { Pool } from 'pg';

import { DeleteUnusedQuizQuestionsController } from './timedTasks/deleteUnusedQuizQuestions';
import { DeleteUnusedSurveyQuestionsController } from './timedTasks/deleteUnusedSurveyQuestions';

export class TimedTasksController {
  constructor(pgSqlPool: Pool) {
    this.runTimedTasks(pgSqlPool)
  }

  runTimedTasks(pgSqlPool: Pool) {
    setInterval(() => { DeleteUnusedQuizQuestionsController.deleteUnusedQuizQuestions(pgSqlPool) }, 900000); // every 15 minutes
    setInterval(() => { DeleteUnusedSurveyQuestionsController.deleteUnusedSurveyQuestions(pgSqlPool) }, 900000); // every 15 minutes
  }
}
