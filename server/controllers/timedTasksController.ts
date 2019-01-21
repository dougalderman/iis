import { DeleteUnusedQuizQuestionsController } from './timedTasks/deleteUnusedQuizQuestions';
import { DeleteUnusedSurveyQuestionsController } from './timedTasks/deleteUnusedSurveyQuestions';

export class TimedTasksController {
  constructor() {
    this.runTimedTasks()
  }

  runTimedTasks() {
    setInterval(DeleteUnusedQuizQuestionsController.deleteUnusedQuizQuestions, 900000); // every 15 minutes
    setInterval(DeleteUnusedSurveyQuestionsController.deleteUnusedSurveyQuestions, 900000); // every 15 minutes
  }
}
