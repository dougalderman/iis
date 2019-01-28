import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms'
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { SurveyTemplateModel } from  '../../../../../models/surveys/survey-template.model';
import { SurveyQuestionModel } from  '../../../../../models/surveys/survey-question.model';
import { SurveyTemplateDataModel } from  '../../../../../models/surveys/data/survey-template-data.model';
import { SurveyQuestionDataModel } from  '../../../../../models/surveys/data/survey-question-data.model';
import { CreateModifySurveyTemplateFormModel } from '../../../../../models/forms/surveys/create-modify-survey-template-form.model';

import { SurveyAdminService } from '../../services/survey-admin.service';
import { ModalService } from '../../services/modal.service';
import { CheckSurveyTemplateNameValidator } from '../../validators/check-survey-template-name.validator';


@Component({
  selector: 'app-create-modify-survey-template',
  templateUrl: './create-modify-survey-template.component.html',
  styleUrls: ['./create-modify-survey-template.component.scss']
})
export class CreateModifySurveyTemplateComponent implements OnInit {

  template: SurveyTemplateModel = new SurveyTemplateModel();
  templates: SurveyTemplateModel[] = [];
  question: SurveyQuestionModel = new SurveyQuestionModel();
  questionTypeChangedSubscription: Subscription[] = [];
  saveSuccess: boolean = false;
  deleteSuccess: boolean = false;
  saveError: boolean = false;
  deleteError: boolean = false;
  generalError: boolean = false;
  templateSelectionProcessing: boolean = false;
  errorMessage: string = '';

  surveyTemplateForm = new CreateModifySurveyTemplateFormModel(this.fb, this.checkSurveyTemplateName);
  selectTemplateForm: FormGroup = this.surveyTemplateForm.selectTemplateForm;
  createModifySurveyTemplateForm: FormGroup = this.surveyTemplateForm.createModifySurveyTemplateForm;

  constructor(
    private surveyAdminService: SurveyAdminService,
    private modalService: ModalService,
    private fb: FormBuilder,
    private checkSurveyTemplateName: CheckSurveyTemplateNameValidator
  ) {}

  ngOnInit(): void {
    this.getTemplates();
    this.onChanges();
  }

  onChanges(): void {
    this.selectTemplateForm.get('templateSelect').valueChanges.subscribe(
      (val: number) => {
        if (val) {
          this.templateSelectionChanged(val);
        }
      },
      error => {
        console.error(error);
        this.generalError = true;
      }
    );
    this.createModifySurveyTemplateForm.get('name').valueChanges.subscribe(
      (val: string) => {
        if (val) {
          if (!this.templateSelectionProcessing) {
            this.selectTemplateForm.reset();
          }
          this.clearStatusFlags();
        }
      },
      error => {
        console.error(error);
        this.generalError = true;
      }
    );
    this.subscribeToQuestionTypeChanges();
  }

  get formQuestions(): FormArray {
    return this.createModifySurveyTemplateForm.get('formQuestions') as FormArray;
  }

  get name(): AbstractControl { return this.createModifySurveyTemplateForm.get('name'); }
  get description(): AbstractControl { return this.createModifySurveyTemplateForm.get('description'); }

  subscribeToQuestionTypeChanges(): void {
    if (this.formQuestions && this.formQuestions.controls) {
      for (let i = 0; i < this.formQuestions.controls.length; i++) {
        let formQuestionControls: FormGroup = this.formQuestions.controls[i] as FormGroup;
        this.questionTypeChangedSubscription[i] = formQuestionControls.controls.typeSelect.valueChanges.subscribe(
          (val: string) => {
            if (val) {
              this.questionTypeChanged(val, i);
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

  unsubscribeToQuestionTypeChanges(): void {
    if (this.formQuestions && this.formQuestions.controls) {
      for (let i = 0; i < this.formQuestions.controls.length; i++) {
        this.questionTypeChangedSubscription[i].unsubscribe();
      }
    }
  }

  getTemplates(): void {
    this.templates = [];

    this.surveyAdminService.getAllSurveyTemplates()
      .subscribe(
        (templates: SurveyTemplateDataModel[]) => {
          if (templates && templates.length) {
            for (let template of templates) {
              this.templates.push(new SurveyTemplateModel(template));
            }
          }
        },
        error => {
          console.error(error);
          this.generalError = true;
        }
      );
  }

  templateSelectionChanged(templateSelected: number): void {
    if (templateSelected) {
      this.clearStatusFlags();
      this.templateSelectionProcessing = true;
      this.surveyAdminService.getSurveyTemplate(templateSelected)
        .subscribe(
          (template: SurveyTemplateDataModel[]) => {
            if (template && template.length) {
              this.template = new SurveyTemplateModel(template[0]);
              this.createModifySurveyTemplateForm.reset();
              this.resetFormQuestions();
              this.createModifySurveyTemplateForm.controls.name.setValue(this.template.name);
              this.createModifySurveyTemplateForm.controls.description.setValue(this.template.description);
              this.surveyAdminService.getQuestionsForSurveyTemplate(templateSelected)
                .subscribe(
                  (questions: SurveyQuestionDataModel[]) => {
                    if (questions && questions.length) {
                      for (let i = 0; i < questions.length; i++) {
                        this.addQuestion(new SurveyQuestionModel(questions[i]));
                      }
                    }
                    this.templateSelectionProcessing = false;
                  },
                  error => {
                    console.error(error);
                    this.generalError = true;
                    this.templateSelectionProcessing = false;
                  }
                );
            }
            else {
              console.error('Error retrieving selected survey template');
              this.generalError = true;
              this.templateSelectionProcessing = false;
            }
        },
        error => {
          console.error(error);
          this.generalError = true;
          this.templateSelectionProcessing = false;
        }
      );
    }
  }

  clearTemplate(): void {
    this.modalService.open(
      'confirm',
      'Clear Template',
      'clear',
      this.template.name,
      'All information on the page will be cleared out, but the template data will remain in the database.',
    )
      .result.then(
        (result) => {
          if (result === 'OK Click') {
            this.clearTemplateNoConfirm();
          }
        },
        () => {}
      );
  }

  deleteTemplate(): void {
    const name = this.createModifySurveyTemplateForm.get('name').value;
    if (this.template.id && name === this.template.name) {
      this.modalService.open(
        'confirm',
        'Delete Template',
        'delete',
        this.template.name,
        'The template data will be deleted from the database.',
      )
        .result.then(
          (result) => {
            if (result === 'OK Click') {
              this.clearStatusFlags();
              this.surveyAdminService.deleteSurveyQuestionsByTemplateId(this.template.id)
                .subscribe(
                  (result: any) => {
                    if (result) {
                      this.surveyAdminService.deleteSurveyTemplate(this.template.id)
                        .subscribe(
                          (result: any) => {
                            if (result) {
                              this.deleteSuccess = true;
                              this.clearTemplateNoConfirm();
                              this.getTemplates();
                            }
                            else {
                              this.deleteError = true;
                            }
                          },
                          error => {
                            console.error(error);
                            this.deleteError = true;
                          }
                        );
                    }
                  }
                );
            }
          },
          () => {}
      );
    }
    else {
      this.errorMessage='Cannot delete new template that hasn\'t yet been saved.'
    }
  }

  saveTemplate(): void {
    this.clearStatusFlags();
    let name = this.createModifySurveyTemplateForm.get('name').value;
    if (name) {
      name = name.trim();
    }
    this.template.description = this.createModifySurveyTemplateForm.get('description').value;
    if (this.template.description) {
      this.template.description = this.template.description.trim();
    }
    if (!this.template.id || name !== this.template.name) { // if new template or template name changed
      this.template.name = name;
      this.template.id = null;
      this.surveyAdminService.saveNewSurveyTemplate(this.template)
        .subscribe(
          (results: any) => {
            if (results && results.length) {
              const templateId = results[0].id;
              if (templateId) {
                this.saveAllTemplateQuestions(templateId)
              }
            }
          },
          error => {
            console.error(error);
            this.saveError = true;
          }
        );
      }
      else { // modifying existing template
        this.surveyAdminService.saveExistingSurveyTemplate(this.template.id, this.template)
          .subscribe(
            (result: any) => {
              if (result) {
                this.surveyAdminService.deleteSurveyQuestionsByTemplateId(this.template.id)
                  .subscribe(
                    (result: any) => {
                      if (result) {
                        this.saveAllTemplateQuestions(this.template.id)
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

  addQuestion(question?: SurveyQuestionModel): void {
    this.unsubscribeToQuestionTypeChanges();
    this.surveyTemplateForm.addQuestion(question);
    this.subscribeToQuestionTypeChanges()
  }

  onDeletedQuestion(index: number): void {
    this.unsubscribeToQuestionTypeChanges()
    this.surveyTemplateForm.deleteQuestion(index);
    this.subscribeToQuestionTypeChanges()
  }

  saveAllTemplateQuestions(templateId: number): void {
    let questions = this.formQuestions.value;
    let questionSavedCount = 0;
    for (let i = 0; i < questions.length; i++) {
      this.question = new SurveyQuestionModel()
      this.question.templateId = templateId;
      this.question.textQuestion = questions[i].text;
      if (this.question.textQuestion) {
        this.question.textQuestion = this.question.textQuestion.trim();
      }
      this.question.questionType = questions[i].typeSelect;
      this.question.options = [];
      for (let option of questions[i].answer.options) {
        if (option.option) {
          this.question.options.push(option.option.trim());
        }
      }

      const numericRange = questions[i].answer.numericRange;
      if (numericRange && numericRange.numericLowRange) {
        this.question.integerStartAnswerRange = numericRange.numericLowRange;
      }
      else {
        this.question.integerStartAnswerRange = 0;
      }
      if (numericRange && numericRange.numericHighRange) {
        this.question.integerEndAnswerRange = numericRange.numericHighRange;
      }
      else {
        this.question.integerEndAnswerRange = 0;
      }
      this.surveyAdminService.saveNewSurveyQuestion(this.question)
        .subscribe(
          (result: any) => {
            if (result) {
              questionSavedCount++;
              if (questionSavedCount === questions.length) {
                this.saveSuccess = true;
                this.getTemplates();
                this.clearTemplateNoConfirm();
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

  resetFormQuestions(): void {
    const len = this.formQuestions.controls.length;
    for (let i = len - 1; i >= 0; i--) {
      this.onDeletedQuestion(i);
    }
    this.formQuestions.reset();
  }

  questionTypeChanged(questionType: string, index: number): void {
    this.unsubscribeToQuestionTypeChanges();
    this.surveyTemplateForm.questionTypeChanged(questionType, index);
    this.subscribeToQuestionTypeChanges();
  }

  clearStatusFlags() {
    this.saveSuccess = false;
    this.deleteSuccess = false;
    this.saveError = false;
    this.deleteError = false;
    this.generalError = false;
    this.templateSelectionProcessing = false;
    this.errorMessage = '';
  }

  clearTemplateNoConfirm() {
    this.createModifySurveyTemplateForm.reset();
    this.resetFormQuestions();
    this.template = new SurveyTemplateModel();
    this.selectTemplateForm.reset();
    const templateSelect = this.selectTemplateForm.get('templateSelect')
    templateSelect.setValue('');
  }
}
