import { QuizController } from './quizzes/quizController';
import { QuizTemplatesController } from './quizzes/quizTemplatesController';
import { QuizResultsController } from './quizzes/quizResultsController';
import { QuizQuestionsController } from './quizzes/quizQuestionsController';
import { QuizAnswersController } from './quizzes/quizAnswersController';

export class EndpointsController {
  constructor(app) {
    this.runEndpoints(app)
  }

  runEndpoints(app) {
    console.log('in runEndpoints()');
    // Quizzes

    // Quizzes
    app.post('/api/admin/quizzes', QuizController.create) // Writes new quiz.
    app.get('/api/admin/quizzes/id/:id', QuizController.readById) // Reads quiz by id.
    app.get('/api/admin/quizzes/brief_name/:briefName', QuizController.readByBriefName) // Reads quiz by name.
    app.get('/api/admin/quizzes/title/:title', QuizController.readByTitle) // Reads quiz by title.
    app.get('/api/admin/quizzes', QuizController.readAll) // Reads all quizzes.
    app.put('/api/admin/quizzes/:id', QuizController.update) // Updates quiz.
    app.delete('/api/admin/quizzes/:id', QuizController.delete) // Deletes quiz.
    // Quiz Templates
    app.post('/api/admin/quiz_templates', QuizTemplatesController.create) // Writes new template.
    app.get('/api/admin/quiz_templates/id/:id', QuizTemplatesController.readById) // Reads template by id.
    app.get('/api/admin/quiz_templates/name/:name', QuizTemplatesController.readByName) // Reads template by name.
    app.get('/api/admin/quiz_templates/name_taken/:name', QuizTemplatesController.isNameTaken) // Returns true if name is taken.
    app.get('/api/admin/quiz_templates', QuizTemplatesController.readAll) // Reads all templates.
    app.put('/api/admin/quiz_templates/:id', QuizTemplatesController.update) // Updates template.
    app.delete('/api/admin/quiz_templates/:id', QuizTemplatesController.delete) // Deletes template.
    // Quiz Results
    app.post('/api/quiz_results', QuizResultsController.create) // Writes new results.
    app.get('/api/admin/quiz_results/quiz_id/:quizId', QuizResultsController.readByQuizId) // Reads results by quiz id.
    app.get('/api/admin/quiz_results/start_date/:startDate/end_date/:endDate', QuizResultsController.readByDateRange) // Reads results by date range.
    app.get('/api/admin/quiz_results', QuizResultsController.readAll) // Reads all results.
    // Quiz Questions
    app.post('/api/admin/quiz_questions', QuizQuestionsController.create) // Writes new quiz question.
    app.get('/api/admin/quiz_questions/id/:id', QuizQuestionsController.readById) // Reads question by id.
    app.get('/api/admin/quiz_questions/quiz_id/:quizId', QuizQuestionsController.readByQuizId) // Reads questions by quiz id.
    app.get('/api/admin/quiz_questions/template_id/:templateId', QuizQuestionsController.readByTemplateId) // Reads questions by template id.
    app.put('/api/admin/quiz_questions/:id', QuizQuestionsController.update) // Updates quiz question.
    app.delete('/api/admin/quiz_questions/:id', QuizQuestionsController.deleteById) // Deletes quiz question.
    app.delete('/api/admin/quiz_questions/quiz_id/:quizId', QuizQuestionsController.deleteByQuizId) // Deletes all quiz questions asssociated with quiz id.
    app.delete('/api/admin/quiz_questions/template_id/:templateId', QuizQuestionsController.deleteByTemplateId) // Deletes all quiz questions associated with template id.
    // Quiz Answers
    app.post('/api/quiz_answers', QuizAnswersController.create) // Writes new quiz answers.
    app.get('/api/admin/quiz_answers/id/:id', QuizAnswersController.readById) // Reads answer by id.
    app.get('/api/admin/quiz_answers/quiz_id/:quizId', QuizAnswersController.readByQuizId) // Reads answers by quiz id.
    app.get('/api/admin/quiz_answers/question_id/:questionId', QuizAnswersController.readByQuestionId) // Reads answer by question id.
    app.get('/api/admin/quiz_answers/results_id/:resultsId', QuizAnswersController.readByResultsId) // Reads answers by results id.
    app.put('/api/quiz_answers/:id', QuizAnswersController.update) // Updates quiz answer.
    app.delete('/api/admin/quiz_answers/:id', QuizAnswersController.delete) // Deletes quiz answer.
  }
}
