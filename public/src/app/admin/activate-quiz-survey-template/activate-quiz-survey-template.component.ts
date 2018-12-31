import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms'

import { appRoutes } from '../../app-routing.module';
import { QuizTemplateModel } from  '../../../../../models/quizzes/quiz-template.model';
import { QuizTemplateDataModel } from  '../../../../../models/quizzes/data/quiz-template-data.model';
import { WebpageModel } from  '../../../../../models/webpages/webpage.model';
import { WebpageDataModel } from  '../../../../../models/webpages/data/webpage-data.model';
import { ActivateQuizSurveyTemplateFormModel } from '../../../../../models//forms/activate-quiz-survey-template-form.model';
import { QuizAdminService } from '../../services/quiz-admin.service';
import { WebpageAdminService } from '../../services/webpage-admin.service';

class QuizTemplate extends QuizTemplateModel {}

@Component({
  selector: 'app-activate-quiz-survey-template',
  templateUrl: './activate-quiz-survey-template.component.html',
  styleUrls: ['./activate-quiz-survey-template.component.scss']
})
export class ActivateQuizSurveyTemplateComponent implements OnInit {

  quizTemplate: QuizTemplateModel = new QuizTemplate();
  quizTemplates: QuizTemplateModel[];
  surveyTemplates = []; // modify later
  activeRoutes: WebpageModel[] = [];
  activateQuizSurveyTemplateForm = new ActivateQuizSurveyTemplateFormModel(this.fb);
  selectQuizTemplateForm = this.activateQuizSurveyTemplateForm.selectQuizTemplateForm;
  selectSurveyTemplateForm = this.activateQuizSurveyTemplateForm.selectSurveyTemplateForm;
  selectWebPageForm = this.activateQuizSurveyTemplateForm.selectWebPageForm;
  saveSuccess: boolean = false;
  saveError: boolean = false;
  generalError: boolean = false;
  errorMessage: string = '';

  constructor(
    private quizAdminService: QuizAdminService,
    private webpageAdminService: WebpageAdminService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.getActiveRoutes();
    this.getQuizTemplates();
    this.getSurveyTemplates();
    this.onChanges();
  }

  onChanges(): void {
    /* this.selectQuizTemplateForm.get('quizTemplateSelect').valueChanges.subscribe(
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

    this.selectWebPageForm.get('webPageSelect').valueChanges.subscribe(
      (val: number) => {
        if (val) {
          this.webPageSelectionChanged(val);
        }
      },
      error => {
        console.error(error);
        this.generalError = true;
      }
    ); */
  }

  getActiveRoutes(): void {
    for (let route of appRoutes) {
      if (route && route.data && route.data.title) {
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
                }
              }
              else { // no webpage with this title in db
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
            },
            error => {
              console.error(error);
              this.generalError = true;
            }
          );
      }
    }
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



}
