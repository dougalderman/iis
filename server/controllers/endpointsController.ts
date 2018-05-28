import { QuizController } from './quizzes/quizController';
import { QuizTemplatesController } from './quizzes/quizTemplatesController';

export class EndpointsController {
  constructor(app) {
    this.runEndpoints(app)
  }

  runEndpoints(app) {
    console.log('in runEndpoints()');
    // Quizzes
    // Quiz Templates
    app.post('/api/admin/quiz_templates', QuizTemplatesController.create) // Writes new template.
    app.get('/api/admin/quiz_templates/id/:id', QuizTemplatesController.readById) // Reads template by id.
    app.get('/api/admin/quiz_templates/name/:name', QuizTemplatesController.readByName) // Reads template by name.
    app.get('/api/admin/quiz_templates', QuizTemplatesController.readAll) // Reads all templates.
    app.put('/api/admin/quiz_templates/:id', QuizTemplatesController.update) // Updates template.
    app.delete('/api/admin/quiz_templates/:id', QuizTemplatesController.delete) // Deletes template.
    // Quizzes
    app.post('/api/admin/quizzes', QuizController.create) // Writes new quiz.
    app.get('/api/admin/quizzes/id/:id', QuizController.readById) // Reads quiz by id.
    app.get('/api/admin/quizzes/name/:briefName', QuizController.readByBriefName) // Reads quiz by name.
    app.get('/api/admin/quizzes/title/:title', QuizController.readByTitle) // Reads quiz by title.
    app.get('/api/admin/quizzes', QuizController.readAll) // Reads all quizzes.
    app.put('/api/admin/quizzes/:id', QuizController.update) // Updates quiz.
    app.delete('/api/admin/quizzes/:id', QuizController.delete) // Deletes quiz.

  }
}
