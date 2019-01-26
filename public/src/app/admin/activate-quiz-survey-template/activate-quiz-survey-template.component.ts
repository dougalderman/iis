import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms'
import * as _ from 'lodash';

import { appRoutes } from '../../app-routing.module';

import { QuizModel, QuizConfigModel } from  '../../../../../models/quizzes/quiz.model';
import { QuizTemplateModel } from  '../../../../../models/quizzes/quiz-template.model';
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

  quiz: QuizModel;
  quizId: number = 0;
  activeQuizId: number = 0;

  noQuiz: number = NO_QUIZ;
  keepSameQuiz: number = KEEP_SAME_QUIZ;

  quizTemplate: QuizTemplateModel;
  quizTemplateSelected: number = 0;
  clearQuizForms: boolean = false;

  survey: SurveyModel = new SurveyModel();
  surveyId: number = 0;
  activeSurveyId: number = 0;

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
    this.getSurveyTemplates();
    this.watchForTemplateSelectionChanges();
  }

  watchForTemplateSelectionChanges(): void {
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

  get surveyFormQuestions(): FormArray {
    return this.previewSurveyTemplateForm.get('formQuestions') as FormArray;
  }

  onQuizTemplateSelected(quizTemplateId: number) {
    this.quizTemplateSelected = quizTemplateId;
  }

  onChangeQuizId(quizId: number) {
    this.quizId = quizId;
  }

  onChangeActiveQuizId(activeQuizId: number) {
    this.activeQuizId = activeQuizId;
  }

  onChangeQuiz(quiz: QuizModel) {
    this.quiz = quiz;
  }

  onGeneralError() {
    this.generalError = true;
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

    this.surveyId = webpage.surveyId;
    this.activeSurveyId = this.surveyId;
    this.surveyTemplateSelected = this.noQuiz;
    this.surveyPreview = false;
    this.surveyForm.reset();

    if (this.surveyId) {
      this.surveyAdminService.getSurvey(this.surveyId)
        .subscribe(
          (surveys: SurveyDataModel[]) => {
            if (surveys && surveys.length) {
              this.survey = new SurveyModel(surveys[0]);

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

  surveyTemplateSelectionChanged(surveyTemplateSelected: number): void {
    this.clearStatusFlags();
    this.surveyForm.reset();
    this.surveyTemplateSelected = surveyTemplateSelected;
    this.surveyPreview = false;
    const survey = _.find(this.surveyTemplates, ['id', surveyTemplateSelected])

    if (surveyTemplateSelected > 0) {
      this.activeSurveyId = 0;
      this.setSurveyFormValues(null, survey);
    }
    else if (surveyTemplateSelected === this.keepSameSurvey) {
      this.activeSurveyId = this.surveyId;
      this.setSurveyFormValues(this.survey);
    }
    else if (surveyTemplateSelected === this.noSurvey) {
      this.activeSurveyId = 0;
    }
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

  resetSurveyFormQuestions(): void {
    const len = this.surveyFormQuestions.controls.length;
    for (let i = len - 1; i >= 0; i--) {
      this.surveyTemplateForm.deleteQuestion(i);
    }
    this.surveyFormQuestions.reset();
  }

  activate(): void {
    this.clearStatusFlags();
    let newQuiz: boolean = false;
    let newSurvey: boolean = false;
    let newQuizAndSurvey: boolean = false;

    if (this.webpageSelected) {
      const webpageSelected = this.webpageSelected;
      const webpage = this.webpage;

      if (this.quizTemplateSelected === this.noQuiz) {
        this.webpage.quizId = null;
      }
      if (this.surveyTemplateSelected === this.noSurvey) {
        this.webpage.surveyId = null;
      }

      if ((!this.activeQuizId && this.quizTemplateSelected !== this.noQuiz) &&
      (!this.activeSurveyId && this.surveyTemplateSelected !== this.noSurvey)) {
        newQuizAndSurvey = true;
      }
      else if (!this.activeQuizId && this.quizTemplateSelected !== this.noQuiz) {
        newQuiz = true;
      }
      else if (!this.activeSurveyId && this.surveyTemplateSelected !== this.noSurvey) {
        newSurvey = true;
      }

      if (this.activeQuizId && this.quizTemplateSelected !== this.noQuiz) {
        this.saveExistingQuizChanges();
      }
      else if (this.quizTemplateSelected === this.noQuiz && !newSurvey) {
        this.saveWebpageChanges(webpageSelected, webpage);
      }
      else if (newQuizAndSurvey) {
        this.saveNewQuizAndSurvey(webpageSelected, webpage);
      }
      else if (newQuiz) {
        this.saveNewQuiz(webpageSelected, webpage);
      }

      if (this.activeSurveyId && this.surveyTemplateSelected !== this.noSurvey) {
        this.saveExistingSurveyChanges();
      }
      else if (this.surveyTemplateSelected === this.noSurvey && this.quizTemplateSelected !== this.noQuiz && !newQuiz) {
        this.saveWebpageChanges(webpageSelected, webpage);
      }
      else if (!newQuizAndSurvey && newSurvey) {
        this.saveNewSurvey(webpageSelected, webpage);
      }

      this.clearWebpageForm();
    }
  }

  saveExistingQuizChanges(): void {
    this.quiz = this.updateQuizDataFromForm(this.quiz);

    this.quizAdminService.saveExistingQuiz(this.quizId, this.quiz)
      .subscribe(
        (result: any) => {
          if (result) {
            this.saveSuccess = true;
            this.clearQuizForms = true;
          }
        },
        error => {
          console.error(error);
          this.saveError = true;
        }
      );
  }

  saveNewQuiz(pageSelected: number, page: WebpageModel): void {
    if (this.quizTemplateSelected > 0) {
      let quiz: QuizModel = new QuizModel();
      quiz = this.updateQuizDataFromForm(quiz);
      this.webpage.quizId = null;

      this.quizAdminService.saveNewQuiz(quiz)
        .subscribe(
          (results: any) => {
            if (results && results.length) {
              const thisQuizId: number = results[0].id;
              page.quizId = thisQuizId;

              this.webpageAdminService.saveExistingWebpage(pageSelected, page)
                .subscribe(
                  (result: any) => {
                    if (result) {
                      this.updateQuizQuestionsTable(thisQuizId);
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

  updateQuizQuestionsTable(quizId: number): void  {
    this.quizAdminService.getQuestionsForQuizTemplate(this.quizTemplateSelected)
      .subscribe(
        (questions: QuizQuestionDataModel[]) => {
          if (questions && questions.length) {
            let questionSavedCount = 0;
            for (let i = 0; i < questions.length; i++) {
              const questionId = questions[i].id;
              const oldQuizId = questions[i].quiz_id;
              if (!oldQuizId) {
                // If question isn't currently associated with a quiz.
                let question: any = {};
                question.quizId = quizId;

                this.quizAdminService.saveExistingQuizQuestionQuizId(questionId, question)
                  .subscribe(
                    (res: any) => {
                      if (res) {
                        questionSavedCount++;
                        if (questionSavedCount === questions.length) {
                          this.saveSuccess = true;
                          this.clearQuizForms = true;
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
                  question.quizId = quizId;
                  question.templateId = null;

                  this.quizAdminService.saveNewQuizQuestion(question)
                    .subscribe(
                      (re: any) => {
                        if (re) {
                          questionSavedCount++;
                          if (questionSavedCount === questions.length) {
                            this.saveSuccess = true;
                            this.clearQuizForms = true;
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

  saveExistingSurveyChanges(): void {
    if (this.surveyId && this.surveyTemplateSelected !== this.noSurvey) {
      // Save existing survey changes
      this.survey = this.updateSurveyDataFromForm(this.survey);

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

  saveNewSurvey(pageSelected: number, page: WebpageModel): void {
    if (this.surveyTemplateSelected > 0) {
      let survey: SurveyModel = new SurveyModel();
      survey = this.updateSurveyDataFromForm(survey);
      this.webpage.surveyId = null;

      this.surveyAdminService.saveNewSurvey(survey)
        .subscribe(
          (results: any) => {
            if (results && results.length) {
              const thisSurveyId: number = results[0].id;
              page.surveyId = thisSurveyId;

              this.webpageAdminService.saveExistingWebpage(pageSelected, page)
                .subscribe(
                  (result: any) => {
                    if (result) {
                      this.updateSurveyQuestionsTable(thisSurveyId);
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

  updateSurveyQuestionsTable(surveyId: number): void {
    this.surveyAdminService.getQuestionsForSurveyTemplate(this.surveyTemplateSelected)
      .subscribe(
        (questions: SurveyQuestionDataModel[]) => {
          if (questions && questions.length) {
            let questionSavedCount = 0;
            for (let i = 0; i < questions.length; i++) {
              const questionId = questions[i].id;
              const oldSurveyId = questions[i].survey_id;
              if (!oldSurveyId) {
                // If question isn't currently associated with a survey.
                let question: any = {};
                question.surveyId = surveyId;

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
                  question.surveyId = surveyId;
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

  saveNewQuizAndSurvey(pageSelected: number, page: WebpageModel): void {
    if (this.quizTemplateSelected > 0 && this.surveyTemplateSelected) {
      let quiz: QuizModel = new QuizModel();
      quiz = this.updateQuizDataFromForm(quiz);
      this.webpage.quizId = null;

      this.quizAdminService.saveNewQuiz(quiz)
        .subscribe(
          (results: any) => {
            if (results && results.length) {
              const thisQuizId: number = results[0].id;
              page.quizId = thisQuizId;

              let survey: SurveyModel = new SurveyModel();
              survey = this.updateSurveyDataFromForm(survey);
              this.webpage.surveyId = null;

              this.surveyAdminService.saveNewSurvey(survey)
                .subscribe(
                  (results: any) => {
                    if (results && results.length) {
                      const thisSurveyId: number = results[0].id;
                      this.webpage.surveyId = thisSurveyId;

                      this.webpageAdminService.saveExistingWebpage(pageSelected, page)
                        .subscribe(
                          (result: any) => {
                            if (result) {
                              this.updateQuizQuestionsTable(thisQuizId);
                              this.updateSurveyQuestionsTable(thisSurveyId);
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

  saveWebpageChanges(pageSelected: number, page: WebpageModel): void {
    this.webpageAdminService.saveExistingWebpage(pageSelected, page)
    .subscribe(
      (result: any) => {
        if (result) {
          this.saveSuccess = true;
          if (this.quizTemplateSelected === this.noQuiz) {
            this.clearQuizForms = true;
          }
          if (this.surveyTemplateSelected === this.noSurvey) {
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
    this.clearQuizForms = false;
  }

  clearSurveyForms() {
    this.surveyId = 0;
    this.activeSurveyId = 0;
    this.surveyTemplateSelected = 0;
    this.surveyPreview = false;
    this.surveyForm.reset();
    this.selectSurveyTemplateForm.reset();
    const surveyTemplateSelect = this.selectSurveyTemplateForm.get('surveyTemplateSelect')
    surveyTemplateSelect.setValue('');
  }

  clearWebpageForm() {
    this.webpageSelected = 0;
    this.webpage = new WebpageModel();
    this.selectWebpageForm.reset();
    const webpageSelect = this.selectWebpageForm.get('webpageSelect')
    webpageSelect.setValue('');
  }


  setSurveyFormValues(survey: SurveyModel, template?: SurveyTemplateModel) {
    if (survey) {
      let uniqueName = this.surveyForm.get('uniqueName')
      uniqueName.setValue(survey.uniqueName);
      this.surveyAdminService.setSurveyUniqueNameOriginal(survey.uniqueName);
      let title = this.surveyForm.get('title')
      title.setValue(survey.title);
      let description = this.surveyForm.get('description')
      description.setValue(survey.description);
    }
    else if (template) {
      let uniqueName = this.surveyForm.get('uniqueName')
      uniqueName.setValue(template.name);
      this.surveyAdminService.setSurveyUniqueNameOriginal('');
      let description = this.surveyForm.get('description')
      description.setValue(template.description);
    }
  }
}
