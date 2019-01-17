import { DeleteUnusedQuizQuestionsController } from './timedTasks/deleteUnusedQuizQuestions';

export class TimedTasksController {
  constructor() {
    this.runTimedTasks()
  }

  runTimedTasks() {
    setInterval(DeleteUnusedQuizQuestionsController.deleteUnusedQuizQuestions, 900000);
  }
}
