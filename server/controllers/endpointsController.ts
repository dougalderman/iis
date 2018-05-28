import { QuizTemplatesController } from './quizzes/QuizTemplatesController';

export class EndpointsController {
  constructor(app) {
    this.runEndpoints(app)
  }

  runEndpoints(app) {
    console.log('in runEndpoints()');
    // Quizzes
    app.post('/api/admin/quiz_templates', QuizTemplatesController.create) // Writes new template.
    app.get('/api/admin/quiz_templates/id/:id', QuizTemplatesController.readById) // Reads template by id.
    app.get('/api/admin/quiz_templates/name/:name', QuizTemplatesController.readByName) // Reads template by name.
    app.get('/api/admin/quiz_templates', QuizTemplatesController.readAll) // Reads all templates.
    app.put('/api/admin/quiz_templates/:id', QuizTemplatesController.update) // Updates template.
    app.delete('/api/admin/quiz_templates/:id', QuizTemplatesController.delete) // Deletes template.
  }
}
