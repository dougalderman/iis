import { Pool } from 'pg';

import { QuizController } from './quizzes/quizController';
import { QuizTemplatesController } from './quizzes/quizTemplatesController';
import { QuizResultsController } from './quizzes/quizResultsController';
import { QuizQuestionsController } from './quizzes/quizQuestionsController';
import { QuizAnswersController } from './quizzes/quizAnswersController';

import { SurveyController } from './surveys/surveyController';
import { SurveyTemplatesController } from './surveys/surveyTemplatesController';
import { SurveyResultsController } from './surveys/surveyResultsController';
import { SurveyQuestionsController } from './surveys/surveyQuestionsController';
import { SurveyAnswersController } from './surveys/surveyAnswersController';

import { WebpagesController } from './webpages/webpagesController';

export class EndpointsController {
  constructor(app: any, pgSqlPool: Pool) {
    this.runEndpoints(app, pgSqlPool)
  }

  runEndpoints(app: any, pgSqlPool: Pool) {
    // Quiz Endpoints

    // Quizzes
    app.post('/api/admin/quizzes', QuizController.create(pgSqlPool)) // Writes new quiz.
    app.get('/api/admin/quizzes/id/:id', QuizController.readById(pgSqlPool)) // Reads quiz by id.
    app.get('/api/admin/quizzes/unique_name/:uniqueName', QuizController.readByUniqueName(pgSqlPool)) // Reads quiz by unique name.
    app.get('/api/admin/quizzes/unique_name_taken/:uniqueName', QuizController.isUniqueNameTaken(pgSqlPool)) // Returns true if unique name is taken.
    app.get('/api/admin/quizzes', QuizController.readAll(pgSqlPool)) // Reads all quizzes.
    app.put('/api/admin/quizzes/:id', QuizController.update(pgSqlPool)) // Updates quiz.
    app.delete('/api/admin/quizzes/:id', QuizController.delete(pgSqlPool)) // Deletes quiz.
    // Quiz Templates
    app.post('/api/admin/quiz_templates', QuizTemplatesController.create(pgSqlPool)) // Writes new template.
    app.get('/api/admin/quiz_templates/id/:id', QuizTemplatesController.readById(pgSqlPool)) // Reads template by id.
    app.get('/api/admin/quiz_templates/name/:name', QuizTemplatesController.readByName(pgSqlPool)) // Reads template by name.
    app.get('/api/admin/quiz_templates/name_taken/:name', QuizTemplatesController.isNameTaken(pgSqlPool)) // Returns true if name is taken.
    app.get('/api/admin/quiz_templates', QuizTemplatesController.readAll(pgSqlPool)) // Reads all templates.
    app.put('/api/admin/quiz_templates/:id', QuizTemplatesController.update(pgSqlPool)) // Updates template.
    app.delete('/api/admin/quiz_templates/:id', QuizTemplatesController.delete(pgSqlPool)) // Deletes template.
    // Quiz Results
    app.post('/api/quiz_results', QuizResultsController.create) // Writes new results.
    app.get('/api/admin/quiz_results/quiz_id/:quizId', QuizResultsController.readByQuizId(pgSqlPool)) // Reads results by quiz id.
    app.get('/api/admin/quiz_results/start_date/:startDate/end_date/:endDate', QuizResultsController.readByDateRange(pgSqlPool)) // Reads results by date range.
    app.get('/api/admin/quiz_results', QuizResultsController.readAll(pgSqlPool)) // Reads all results.
    // Quiz Questions
    app.post('/api/admin/quiz_questions', QuizQuestionsController.create(pgSqlPool)) // Writes new quiz question.
    app.get('/api/admin/quiz_questions/id/:id', QuizQuestionsController.readById(pgSqlPool)) // Reads question by id.
    app.get('/api/admin/quiz_questions/quiz_id/:quizId', QuizQuestionsController.readByQuizId(pgSqlPool)) // Reads questions by quiz id.
    app.get('/api/admin/quiz_questions/template_id/:templateId', QuizQuestionsController.readByTemplateId(pgSqlPool)) // Reads questions by template id.
    app.put('/api/admin/quiz_questions/:id', QuizQuestionsController.update(pgSqlPool)) // Updates quiz question.
    app.put('/api/admin/quiz_questions/quiz_id/:id', QuizQuestionsController.updateQuizId(pgSqlPool)) // Updates quiz question quiz id.
    app.delete('/api/admin/quiz_questions/:id', QuizQuestionsController.deleteById(pgSqlPool)) // Deletes quiz question.
    app.delete('/api/admin/quiz_questions/quiz_id/:quizId', QuizQuestionsController.deleteByQuizId(pgSqlPool)) // Deletes all quiz questions asssociated with quiz id.
    app.delete('/api/admin/quiz_questions/template_id/:templateId', QuizQuestionsController.deleteByTemplateId(pgSqlPool)) // Deletes all quiz questions associated with template id.
    // Quiz Answers
    app.post('/api/quiz_answers', QuizAnswersController.create(pgSqlPool)) // Writes new quiz answers.
    app.get('/api/admin/quiz_answers/id/:id', QuizAnswersController.readById(pgSqlPool)) // Reads answer by id.
    app.get('/api/admin/quiz_answers/quiz_id/:quizId', QuizAnswersController.readByQuizId(pgSqlPool)) // Reads answers by quiz id.
    app.get('/api/admin/quiz_answers/question_id/:questionId', QuizAnswersController.readByQuestionId(pgSqlPool)) // Reads answer by question id.
    app.get('/api/admin/quiz_answers/result_id/:resultId', QuizAnswersController.readByResultId(pgSqlPool)) // Reads answers by result id.
    app.put('/api/admin/quiz_answers/:id', QuizAnswersController.update(pgSqlPool)) // Updates quiz answer.
    app.delete('/api/admin/quiz_answers/:id', QuizAnswersController.delete(pgSqlPool)) // Deletes quiz answer.


    // Survey Endpoints

    // Surveys
    /*app.post('/api/admin/surveys', SurveyController.create) // Writes new survey.
    app.get('/api/admin/surveys/id/:id', SurveyController.readById) // Reads survey by id.
    app.get('/api/admin/surveys/unique_name/:uniqueName', SurveyController.readByUniqueName) // Reads survey by unique name.
    app.get('/api/admin/surveys/unique_name_taken/:uniqueName', SurveyController.isUniqueNameTaken) // Returns true if unique name is taken.
    app.get('/api/admin/surveys', SurveyController.readAll) // Reads all surveys.
    app.put('/api/admin/surveys/:id', SurveyController.update) // Updates survey.
    app.delete('/api/admin/surveys/:id', SurveyController.delete) // Deletes survey.
    // Survey Templates
    app.post('/api/admin/survey_templates', SurveyTemplatesController.create) // Writes new template.
    app.get('/api/admin/survey_templates/id/:id', SurveyTemplatesController.readById) // Reads template by id.
    app.get('/api/admin/survey_templates/name/:name', SurveyTemplatesController.readByName) // Reads template by name.
    app.get('/api/admin/survey_templates/name_taken/:name', SurveyTemplatesController.isNameTaken) // Returns true if name is taken.
    app.get('/api/admin/survey_templates', SurveyTemplatesController.readAll) // Reads all templates.
    app.put('/api/admin/survey_templates/:id', SurveyTemplatesController.update) // Updates template.
    app.delete('/api/admin/survey_templates/:id', SurveyTemplatesController.delete) // Deletes template.
    // Survey Results
    app.post('/api/survey_results', SurveyResultsController.create) // Writes new results.
    app.get('/api/admin/survey_results/survey_id/:surveyId', SurveyResultsController.readBySurveyId) // Reads results by survey id.
    app.get('/api/admin/survey_results/start_date/:startDate/end_date/:endDate', SurveyResultsController.readByDateRange) // Reads results by date range.
    app.get('/api/admin/survey_results', SurveyResultsController.readAll) // Reads all results.
    // Survey Questions
    app.post('/api/admin/survey_questions', SurveyQuestionsController.create) // Writes new survey question.
    app.get('/api/admin/survey_questions/id/:id', SurveyQuestionsController.readById) // Reads question by id.
    app.get('/api/admin/survey_questions/survey_id/:surveyId', SurveyQuestionsController.readBySurveyId) // Reads questions by survey id.
    app.get('/api/admin/survey_questions/template_id/:templateId', SurveyQuestionsController.readByTemplateId) // Reads questions by template id.
    app.put('/api/admin/survey_questions/:id', SurveyQuestionsController.update) // Updates survey question.
    app.put('/api/admin/survey_questions/survey_id/:id', SurveyQuestionsController.updateSurveyId) // Updates survey question survey id.
    app.delete('/api/admin/survey_questions/:id', SurveyQuestionsController.deleteById) // Deletes survey question.
    app.delete('/api/admin/survey_questions/survey_id/:surveyId', SurveyQuestionsController.deleteBySurveyId) // Deletes all survey questions asssociated with survey id.
    app.delete('/api/admin/survey_questions/template_id/:templateId', SurveyQuestionsController.deleteByTemplateId) // Deletes all survey questions associated with template id.
    // Survey Answers
    app.post('/api/survey_answers', SurveyAnswersController.create) // Writes new survey answers.
    app.get('/api/admin/survey_answers/id/:id', SurveyAnswersController.readById) // Reads answer by id.
    app.get('/api/admin/survey_answers/survey_id/:surveyId', SurveyAnswersController.readBySurveyId) // Reads answers by survey id.
    app.get('/api/admin/survey_answers/question_id/:questionId', SurveyAnswersController.readByQuestionId) // Reads answer by question id.
    app.get('/api/admin/survey_answers/result_id/:resultId', SurveyAnswersController.readByResultId) // Reads answers by result id.
    app.put('/api/admin/survey_answers/:id', SurveyAnswersController.update) // Updates survey answer.
    app.delete('/api/admin/survey_answers/:id', SurveyAnswersController.delete) // Deletes survey answer.


    // Webpage Endpoints
    app.post('/api/admin/webpages', WebpagesController.create) // Writes new webpage record
    app.get('/api/admin/webpages/id/:id', WebpagesController.readById) // Reads webpage by id.
    app.get('/api/admin/webpages/quiz_id/:quizId', WebpagesController.readByQuizId) // Reads webpages by quiz id.
    app.get('/api/admin/webpages/survey_id/:surveyId', WebpagesController.readBySurveyId) // Reads webpages by survey id.
    app.get('/api/admin/webpages/title/:title', WebpagesController.readByTitle) // Reads webpages by title.
    app.get('/api/admin/webpages', WebpagesController.readAll) // Reads all webpages.
    app.put('/api/admin/webpages/:id', WebpagesController.update) // Updates webpage record.
    app.delete('/api/admin/webpages/:id', WebpagesController.delete) // Deletes webpage record.
  } */
}
