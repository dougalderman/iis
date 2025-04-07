import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import * as _ from 'lodash';

import { ActivateQuizSurveyTemplateFormModel } from '../../../../../models/forms/activate-quiz-survey-template-form.model';
import { PreviewSurveyTemplateFormModel } from '../../../../../models/forms/surveys/preview-survey-template-form.model';

import { SurveyModel } from  '../../../../../models/surveys/survey.model';
import { SurveyDataModel } from  '../../../../../models/surveys/data/survey-data.model';
import { SurveyQuestionModel } from  '../../../../../models/surveys/survey-question.model';
import { SurveyQuestionDataModel } from  '../../../../../models/surveys/data/survey-question-data.model';
import { SurveyTemplateModel } from  '../../../../../models/surveys/survey-template.model';
import { SurveyTemplateDataModel } from  '../../../../../models/surveys/data/survey-template-data.model';
import { SurveyAdminService } from '../../services/survey-admin.service';
import { NO_SURVEY, KEEP_SAME_SURVEY } from '../../constants/activate-quiz-survey.constants';
import { WebpageModel } from '../../../../../models/webpages/webpage.model';

@Component({
  imports: [
    ReactiveFormsModule
  ],
  selector: 'app-activate-survey-template',
  templateUrl: './activate-survey-template.component.html',
  styleUrls: ['./activate-survey-template.component.scss']
})
export class ActivateSurveyTemplateComponent implements OnInit, OnChanges {

  @Input() activateQuizSurveyTemplateForm: ActivateQuizSurveyTemplateFormModel;
  @Input() webpage: WebpageModel;
  @Input() clearForms: boolean;

  @Output() surveyTemplateSelected = new EventEmitter<number>();
  @Output() surveyIdChanged = new EventEmitter<number>();
  @Output() activeSurveyId = new EventEmitter<number>();
  @Output() surveyChanged = new EventEmitter<SurveyModel>();
  @Output() error = new EventEmitter<any>();
  @Output() clearStatusFlags = new EventEmitter<any>();

  selectSurveyTemplateForm: FormGroup;
  surveyForm: FormGroup;

  surveyTemplateForm = new PreviewSurveyTemplateFormModel(this.fb);
  previewSurveyTemplateForm: FormGroup = this.surveyTemplateForm.previewSurveyTemplateForm;

  surveyPreview: boolean = false;
  surveyTemplates: SurveyTemplateModel[] = [];
  survey: SurveyModel = new SurveyModel();
  surveyId: number = 0;
  actSurveyId: number = 0;
  templateSelected: number = 0;

  noSurvey: number = NO_SURVEY;
  keepSameSurvey: number = KEEP_SAME_SURVEY;

  constructor(
    private fb: FormBuilder,
    private surveyAdminService: SurveyAdminService
  ) {}

  ngOnInit() {
    if (this.activateQuizSurveyTemplateForm) {
      this.selectSurveyTemplateForm = this.activateQuizSurveyTemplateForm.selectSurveyTemplateForm;
      this.surveyForm = this.activateQuizSurveyTemplateForm.surveyForm;
    }
    this.getSurveyTemplates();
    this.watchForTemplateSelectionChanges();
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (let propName in changes) {
      const changedProp = changes[propName];
      if (propName === 'webpage' && !changedProp.isFirstChange()
        && changedProp.currentValue && changedProp.currentValue.id) {
        this.handleWebpageChange();
      }
      if (propName === 'clearForms' && changedProp.currentValue === true) {
        this.clearSurveyForms();
      }
    }
  }

  watchForTemplateSelectionChanges(): void {
    this.selectSurveyTemplateForm.get('surveyTemplateSelect').valueChanges.subscribe(
      (val: number) => {
        if (val) {
          this.surveyTemplateSelectionChanged(val);
        }
      },
      error => {
        console.error(error);
        this.logError()
      }
    );
  }

  get surveyFormQuestions(): FormArray {
    return this.previewSurveyTemplateForm.get('formQuestions') as FormArray;
  }

  logError(): void {
    this.error.emit();
  }

  changeTemplateSelected(templateId: number): void {
    this.templateSelected = templateId;
    setTimeout(() => {
      this.surveyTemplateSelected.emit(templateId);
    });
  }

  changeSurveyId(surveyId: number): void {
    this.surveyId = surveyId;
    this.surveyIdChanged.emit(surveyId);
  }

  changeActiveSurveyId(surveyId: number): void {
    this.actSurveyId = surveyId;
    this.activeSurveyId.emit(surveyId);
  }

  changeSurvey(survey: SurveyModel): void {
    this.survey = survey;
    this.surveyChanged.emit(survey);
  }

  clearFlags(): void {
    this.clearStatusFlags.emit();
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
          this.logError();
        }
      );
  }

  handleWebpageChange(): void {
    const surveyId = this.webpage.surveyId;
    this.changeSurveyId(surveyId);
    this.changeActiveSurveyId(surveyId);
    this.changeTemplateSelected(this.noSurvey);
    this.surveyForm.reset();

    if (surveyId) {
      this.surveyAdminService.getSurvey(surveyId)
        .subscribe(
          (surveys: SurveyDataModel[]) => {
            if (surveys && surveys.length) {
              this.changeSurvey(new SurveyModel(surveys[0]));

              // Default to keep the same survey if survey is associated with webpage.
              this.changeTemplateSelected(this.keepSameSurvey);
              const surveyTemplateSelect = this.selectSurveyTemplateForm.get('surveyTemplateSelect')
              surveyTemplateSelect.setValue(this.templateSelected);
            }
          },
          error => {
            console.error(error);
            this.logError();
          }
        );
    }
    else {
        // Set to no survey.
        const surveyTemplateSelect = this.selectSurveyTemplateForm.get('surveyTemplateSelect')
        surveyTemplateSelect.setValue(this.templateSelected);
    }
  }

  surveyTemplateSelectionChanged(surveyTemplateSelected: number): void {
    this.clearFlags();
    this.surveyForm.reset();
    this.changeTemplateSelected(surveyTemplateSelected);
    this.surveyPreview = false;
    const template = _.find(this.surveyTemplates, ['id', surveyTemplateSelected])

    if (surveyTemplateSelected > 0) {
      this.changeActiveSurveyId(0);
      this.surveyAdminService.setSurveyUniqueNameOriginal('');
      this.setSurveyFormValues(null, template);
    }
    else if (surveyTemplateSelected === this.keepSameSurvey) {
      this.changeActiveSurveyId(this.surveyId);
      this.surveyAdminService.setSurveyUniqueNameOriginal(this.survey.uniqueName);
      this.setSurveyFormValues(this.survey);
    }
    else if (surveyTemplateSelected === this.noSurvey) {
      this.changeActiveSurveyId(0);
    }
  }

  previewSurvey(): void {
    this.surveyPreview = !this.surveyPreview;
    this.previewSurveyTemplateForm.reset();
    this.resetSurveyFormQuestions();

    if (this.templateSelected > 0) {
      this.surveyAdminService.getQuestionsForSurveyTemplate(this.templateSelected)
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
            this.logError();
          }
        );
    }
    else if (this.surveyId && this.templateSelected !== this.noSurvey) {
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
            this.logError();
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

  setSurveyFormValues(survey: SurveyModel, template?: SurveyTemplateModel): void {
    if (survey) {
      let uniqueName = this.surveyForm.get('uniqueName')
      uniqueName.setValue(survey.uniqueName);
      let title = this.surveyForm.get('title')
      title.setValue(survey.title);
      let description = this.surveyForm.get('description')
      description.setValue(survey.description);
    }
    else if (template) {
      let uniqueName = this.surveyForm.get('uniqueName')
      uniqueName.setValue(template.name);
      let description = this.surveyForm.get('description')
      description.setValue(template.description);
    }
  }

  clearSurveyForms() {
    this.surveyPreview = false;
    this.changeSurveyId(0);
    this.changeActiveSurveyId(0);
    this.changeTemplateSelected(0);
    this.surveyForm.reset();
    this.selectSurveyTemplateForm.reset();
    const surveyTemplateSelect = this.selectSurveyTemplateForm.get('surveyTemplateSelect')
    surveyTemplateSelect.setValue('');
  }
}
