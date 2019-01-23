import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms'
import * as _ from 'lodash';

import { appRoutes } from '../../app-routing.module';

import { QuizModel, QuizConfigModel } from  '../../../../../models/quizzes/quiz.model';
import { QuizDataModel } from  '../../../../../models/quizzes/data/quiz-data.model';
import { QuizTemplateModel } from  '../../../../../models/quizzes/quiz-template.model';
import { QuizTemplateDataModel } from  '../../../../../models/quizzes/data/quiz-template-data.model';
import { QuizQuestionModel } from  '../../../../../models/quizzes/quiz-question.model';
import { QuizQuestionDataModel } from  '../../../../../models/quizzes/data/quiz-question-data.model';

import { SurveyModel } from  '../../../../../models/surveys/survey.model';
import { SurveyDataModel } from  '../../../../../models/surveys/data/survey-data.model';
import { SurveyTemplateModel } from  '../../../../../models/surveys/survey-template.model';
import { SurveyTemplateDataModel } from  '../../../../../models/surveys/data/survey-template-data.model';
import { SurveyQuestionModel } from  '../../../../../models/surveys/survey-question.model';
import { SurveyQuestionDataModel } from  '../../../../../models/surveys/data/survey-question-data.model';

import { WebpageModel } from  '../../../../../models/webpages/webpage.model';
import { WebpageDataModel } from  '../../../../../models/webpages/data/webpage-data.model';

import { ActivateQuizSurveyTemplateFormModel } from '../../../../../models/forms/activate-quiz-survey-template-form.model';
import { PreviewQuizTemplateFormModel } from '../../../../../models/forms/quizzes/preview-quiz-template-form.model';
import { PreviewSurveyTemplateFormModel } from '../../../../../models/forms/surveys/preview-survey-template-form.model';

import { QuizAdminService } from '../../services/quiz-admin.service';
import { SurveyAdminService } from '../../services/survey-admin.service';
import { WebpageAdminService } from '../../services/webpage-admin.service';
import { CheckQuizUniqueNameValidator } from '../../validators/check-quiz-unique-name.validator';
import { CheckSurveyUniqueNameValidator } from '../../validators/check-survey-unique-name.validator';
import { NO_QUIZ, KEEP_SAME_QUIZ, NO_SURVEY, KEEP_SAME_SURVEY } from '../../constants/activate-quiz-survey.constants';

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
  quizTemplates: QuizTemplateModel[] = [];
  quizPreview: boolean = false;
  quizTemplateSelected: number = 0;

  survey: SurveyModel = new SurveyModel();
  surveyId: number = 0;

  noSurvey: number = NO_SURVEY;
  keepSameSurvey: number = KEEP_SAME_SURVEY;

  surveyTemplate: SurveyTemplateModel = new SurveyTemplateModel();
  surveyTemplates: SurveyTemplateModel[] = [];
  surveyPreview: boolean = false;
  surveyTemplateSelected: number = 0;

  activeRoutes: WebpageModel[] = [];
  webpageSelected: number = 0;
  webpage: WebpageModel = new WebpageModel();

  activateQuizSurveyTemplateForm = new ActivateQuizSurveyTemplateFormModel(
    this.fb,
    this.checkQuizUniqueNameValidator,
    this.checkSurveyUniqueNameValidator
  );
  selectQuizTemplateForm: FormGroup = this.activateQuizSurveyTemplateForm.selectQuizTemplateForm;
  quizForm: FormGroup =  this.activateQuizSurveyTemplateForm.quizForm;
  defaultQuizConfigurationForm: FormGroup =  this.activateQuizSurveyTemplateForm.defaultQuizConfigurationForm;
  quizConfigurationForm: FormGroup =  this.activateQuizSurveyTemplateForm.quizConfigurationForm;
  selectSurveyTemplateForm: FormGroup = this.activateQuizSurveyTemplateForm.selectSurveyTemplateForm;
  surveyForm: FormGroup =  this.activateQuizSurveyTemplateForm.surveyForm;
  selectWebpageForm: FormGroup = this.activateQuizSurveyTemplateForm.selectWebpageForm;

  quizTemplateForm = new PreviewQuizTemplateFormModel(this.fb);
  previewQuizTemplateForm: FormGroup = this.quizTemplateForm.previewQuizTemplateForm;

  surveyTemplateForm = new PreviewSurveyTemplateFormModel(this.fb);
  previewSurveyTemplateForm: FormGroup = this.surveyTemplateForm.previewSurveyTemplateForm;

  saveSuccess: boolean = false;
  saveError: boolean = false;
  generalError: boolean = false;
  errorMessage: string = '';

  constructor(
    private quizAdminService: QuizAdminService,
    private surveyAdminService: SurveyAdminService,
    private webpageAdminService: WebpageAdminService,
    private fb: FormBuilder,
    private checkQuizUniqueNameValidator: CheckQuizUniqueNameValidator,
    private checkSurveyUniqueNameValidator: CheckSurveyUniqueNameValidator
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
          this.surveyTemplateSelectionChanged(val);
        }
      },
      error => {
        console.error(error);
        this.generalError = true;
      }
    );
  }

  get quizFormQuestions(): FormArray {
    return this.previewQuizTemplateForm.get('formQuestions') as FormArray;
  }

  get surveyFormQuestions(): FormArray {
    return this.previewSurveyTemplateForm.get('formQuestions') as FormArray;
  }

  getActiveRoutes(): void {
    this.activeRoutes = [];

    this.webpageAdminService.getAllWebpages()
      .subscribe(
        (webpages: WebpageDataModel[]) => {
          if (webpages && webpages.length) {
            for (let page of webpages) {
              if (_.find(appRoutes, ['data.title', page.title])) {
                // if page title from db is an active route
                this.activeRoutes.push(new WebpageModel(page));
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
                    (results: any) => {
                      if (results && results.length) {
                        const page = new WebpageModel();
                        page.id = results[0].id;
                        page.title = thisPage.title;
                        if (page.id) {
                          this.activeRoutes.push(page);
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
    this.quizTemplates = [];

    this.quizAdminService.getAllQuizTemplates()
      .subscribe(
        (templates: QuizTemplateDataModel[]) => {
          if (templates && templates.length) {
            for (let template of templates) {
              this.quizTemplates.push(new QuizTemplateModel(template));
            }
          }
        },
        error => {
          console.error(error);
          this.generalError = true;
        }
      );
  }

  getSurveyTemplates(): void {
    this.surveyTemplates = [];

    this.surveyAdminService.getAllSurveyTemplates()
      .subscribe(
        (templates: SurveyTemplateDataModel[]) => {
          if (templates && templates.length) {
            for (let template of templates) {
              this.surveyTemplates.push(new SurveyTemplateModel(template));
            }
          }
        },
        error => {
          console.error(error);
          this.generalError = true;
        }
      );
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

    this.surveyId = webpage.surveyId;
    this.surveyTemplateSelected = this.noQuiz;
    this.surveyPreview = false;
    this.surveyForm.reset();

    if (this.quizId) {
      this.quizAdminService.getQuiz(this.quizId)
        .subscribe(
          (quizzes: QuizDataModel[]) => {
            if (quizzes && quizzes.length) {
              this.quiz = new QuizModel(quizzes[0]);
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
       // Set to no quiz.
       this.quizTemplateSelected = this.noQuiz;
       const quizTemplateSelect = this.selectQuizTemplateForm.get('quizTemplateSelect')
       quizTemplateSelect.setValue(this.quizTemplateSelected);
    }

    if (this.surveyId) {
      this.surveyAdminService.getSurvey(this.surveyId)
        .subscribe(
          (surveys: SurveyDataModel[]) => {
            if (surveys && surveys.length) {
              this.survey = new SurveyModel(surveys[0]);
              this.setSurveyFormValues(this.survey);

              // Default to keep the same survey if survey is associated with webpage.
              this.surveyTemplateSelected = this.keepSameSurvey;
              const surveyTemplateSelect = this.selectSurveyTemplateForm.get('surveyTemplateSelect')
              surveyTemplateSelect.setValue(this.surveyTemplateSelected);
            }
          },
          error => {
            console.error(error);
            this.generalError = true;
          }
        );
    }
    else {
       // Set to no survey.
       this.surveyTemplateSelected = this.noSurvey;
       const surveyTemplateSelect = this.selectSurveyTemplateForm.get('surveyTemplateSelect')
       surveyTemplateSelect.setValue(this.surveyTemplateSelected);
    }
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

              this.quizTemplate = new QuizTemplateModel(template[0]);

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

  surveyTemplateSelectionChanged(surveyTemplateSelected: number): void {
    this.clearStatusFlags();
    this.surveyForm.reset();
    this.surveyTemplateSelected = surveyTemplateSelected;
    this.surveyPreview = false;

    if (surveyTemplateSelected > 0) {
      this.surveyAdminService.getSurveyTemplate(surveyTemplateSelected)
        .subscribe(
          (template: SurveyTemplateDataModel[]) => {
            if (template && template.length) {
              this.surveyId = 0;
              this.survey = new SurveyModel();

              this.surveyTemplate = new SurveyTemplateModel(template[0]);

              let uniqueName = this.surveyForm.get('uniqueName')
              uniqueName.setValue(this.surveyTemplate.name);
              this.surveyAdminService.setSurveyUniqueNameOriginal('');
              let description = this.surveyForm.get('description')
              description.setValue(this.surveyTemplate.description);
            }
          },
          error => {
            console.error(error);
            this.generalError = true;
          }
        );
    }
    else if (surveyTemplateSelected === this.keepSameSurvey) {
      this.setSurveyFormValues(this.survey);
    }
    else if (surveyTemplateSelected === this.noSurvey) {
      this.surveyId = 0;
      this.survey = new SurveyModel();
    }
  }

  previewQuiz(): void {
    this.quizPreview = !this.quizPreview;
    this.previewQuizTemplateForm.reset();
    this.resetQuizFormQuestions();

    if (this.quizTemplateSelected > 0) {
      this.quizAdminService.getQuestionsForQuizTemplate(this.quizTemplateSelected)
        .subscribe(
          (questions: QuizQuestionDataModel[]) => {
            if (questions && questions.length) {
              for (let i = 0; i < questions.length; i++) {
                let question = new QuizQuestionModel(questions[i]);
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
              let question = new QuizQuestionModel(questions[i]);
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
    this.surveyPreview = !this.surveyPreview;
    this.previewSurveyTemplateForm.reset();
    this.resetSurveyFormQuestions();

    if (this.surveyTemplateSelected > 0) {
      this.surveyAdminService.getQuestionsForSurveyTemplate(this.surveyTemplateSelected)
        .subscribe(
          (questions: SurveyQuestionDataModel[]) => {
            if (questions && questions.length) {
              for (let i = 0; i < questions.length; i++) {
                let question = new SurveyQuestionModel(questions[i]);
                this.surveyTemplateForm.addQuestion(question);
              }
            }
          },
          error => {
            console.error(error);
            this.generalError = true;
          }
        );
    }
    else if (this.surveyId && this.surveyTemplateSelected !== this.noSurvey) {
      this.surveyAdminService.getQuestionsForSurvey(this.surveyId)
      .subscribe(
        (questions: SurveyQuestionDataModel[]) => {
          if (questions && questions.length) {
            for (let i = 0; i < questions.length; i++) {
              let question = new SurveyQuestionModel(questions[i]);
              this.surveyTemplateForm.addQuestion(question);
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

  clearPreviewSurvey(): void {
    this.surveyPreview = !this.surveyPreview;
  }

  resetQuizFormQuestions(): void {
    const len = this.quizFormQuestions.controls.length;
    for (let i = len - 1; i >= 0; i--) {
      this.quizTemplateForm.deleteQuestion(i);
    }
    this.quizFormQuestions.reset();
  }

  resetSurveyFormQuestions(): void {
    const len = this.surveyFormQuestions.controls.length;
    for (let i = len - 1; i >= 0; i--) {
      this.surveyTemplateForm.deleteQuestion(i);
    }
    this.surveyFormQuestions.reset();
  }

  activate(): void {
    this.clearStatusFlags();

    if (this.webpageSelected) {
      if (this.quizId && this.quizTemplateSelected !== this.noQuiz) {
        this.saveExistingQuizChanges();
      }
      else if (this.quizTemplateSelected === this.noQuiz) {
        // Save webpage with null quiz
        this.webpage.quizId = null;
        if (this.surveyTemplateSelected === this.noSurvey) {
          // Save webpage with null survey
          this.webpage.surveyId = null;
        }
        this.saveExistingWebpage();
      }
      else {
        this.saveNewQuiz();
      }

      if (this.surveyId && this.surveyTemplateSelected !== this.noSurvey) {
        this.saveExistingSurveyChanges();
      }
      else if (this.surveyTemplateSelected === this.noSurvey && this.quizTemplateSelected !== this.noQuiz) {
        // Save webpage with null survey, if quiz is not null.
        this.saveExistingWebpage();
      }
      else if (this.surveyTemplateSelected !== this.noSurvey) {
        this.saveNewSurvey();
      }
    }
  }

  saveExistingQuizChanges(): void {
    this.quiz = this.updateQuizDataFromForm(this.quiz);

    this.quizAdminService.saveExistingQuiz(this.quizId, this.quiz)
      .subscribe(
        (result: any) => {
          if (result) {
            this.saveSuccess = true;
            this.clearQuizForms();
          }
        },
        error => {
          console.error(error);
          this.saveError = true;
        }
      );
  }

  saveNewQuiz(): void {
    if (this.quizTemplateSelected > 0) {
      let quiz: QuizModel = new QuizModel();
      quiz = this.updateQuizDataFromForm(quiz);
      this.webpage.quizId = null;

      this.quizAdminService.saveNewQuiz(quiz)
        .subscribe(
          (results: any) => {
            if (results && results.length) {
              const thisQuizId: number = results[0].id;
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
                                      (res: any) => {
                                        if (res) {
                                          questionSavedCount++;
                                          if (questionSavedCount === questions.length) {
                                            this.saveSuccess = true;
                                            this.clearQuizForms();
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
                                  let question = new QuizQuestionModel(questions[i]);
                                    question.id = null;
                                    question.quizId = thisQuizId;
                                    question.templateId = null;
                                    this.quizAdminService.saveNewQuizQuestion(question)
                                      .subscribe(
                                        (re: any) => {
                                          if (re) {
                                            questionSavedCount++;
                                            if (questionSavedCount === questions.length) {
                                              this.saveSuccess = true;
                                              this.clearQuizForms();
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
  }

  saveExistingSurveyChanges(): void {
    if (this.surveyId && this.surveyTemplateSelected !== this.noSurvey) {
      // Save existing survey changes
      this.survey = this.updateSurveyDataFromForm(this.quiz);

      this.surveyAdminService.saveExistingSurvey(this.surveyId, this.survey)
        .subscribe(
          (result: any) => {
            if (result) {
              this.saveSuccess = true;
              this.clearSurveyForms();
            }
          },
          error => {
            console.error(error);
            this.saveError = true;
          }
        );
    }
  }

  saveNewSurvey(): void {
    if (this.surveyTemplateSelected > 0) {
      let survey: SurveyModel = new SurveyModel();
      survey = this.updateSurveyDataFromForm(survey);
      this.webpage.surveyId = null;

      this.surveyAdminService.saveNewSurvey(survey)
        .subscribe(
          (results: any) => {
            if (results && results.length) {
              const thisSurveyId: number = results[0].id;
              this.webpage.surveyId = thisSurveyId;
              this.webpageAdminService.saveExistingWebpage(this.webpageSelected, this.webpage)
                .subscribe(
                  (result: any) => {
                    if (result) {
                      this.surveyAdminService.getQuestionsForSurveyTemplate(this.surveyTemplateSelected)
                        .subscribe(
                          (questions: SurveyQuestionDataModel[]) => {
                            if (questions && questions.length) {
                              let questionSavedCount = 0;

                              for (let i = 0; i < questions.length; i++) {
                                const questionId = questions[i].id;
                                const surveyId = questions[i].survey_id;
                                if (!surveyId) {
                                  // If question isn't currently associated with a survey.
                                  let question: any = {};
                                  question.surveyId = thisSurveyId;
                                  this.surveyAdminService.saveExistingSurveyQuestionSurveyId(questionId, question)
                                    .subscribe(
                                      (res: any) => {
                                        if (res) {
                                          questionSavedCount++;
                                          if (questionSavedCount === questions.length) {
                                            this.saveSuccess = true;
                                            this.clearSurveyForms();
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
                                  // question is associated with a survey
                                  let question = new SurveyQuestionModel(questions[i]);
                                    question.id = null;
                                    question.surveyId = thisSurveyId;
                                    question.templateId = null;
                                    this.surveyAdminService.saveNewSurveyQuestion(question)
                                      .subscribe(
                                        (re: any) => {
                                          if (re) {
                                            questionSavedCount++;
                                            if (questionSavedCount === questions.length) {
                                              this.saveSuccess = true;
                                              this.clearSurveyForms();
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
  }

  saveExistingWebpage(): void {
    this.webpageAdminService.saveExistingWebpage(this.webpageSelected, this.webpage)
    .subscribe(
      (result: any) => {
        if (result) {
          this.saveSuccess = true;
          this.clearQuizForms();
          this.clearSurveyForms();
        }
      },
      error => {
        console.error(error);
        this.saveError = true;
      }
    );
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
    quiz.config.percentGreatJob = this.quizConfigurationForm.get('percentGreatJob').value;

    return quiz;
  }

  updateSurveyDataFromForm(survey: SurveyModel): SurveyModel {
    survey.uniqueName = this.surveyForm.get('uniqueName').value;
    if (survey.uniqueName) {
      survey.uniqueName = survey.uniqueName.trim();
    }
    survey.title = this.surveyForm.get('title').value;
    if (survey.title) {
      survey.title = survey.title.trim();
    }
    survey.description = this.surveyForm.get('description').value;
    if (survey.description) {
      survey.description = survey.description.trim();
    }

    return survey;
  }

  clearStatusFlags() {
    this.saveSuccess = false;
    this.saveError = false;
    this.generalError = false;
    this.errorMessage = '';
  }

  clearQuizForms() {
    this.quizId = 0;
    this.quizTemplateSelected = 0;
    this.quizPreview = false;
    this.quizForm.reset();
    this.quizConfigurationForm.reset();
    this.quizConfigurationForm = _.cloneDeep(this.defaultQuizConfigurationForm);
    this.selectQuizTemplateForm.reset();
    this.selectWebpageForm.reset();
  }

  clearSurveyForms() {
    this.surveyId = 0
    this.surveyTemplateSelected = 0;
    this.surveyPreview = false;
    this.surveyForm.reset();
    this.selectSurveyTemplateForm.reset();
    this.selectWebpageForm.reset();
  }

  setQuizFormValues(quiz: QuizModel) {
    let uniqueName = this.quizForm.get('uniqueName')
    uniqueName.setValue(quiz.uniqueName);
    this.quizAdminService.setQuizUniqueNameOriginal(quiz.uniqueName);
    let title = this.quizForm.get('title')
    title.setValue(quiz.title);
    let description = this.quizForm.get('description')
    description.setValue(quiz.description);

    let percentGreatJob = this.quizConfigurationForm.get('percentGreatJob');
    percentGreatJob.setValue(quiz.config.percentGreatJob);
  }

  setSurveyFormValues(survey: SurveyModel) {
    let uniqueName = this.surveyForm.get('uniqueName')
    uniqueName.setValue(survey.uniqueName);
    this.surveyAdminService.setSurveyUniqueNameOriginal(survey.uniqueName);
    let title = this.surveyForm.get('title')
    title.setValue(survey.title);
    let description = this.surveyForm.get('description')
    description.setValue(survey.description);
  }
}
