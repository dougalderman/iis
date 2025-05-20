import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';

import * as _ from 'lodash';

import { ActivateQuizSurveyTemplateFormModel } from '../../../../../models/forms/activate-quiz-survey-template-form.model';
import { PreviewQuizTemplateFormModel } from '../../../../../models/forms/quizzes/preview-quiz-template-form.model';

import { QuizModel } from  '../../../../../models/quizzes/quiz.model';
import { QuizDataModel } from  '../../../../../models/quizzes/data/quiz-data.model';
import { QuizQuestionModel } from  '../../../../../models/quizzes/quiz-question.model';
import { QuizQuestionDataModel } from  '../../../../../models/quizzes/data/quiz-question-data.model';
import { QuizTemplateModel } from  '../../../../../models/quizzes/quiz-template.model';
import { QuizTemplateDataModel } from  '../../../../../models/quizzes/data/quiz-template-data.model';
import { QuizAdminService } from '../../services/quiz-admin.service';
import { NO_QUIZ, KEEP_SAME_QUIZ } from '../../constants/activate-quiz-survey.constants';
import { WebpageModel } from '../../../../../models/webpages/webpage.model';
import { TemplateQuizQuestionDisabledComponent } from '../template-quiz-question-disabled/template-quiz-question-disabled.component';

@Component({
  imports: [CommonModule, ReactiveFormsModule, TemplateQuizQuestionDisabledComponent],
  selector: 'app-activate-quiz-template',
  templateUrl: './activate-quiz-template.component.html',
  styleUrls: ['./activate-quiz-template.component.scss']
})
export class ActivateQuizTemplateComponent implements OnInit, OnChanges {

  @Input() activateQuizSurveyTemplateForm: ActivateQuizSurveyTemplateFormModel;
  @Input() webpage: WebpageModel;
  @Input() clearForms: boolean;

  @Output() quizTemplateSelected = new EventEmitter<number>();
  @Output() quizIdChanged = new EventEmitter<number>();
  @Output() activeQuizId = new EventEmitter<number>();
  @Output() quizChanged = new EventEmitter<QuizModel>();
  @Output() error = new EventEmitter<any>();
  @Output() clearStatusFlags = new EventEmitter<any>();

  selectQuizTemplateForm: FormGroup;
  quizForm: FormGroup;
  defaultQuizConfigurationForm: FormGroup;
  quizConfigurationForm: FormGroup

  quizTemplateForm = new PreviewQuizTemplateFormModel(this.fb);
  previewQuizTemplateForm: FormGroup = this.quizTemplateForm.previewQuizTemplateForm;

  quizPreview: boolean = false;
  quizTemplates: QuizTemplateModel[] = [];
  quiz: QuizModel = new QuizModel();
  quizId: number = 0;
  actQuizId: number = 0;
  templateSelected: number = 0;

  noQuiz: number = NO_QUIZ;
  keepSameQuiz: number = KEEP_SAME_QUIZ;
  infoIcon: string = '';

  constructor(
    private fb: FormBuilder,
    private quizAdminService: QuizAdminService
  ) {}
  ngOnInit() {
    this.infoIcon = require('../../../assets/images/information-512.png');
    if (this.activateQuizSurveyTemplateForm) {
      this.selectQuizTemplateForm = this.activateQuizSurveyTemplateForm.selectQuizTemplateForm;
      this.quizForm = this.activateQuizSurveyTemplateForm.quizForm;
      this.defaultQuizConfigurationForm = this.activateQuizSurveyTemplateForm.defaultQuizConfigurationForm;
      this.quizConfigurationForm = this.activateQuizSurveyTemplateForm.quizConfigurationForm;
    }
    this.getQuizTemplates();
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
        this.clearQuizForms();
      }
    }
  }

  watchForTemplateSelectionChanges(): void {
    this.selectQuizTemplateForm.get('quizTemplateSelect').valueChanges.subscribe({
      next: (val: number) => {
        if (val) {
          this.quizTemplateSelectionChanged(val);
        }
      },
      error: (e) => {
        console.error(e);
        this.logError()
      }
    });
  }

  get quizFormQuestions(): FormArray {
    return this.previewQuizTemplateForm.get('formQuestions') as FormArray;
  }

  logError(): void {
    this.error.emit();
  }

  changeTemplateSelected(templateId: number): void {
    this.templateSelected = templateId;
    setTimeout(() => {
      this.quizTemplateSelected.emit(templateId);
    });
  }

  changeQuizId(quizId: number): void {
    this.quizId = quizId;
    this.quizIdChanged.emit(quizId);
  }

  changeActiveQuizId(quizId: number): void {
    this.actQuizId = quizId;
    this.activeQuizId.emit(quizId);
  }

  changeQuiz(quiz: QuizModel): void {
    this.quiz = quiz;
    this.quizChanged.emit(quiz);
  }

  clearFlags(): void {
    this.clearStatusFlags.emit();
  }

  getQuizTemplates(): void {
    this.quizTemplates = [];

    this.quizAdminService.getAllQuizTemplates().subscribe({
      next: (templates: QuizTemplateDataModel[]) => {
        if (templates && templates.length) {
          for (let template of templates) {
            this.quizTemplates.push(new QuizTemplateModel(template));
          }
        }
      },
      error: (e) => {
        console.error(e);
        this.logError();
      }
    });
  }

  handleWebpageChange(): void {
    const quizId = this.webpage.quizId;
    this.changeQuizId(quizId);
    this.changeActiveQuizId(quizId);
    this.changeTemplateSelected(this.noQuiz);
    this.quizForm.reset();
    this.quizConfigurationForm.reset();

    if (quizId) {
      this.quizAdminService.getQuiz(quizId).subscribe({
        next: (quizzes: QuizDataModel[]) => {
          if (quizzes && quizzes.length) {
            this.changeQuiz(new QuizModel(quizzes[0]));

            // Default to keep the same quiz if quiz is associated with webpage.
            this.changeTemplateSelected(this.keepSameQuiz);
            const quizTemplateSelect = this.selectQuizTemplateForm.get('quizTemplateSelect')
            quizTemplateSelect.setValue(this.templateSelected);
          }
        },
        error: (e) => {
          console.error(e);
          this.logError();
        }
      });
    }
    else {
       // Set to no quiz.
       const quizTemplateSelect = this.selectQuizTemplateForm.get('quizTemplateSelect')
       quizTemplateSelect.setValue(this.templateSelected);
    }
  }

  quizTemplateSelectionChanged(quizTemplateSelected: number): void {
    this.clearFlags();
    this.quizForm.reset();
    this.quizConfigurationForm.reset();
    this.changeTemplateSelected(quizTemplateSelected);
    this.quizPreview = false;
    const template = _.find(this.quizTemplates, ['id', quizTemplateSelected])

    if (quizTemplateSelected > 0) {
      this.changeActiveQuizId(0);
      this.quizAdminService.setQuizUniqueNameOriginal('');
      this.setQuizFormValues(null, template);
    }
    else if (quizTemplateSelected === this.keepSameQuiz) {
      this.changeActiveQuizId(this.quizId);
      this.quizAdminService.setQuizUniqueNameOriginal(this.quiz.uniqueName);
      this.setQuizFormValues(this.quiz);
    }
    else if (quizTemplateSelected === this.noQuiz) {
      this.changeActiveQuizId(0);
    }
  }

  previewQuiz(): void {
    this.quizPreview = !this.quizPreview;
    this.previewQuizTemplateForm.reset();
    this.resetQuizFormQuestions();

    if (this.templateSelected > 0) {
      this.quizAdminService.getQuestionsForQuizTemplate(this.templateSelected).subscribe({
        next: (questions: QuizQuestionDataModel[]) => {
          if (questions && questions.length) {
            for (let i = 0; i < questions.length; i++) {
              let question = new QuizQuestionModel(questions[i]);
              this.quizTemplateForm.addQuestion(question);
            }
          }
        },
        error: (e) => {
          console.error(e);
          this.logError();
        }
      });
    }
    else if (this.quizId && this.templateSelected !== this.noQuiz) {
      this.quizAdminService.getQuestionsForQuiz(this.quizId).subscribe({
        next: (questions: QuizQuestionDataModel[]) => {
          if (questions && questions.length) {
            for (let i = 0; i < questions.length; i++) {
              let question = new QuizQuestionModel(questions[i]);
              this.quizTemplateForm.addQuestion(question);
            }
          }
        },
        error: (e) => {
          console.error(e);
          this.logError();
        }
      });
    }
  }

  clearPreviewQuiz(): void {
    this.quizPreview = !this.quizPreview;
  }

  resetQuizFormQuestions(): void {
    const len = this.quizFormQuestions.controls.length;
    for (let i = len - 1; i >= 0; i--) {
      this.quizTemplateForm.deleteQuestion(i);
    }
    this.quizFormQuestions.reset();
  }

  setQuizFormValues(quiz: QuizModel, template?: QuizTemplateModel): void {
    if (quiz) {
      let uniqueName = this.quizForm.get('uniqueName')
      uniqueName.setValue(quiz.uniqueName);
      let title = this.quizForm.get('title')
      title.setValue(quiz.title);
      let description = this.quizForm.get('description')
      description.setValue(quiz.description);

      let percentGreatJob = this.quizConfigurationForm.get('percentGreatJob');
      if (quiz.config) {
        percentGreatJob.setValue(quiz.config.percentGreatJob);
      }
    }
    else if (template) {
      let uniqueName = this.quizForm.get('uniqueName')
      uniqueName.setValue(template.name);
      let description = this.quizForm.get('description')
      description.setValue(template.description);

      let percentGreatJob = this.quizConfigurationForm.get('percentGreatJob');
      const defaultPercentGreatJob = this.defaultQuizConfigurationForm.get('percentGreatJob');
      percentGreatJob.setValue(defaultPercentGreatJob.value);
    }
  }

  clearQuizForms() {
    this.quizPreview = false;
    this.changeQuizId(0);
    this.changeActiveQuizId(0);
    this.changeTemplateSelected(0);
    this.quizForm.reset();
    this.quizConfigurationForm.reset();
    this.selectQuizTemplateForm.reset();
    const quizTemplateSelect = this.selectQuizTemplateForm.get('quizTemplateSelect')
    quizTemplateSelect.setValue('');
  }
}
