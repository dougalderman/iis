import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms'
import * as _ from 'lodash';

import { ActivateQuizSurveyTemplateFormModel } from '../../../../../models/forms/activate-quiz-survey-template-form.model';
import { PreviewQuizTemplateFormModel } from '../../../../../models/forms/quizzes/preview-quiz-template-form.model';

import { QuizModel } from  '../../../../../models/quizzes/quiz.model';
import { QuizQuestionModel } from  '../../../../../models/quizzes/quiz-question.model';
import { QuizQuestionDataModel } from  '../../../../../models/quizzes/data/quiz-question-data.model';
import { QuizTemplateModel } from  '../../../../../models/quizzes/quiz-template.model';
import { QuizTemplateDataModel } from  '../../../../../models/quizzes/data/quiz-template-data.model';
import { QuizAdminService } from '../../services/quiz-admin.service';
import { NO_QUIZ, KEEP_SAME_QUIZ } from '../../constants/activate-quiz-survey.constants';
import { WebpageModel } from 'models/webpages/webpage.model';

@Component({
  selector: 'app-activate-quiz-template',
  templateUrl: './activate-quiz-template.component.html',
  styleUrls: ['./activate-quiz-template.component.scss']
})
export class ActivateQuizTemplateComponent implements OnInit, OnChanges {

  @Input() activateQuizSurveyTemplateForm: ActivateQuizSurveyTemplateFormModel;
  @Input() templateSelected: number;
  @Input() webpage: WebpageModel;
  @Input() quiz: QuizModel;
  @Input() quizId: number;
  @Input() actQuizId: number;

  @Output() quizTemplateSelected = new EventEmitter<number>();
  @Output() quizIdChanged = new EventEmitter<number>();
  @Output() activeQuizId = new EventEmitter<number>();
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

  noQuiz: number = NO_QUIZ;
  keepSameQuiz: number = KEEP_SAME_QUIZ;

  constructor(
    private fb: FormBuilder,
    private quizAdminService: QuizAdminService
  ) {}

  ngOnInit() {
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
      if (propName === 'webpage') {
        this.handleWebpageChange();
      }
    }
  }

  watchForTemplateSelectionChanges(): void {
    this.selectQuizTemplateForm.get('quizTemplateSelect').valueChanges.subscribe(
      (val: number) => {
        if (val) {
          this.quizTemplateSelectionChanged(val);
        }
      },
      error => {
        console.error(error);
        this.logError()
      }
    );
  }

  get quizFormQuestions(): FormArray {
    return this.previewQuizTemplateForm.get('formQuestions') as FormArray;
  }

  logError(): void {
    this.error.emit();
  }

  changeTemplateSelected(templateId: number): void {
    this.templateSelected = templateId;
    this.quizTemplateSelected.emit(templateId)
  }

  changeQuizId(quizId: number): void {
    this.quizId = quizId;
    this.quizIdChanged.emit(quizId);
  }

  changeActiveQuizId(quizId: number): void {
    this.actQuizId = quizId;
    this.activeQuizId.emit(quizId);
  }

  clearFlags(): void {
    this.clearStatusFlags.emit();
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
          this.logError();
        }
      );
  }

  handleWebpageChange(): void {
    this.changeQuizId(this.webpage.quizId);
    this.changeActiveQuizId(this.quizId);
    this.changeTemplateSelected(this.noQuiz);
    this.quizForm.reset();
    this.quizConfigurationForm.reset();

    if (this.quizId) {
      this.quizAdminService.getQuiz(this.quizId)
        .subscribe(
          (quizzes: QuizDataModel[]) => {
            if (quizzes && quizzes.length) {
              this.quiz = new QuizModel(quizzes[0]);

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
      this.setQuizFormValues(null, template);
    }
    else if (quizTemplateSelected === this.keepSameQuiz) {
      this.changeActiveQuizId(this.quizId);
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
      this.quizAdminService.getQuestionsForQuizTemplate(this.templateSelected)
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
            this.logError();
          }
        );
    }
    else if (this.quizId && this.templateSelected !== this.noQuiz) {
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
            this.logError();
          }
        );
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
      this.quizAdminService.setQuizUniqueNameOriginal(quiz.uniqueName);
      let title = this.quizForm.get('title')
      title.setValue(quiz.title);
      let description = this.quizForm.get('description')
      description.setValue(quiz.description);

      let percentGreatJob = this.quizConfigurationForm.get('percentGreatJob');
      percentGreatJob.setValue(quiz.config.percentGreatJob);
    }
    else if (template) {
      let uniqueName = this.quizForm.get('uniqueName')
      uniqueName.setValue(template.name);
      this.quizAdminService.setQuizUniqueNameOriginal('');
      let description = this.quizForm.get('description')
      description.setValue(template.description);

      this.quizConfigurationForm = _.cloneDeep(this.defaultQuizConfigurationForm);
    }
  }
}
