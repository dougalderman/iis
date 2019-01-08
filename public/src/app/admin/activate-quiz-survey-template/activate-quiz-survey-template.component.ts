import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms'
import * as _ from 'lodash';

import { appRoutes } from '../../app-routing.module';

import { QuizModel, QuizConfigModel } from  '../../../../../models/quizzes/quiz.model';
import { QuizDataModel } from  '../../../../../models/quizzes/data/quiz-data.model';
import { QuizTemplateModel } from  '../../../../../models/quizzes/quiz-template.model';
import { QuizTemplateDataModel } from  '../../../../../models/quizzes/data/quiz-template-data.model';
import { WebpageModel } from  '../../../../../models/webpages/webpage.model';
import { WebpageDataModel } from  '../../../../../models/webpages/data/webpage-data.model';
import { QuizQuestionModel } from  '../../../../../models/quizzes/quiz-question.model';
import { QuizQuestionDataModel } from  '../../../../../models/quizzes/data/quiz-question-data.model';

import { ActivateQuizSurveyTemplateFormModel } from '../../../../../models//forms/activate-quiz-survey-template-form.model';
import { PreviewQuizTemplateFormModel } from '../../../../../models/forms/preview-quiz-template-form.model';

import { QuizAdminService } from '../../services/quiz-admin.service';
import { WebpageAdminService } from '../../services/webpage-admin.service';
import { CheckQuizUniqueNameValidator } from '../../validators/check-quiz-unique-name.validator';

const NO_QUIZ = -10;
const KEEP_SAME_QUIZ = -20;

@Component({
  selector: 'app-activate-quiz-survey-template',
  templateUrl: './activate-quiz-survey-template.component.html',
  styleUrls: ['./activate-quiz-survey-template.component.scss']
})
export class ActivateQuizSurveyTemplateComponent implements OnInit {

  quiz: QuizModel = new QuizModel();
  quizId: number = 0;

  noQuiz: number = NO_QUIZ;
  keepSameQuiz: number = KEEP_SAME_QUIZ;

  quizTemplate: QuizTemplateModel = new QuizTemplateModel();
  quizTemplates: QuizTemplateModel[];
  quizPreview: boolean = false;
  quizTemplateSelected: number = 0;

  surveyTemplates = []; // modify later
  surveyTemplateSelected: number = 0;
  surveyPreview: boolean = false;

  activeRoutes: WebpageModel[] = [];
  webpageSelected: number = 0;
  webpage: WebpageModel = new WebpageModel();

  activateQuizSurveyTemplateForm = new ActivateQuizSurveyTemplateFormModel(this.fb, this.checkQuizUniqueNameValidator);
  selectQuizTemplateForm = this.activateQuizSurveyTemplateForm.selectQuizTemplateForm;
  quizForm =  this.activateQuizSurveyTemplateForm.quizForm;
  defaultQuizConfigurationForm =  this.activateQuizSurveyTemplateForm.defaultQuizConfigurationForm;
  quizConfigurationForm =  this.activateQuizSurveyTemplateForm.quizConfigurationForm;
  selectSurveyTemplateForm = this.activateQuizSurveyTemplateForm.selectSurveyTemplateForm;
  selectWebpageForm = this.activateQuizSurveyTemplateForm.selectWebpageForm;

  quizTemplateForm = new PreviewQuizTemplateFormModel(this.fb);
  previewQuizTemplateForm = this.quizTemplateForm.previewQuizTemplateForm;

  saveSuccess: boolean = false;
  saveError: boolean = false;
  generalError: boolean = false;
  errorMessage: string = '';

  constructor(
    private quizAdminService: QuizAdminService,
    private webpageAdminService: WebpageAdminService,
    private fb: FormBuilder,
    private checkQuizUniqueNameValidator: CheckQuizUniqueNameValidator
  ) {}

  ngOnInit() {
    this.getActiveRoutes();
    this.getQuizTemplates();
    this.getSurveyTemplates();
    this.onChanges();
  }

  onChanges(): void {
    this.selectWebpageForm.get('webpageSelect').valueChanges.subscribe(
      (val: number) => {
        if (val) {
          this.webpageSelectionChanged(val);
        }
      },
      error => {
        console.error(error);
        this.generalError = true;
      }
    );

    this.selectQuizTemplateForm.get('quizTemplateSelect').valueChanges.subscribe(
      (val: number) => {
        if (val) {
          this.quizTemplateSelectionChanged(val);
        }
      },
      error => {
        console.error(error);
        this.generalError = true;
      }
    );

    this.selectSurveyTemplateForm.get('surveyTemplateSelect').valueChanges.subscribe(
      (val: number) => {
        if (val) {
          this.clearStatusFlags();
          this.surveyTemplateSelected = val;
          this.surveyPreview = false;
        }
      },
      error => {
        console.error(error);
        this.generalError = true;
      }
    );
  }

  get formQuestions(): FormArray {
    return this.previewQuizTemplateForm.get('formQuestions') as FormArray;
  }

  getActiveRoutes(): void {
    this.webpageAdminService.getAllWebpages()
      .subscribe(
        (webpages: WebpageDataModel[]) => {
          if (webpages && webpages.length) {
            for (let page of webpages) {
              if (_.find(appRoutes, ['data.title', page.title])) {
                // if page title from db is an active route
                let route: WebpageModel = new WebpageModel();
                route.id = page.id;
                route.quizId = page.quiz_id;
                route.surveyId = page.survey_id;
                route.title = page.title;
                this.activeRoutes.push(route);
              }
              else {
                // remove page from db
                this.webpageAdminService.deleteWebpage(page.id)
                .subscribe(
                  (result: any) => {},
                  error => {
                    console.error(error);
                    this.generalError = true;
                  }
                );
              }
            }
          }
          for (let route of appRoutes) {
            if (route && route.data && route.data.title) {
              if (!_.find(webpages, ['title', route.data.title])) {
                // If active route doesn't exist in DB
                let thisPage: WebpageModel = new WebpageModel();
                thisPage.title = route.data.title;
                  this.webpageAdminService.saveNewWebpage(thisPage)
                  .subscribe(
                    (result: any) => {
                      if (result) {
                        this.webpageAdminService.getWebpageByTitle(route.data.title)
                        .subscribe(
                          (webpage: WebpageDataModel[]) => {
                            if (webpage && webpage.length) {
                              const page = webpage[0];
                              if (page.id) {
                                let thisPage: WebpageModel = new WebpageModel();
                                thisPage.id = page.id;
                                thisPage.quizId = page.quiz_id;
                                thisPage.surveyId = page.survey_id;
                                thisPage.title = page.title;
                                this.activeRoutes.push(thisPage);
                                this.activeRoutes = _.sortBy(this.activeRoutes, ['title']);
                              }
                            }
                          },
                          error => {
                            console.error(error);
                            this.generalError = true;
                          }
                        );
                      }
                    },
                    error => {
                      console.error(error);
                      this.generalError = true;
                    }
                  );
              }
            }
          }
        },
        error => {
          console.error(error);
          this.generalError = true;
        }
      );
  }

  getQuizTemplates(): void {
    this.quizAdminService.getAllQuizTemplates()
      .subscribe(
        (templates: QuizTemplateDataModel[]) => {
          if (templates) {
            this.quizTemplates = templates;
          }
        },
        error => {
          console.error(error);
          this.generalError = true;
        }
      );
  }

  getSurveyTemplates(): void {
    /* this.quizAdminService.getAllSurveyTemplates()
      .subscribe(
        (templates: SurveyTemplateDataModel[]) => {
          if (templates) {
            this.surveyTemplates = templates;
          }
        },
        error => {
          console.error(error);
          this.generalError = true;
        }
      ); */
  }

  webpageSelectionChanged(webpageSelected: number): void {
    this.clearStatusFlags();
    const webpage: WebpageModel = _.find(this.activeRoutes, ['id', webpageSelected]);
    this.webpage = webpage;
    this.webpageSelected = webpageSelected;

    this.quizId = webpage.quizId;
    this.quizTemplateSelected = this.noQuiz;
    this.quizPreview = false;
    this.quizForm.reset();
    this.quizConfigurationForm.reset();
    this.quizPreview = false;

    this.surveyPreview = false;

    if (this.quizId) {
      this.quizAdminService.getQuiz(this.quizId)
        .subscribe(
          (quizzes: QuizDataModel[]) => {
            if (quizzes && quizzes.length) {
              this.quiz = new QuizModel();
              this.quiz.id = quizzes[0].id;
              this.quiz.uniqueName = quizzes[0].unique_name;
              this.quiz.title = quizzes[0].title;
              this.quiz.description = quizzes[0].description;
              this.quiz.config = quizzes[0].config;

              this.setQuizFormValues(this.quiz);

              // Default to keep the same quiz if quiz is associated with webpage.
              this.quizTemplateSelected = this.keepSameQuiz;
              const quizTemplateSelect = this.selectQuizTemplateForm.get('quizTemplateSelect')
              quizTemplateSelect.setValue(this.quizTemplateSelected);
            }
          },
          error => {
            console.error(error);
            this.generalError = true;
          }
        );
    }
    else {
       // Set to no Quiz.
       this.quizTemplateSelected = this.noQuiz;
       const quizTemplateSelect = this.selectQuizTemplateForm.get('quizTemplateSelect')
       quizTemplateSelect.setValue(this.quizTemplateSelected);
    }

    const surveyId = webpage.surveyId;
    // TODO: Code to read survey
  }

  quizTemplateSelectionChanged(quizTemplateSelected: number): void {
    this.clearStatusFlags();
    this.quizForm.reset();
    this.quizConfigurationForm.reset();
    this.quizTemplateSelected = quizTemplateSelected;
    this.quizPreview = false;

    if (quizTemplateSelected > 0) {
      this.quizAdminService.getQuizTemplate(quizTemplateSelected)
        .subscribe(
          (template: QuizTemplateDataModel[]) => {
            if (template && template.length) {
              this.quizId = 0;
              this.quiz = new QuizModel();

              this.quizTemplate = template[0] as QuizTemplateModel;

              let uniqueName = this.quizForm.get('uniqueName')
              uniqueName.setValue(this.quizTemplate.name);
              this.quizAdminService.setQuizUniqueNameOriginal('');
              let description = this.quizForm.get('description')
              description.setValue(this.quizTemplate.description);

              this.quizConfigurationForm = _.cloneDeep(this.defaultQuizConfigurationForm);
            }
          },
          error => {
            console.error(error);
            this.generalError = true;
          }
        );
    }
    else if (quizTemplateSelected === this.keepSameQuiz) {
      this.setQuizFormValues(this.quiz);
    }
    else if (quizTemplateSelected === this.noQuiz) {
      this.quizId = 0;
      this.quiz = new QuizModel();
    }
  }

  previewQuiz(): void {
    this.quizPreview = !this.quizPreview;
    this.previewQuizTemplateForm.reset();
    this.resetFormQuestions();

    if (this.quizTemplateSelected > 0) {
      this.quizAdminService.getQuestionsForQuizTemplate(this.quizTemplateSelected)
        .subscribe(
          (questions: QuizQuestionDataModel[]) => {
            if (questions && questions.length) {
              for (let i = 0; i < questions.length; i++) {
                let question = new QuizQuestionModel();
                question.textQuestion = questions[i].text_question;
                question.questionType = questions[i].question_type;
                question.options = questions[i].options;
                question.booleanCorrectAnswer = questions[i].boolean_correct_answer;
                question.correctAnswerArray = questions[i].correct_answer_array;
                this.quizTemplateForm.addQuestion(question);
              }
            }
          },
          error => {
            console.error(error);
            this.generalError = true;
          }
        );
    }
    else if (this.quizId && this.quizTemplateSelected !== this.noQuiz) {
      this.quizAdminService.getQuestionsForQuiz(this.quizId)
      .subscribe(
        (questions: QuizQuestionDataModel[]) => {
          if (questions && questions.length) {
            for (let i = 0; i < questions.length; i++) {
              let question = new QuizQuestionModel();
              question.textQuestion = questions[i].text_question;
              question.questionType = questions[i].question_type;
              question.options = questions[i].options;
              question.booleanCorrectAnswer = questions[i].boolean_correct_answer;
              question.correctAnswerArray = questions[i].correct_answer_array;
              this.quizTemplateForm.addQuestion(question);
            }
          }
        },
        error => {
          console.error(error);
          this.generalError = true;
        }
      );
    }
  }

  clearPreviewQuiz(): void {
    this.quizPreview = !this.quizPreview;
  }

  previewSurvey(): void {

  }

  clearPreviewSurvey(): void {

  }

  resetFormQuestions(): void {
    const len = this.formQuestions.controls.length;
    for (let i = len - 1; i >= 0; i--) {
      this.quizTemplateForm.deleteQuestion(i);
    }
    this.formQuestions.reset();
  }

  activate(): void {
    this.clearStatusFlags();

    if (this.webpageSelected) {
      if (this.quizId && this.quizTemplateSelected !== this.noQuiz) {
        // Save existing quiz changes
        this.quiz = this.updateQuizDataFromForm(this.quiz);

        this.quizAdminService.saveExistingQuiz(this.quizId, this.quiz)
          .subscribe(
            (result: any) => {
              if (result) {
                this.saveSuccess = true;
                this.clearForms();
              }
            },
            error => {
              console.error(error);
              this.saveError = true;
            }
          );
      }
      else if (this.quizTemplateSelected === this.noQuiz) {
        // Save Webpage with null quiz id
        this.webpage.quizId = null;
        this.webpageAdminService.saveExistingWebpage(this.webpageSelected, this.webpage)
          .subscribe(
            (result: any) => {
              if (result) {
                this.saveSuccess = true;
                this.clearForms();
              }
            },
            error => {
              console.error(error);
              this.saveError = true;
            }
          );
      }
      else {
        // Save new quiz
        if (this.quizTemplateSelected > 0) {
          let quiz: QuizModel = new QuizModel();
          quiz = this.updateQuizDataFromForm(quiz);
          this.webpage.quizId = null;

          this.quizAdminService.saveNewQuiz(quiz)
            .subscribe(
              (result: any) => {
                if (result) {
                  this.quizAdminService.getQuizByUniqueName(quiz.uniqueName)
                    .subscribe(
                      (quizzes: QuizDataModel[]) => {
                        if (quizzes && quizzes.length) {
                          const thisQuiz: QuizDataModel = quizzes[0];
                          const thisQuizId: number = thisQuiz.id;
                          this.webpage.quizId = thisQuizId;
                          this.webpageAdminService.saveExistingWebpage(this.webpageSelected, this.webpage)
                            .subscribe(
                              (result: any) => {
                                if (result) {
                                  this.quizAdminService.getQuestionsForQuizTemplate(this.quizTemplateSelected)
                                    .subscribe(
                                      (questions: QuizQuestionDataModel[]) => {
                                        if (questions && questions.length) {
                                          let questionSavedCount = 0;

                                          for (let i = 0; i < questions.length; i++) {
                                            const questionId = questions[i].id;
                                            const quizId = questions[i].quiz_id;
                                            if (!quizId) {
                                              // If question isn't currently associated with a quiz.
                                              let question: any = {};
                                              question.quizId = thisQuizId;
                                              this.quizAdminService.saveExistingQuizQuestionQuizId(questionId, question)
                                                .subscribe(
                                                  (result: any) => {
                                                    if (result) {
                                                      questionSavedCount++;
                                                      if (questionSavedCount === questions.length) {
                                                        this.saveSuccess = true;
                                                        this.clearForms();
                                                      }
                                                    }
                                                  },
                                                  error => {
                                                    console.error(error);
                                                    this.saveError = true;
                                                  }
                                                );
                                            }
                                            else {
                                              // question is associated with a quiz
                                              let question = new QuizQuestionModel;
                                                // TODO move data over from old question.
                                                question.quizId = thisQuizId;
                                                this.quizAdminService.saveNewQuizQuestion(question)
                                                  .subscribe(
                                                    (result: any) => {
                                                      if (result) {
                                                        questionSavedCount++;
                                                        if (questionSavedCount === questions.length) {
                                                          this.saveSuccess = true;
                                                          this.clearForms();
                                                        }
                                                      }
                                                    },
                                                    error => {
                                                      console.error(error);
                                                      this.saveError = true;
                                                    }
                                                  );
                                            }
                                          }
                                        }
                                      },
                                      error => {
                                        console.error(error);
                                        this.saveError = true;
                                      }
                                    );
                                }
                              },
                              error => {
                                console.error(error);
                                this.saveError = true;
                              }
                            );
                        }
                      },
                      error => {
                        console.error(error);
                        this.saveError = true;
                      }
                    );
                }
              },
              error => {
                console.error(error);
                this.saveError = true;
              }
            );
        }
      }
    }
  }

  updateQuizDataFromForm(quiz: QuizModel): QuizModel {
    quiz.uniqueName = this.quizForm.get('uniqueName').value;
    if (quiz.uniqueName) {
      quiz.uniqueName = quiz.uniqueName.trim();
    }
    quiz.title = this.quizForm.get('title').value;
    if (quiz.title) {
      quiz.title = quiz.title.trim();
    }
    quiz.description = this.quizForm.get('description').value;
    if (quiz.description) {
      quiz.description = quiz.description.trim();
    }
    quiz.config = new QuizConfigModel();
    quiz.config.autoSubmit = this.quizConfigurationForm.get('autoSubmit').value;
    quiz.config.percentGreatJob = this.quizConfigurationForm.get('percentGreatJob').value;

    return quiz;
  }

  clearStatusFlags() {
    this.saveSuccess = false;
    this.saveError = false;
    this.generalError = false;
    this.errorMessage = '';
  }

  clearForms() {
    this.quizId = 0;
    this.quizTemplateSelected = 0;
    this.quizPreview = false;
    this.surveyTemplateSelected = 0;
    this.quizForm.reset();
    this.quizConfigurationForm.reset();
    this.quizConfigurationForm = _.cloneDeep(this.defaultQuizConfigurationForm);
    this.selectWebpageForm.reset();
    this.selectQuizTemplateForm.reset();
    this.selectSurveyTemplateForm.reset();
  }

  setQuizFormValues(quiz: QuizModel) {
    let uniqueName = this.quizForm.get('uniqueName')
    uniqueName.setValue(quiz.uniqueName);
    this.quizAdminService.setQuizUniqueNameOriginal(quiz.uniqueName);
    let title = this.quizForm.get('title')
    title.setValue(quiz.title);
    let description = this.quizForm.get('description')
    description.setValue(quiz.description);

    let autoSubmit = this.quizConfigurationForm.get('autoSubmit');
    autoSubmit.setValue(quiz.config.autoSubmit);
    let percentGreatJob = this.quizConfigurationForm.get('percentGreatJob');
    percentGreatJob.setValue(quiz.config.percentGreatJob);
  }
}
