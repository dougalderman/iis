import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms'

import { appRoutes } from '../../app-routing.module';
import { QuizTemplateModel } from  '../../../../../models/quizzes/quiz-template.model';
import { QuizTemplateDataModel } from  '../../../../../models/quizzes/data/quiz-template-data.model';
import { ActivateQuizSurveyTemplateFormModel } from '../../../../../models/quizzes/forms/activate-quiz-survey-template-form.model';
import { QuizAdminService } from '../../services/quiz-admin.service';

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
  activeRoutes = [];
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
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.activeRoutes = this.getActiveRoutes();
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

  getActiveRoutes(): string[] {
    let routes = [];

    for (let route of appRoutes) {
      if (route && route.data && route.data.title) {
        routes.push(route.data.title);
      }
    }

    return routes;
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
