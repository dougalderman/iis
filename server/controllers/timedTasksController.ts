import { DeleteUnusedQuizQuestionsController } from './timedTasks/deleteUnusedQuizQuestions';

export class TimedTasksController {
  constructor() {
    this.runTimedTasks()
  }

  runTimedTasks() {
    console.log('in runTimedTasks()');
    setInterval(DeleteUnusedQuizQuestionsController.deleteUnusedQuizQuestions, 900000);
  }
}
