import { QuizTemplatesController } from './quizzes/QuizTemplatesController';

export class EndpointsController {
  constructor(app) {
    this.runEndpoints(app)
  }

  runEndpoints(app) {
    console.log('in runEndpoints()');
    // Quizzes
    app.post('/api/admin/quiz_templates', QuizTemplatesController.create) // Writes new template.
  }
}
