import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, AbstractControl, ReactiveFormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { QuizTemplateModel } from  '../../../../../models/quizzes/quiz-template.model';
import { QuizQuestionModel } from  '../../../../../models/quizzes/quiz-question.model';
import { QuizTemplateDataModel } from  '../../../../../models/quizzes/data/quiz-template-data.model';
import { QuizQuestionDataModel } from  '../../../../../models/quizzes/data/quiz-question-data.model';
import { CreateModifyQuizTemplateFormModel } from '../../../../../models/forms/quizzes/create-modify-quiz-template-form.model';

import { QuizAdminService } from '../../services/quiz-admin.service';
import { ModalService } from '../../services/modal.service';
import { CheckQuizTemplateNameValidator } from '../../validators/check-quiz-template-name.validator';
import { TemplateQuizQuestionComponent } from '../template-quiz-question/template-quiz-question.component';

@Component({
  imports: [CommonModule, ReactiveFormsModule, TemplateQuizQuestionComponent],
  selector: 'app-create-modify-quiz-template',
  templateUrl: './create-modify-quiz-template.component.html',
  styleUrls: ['./create-modify-quiz-template.component.scss']
})
export class CreateModifyQuizTemplateComponent implements OnInit {

  template: QuizTemplateModel = new QuizTemplateModel();
  templates: QuizTemplateModel[] = [];
  question: QuizQuestionModel = new QuizQuestionModel();
  questionTypeChangedSubscription: Subscription[] = [];
  saveSuccess: boolean = false;
  deleteSuccess: boolean = false;
  saveError: boolean = false;
  deleteError: boolean = false;
  generalError: boolean = false;
  templateSelectionProcessing: boolean = false;
  errorMessage: string = '';

  quizTemplateForm = new CreateModifyQuizTemplateFormModel(this.fb, this.checkQuizTemplateName);
  selectTemplateForm: FormGroup = this.quizTemplateForm.selectTemplateForm;
  createModifyQuizTemplateForm: FormGroup = this.quizTemplateForm.createModifyQuizTemplateForm;

  constructor(
    private quizAdminService: QuizAdminService,
    private modalService: ModalService,
    private fb: FormBuilder,
    private checkQuizTemplateName: CheckQuizTemplateNameValidator
  ) {}

  ngOnInit(): void {
    this.getTemplates();
    this.onChanges();
  }

  onChanges(): void {
    this.selectTemplateForm.get('templateSelect').valueChanges.subscribe({
      next: (val:number) => {
        if (val) {
          this.templateSelectionChanged(val);
        }
      },
      error: (e) => {
        console.error(e);
        this.generalError = true;
      }  
    });
    this.createModifyQuizTemplateForm.get('name').valueChanges.subscribe({
      next: (val: string) => {
        if (val) {
          if (!this.templateSelectionProcessing) {
            this.selectTemplateForm.reset();
          }
          this.clearStatusFlags();
        }
      },
      error: (e) => {
        console.error(e);
        this.generalError = true;
      }
    });
    this.subscribeToQuestionTypeChanges();
  }

  get formQuestions(): FormArray {
    return this.createModifyQuizTemplateForm.get('formQuestions') as FormArray;
  }

  get name(): AbstractControl { return this.createModifyQuizTemplateForm.get('name'); }
  get description(): AbstractControl { return this.createModifyQuizTemplateForm.get('description'); }

  subscribeToQuestionTypeChanges(): void {
    if (this.formQuestions && this.formQuestions.controls) {
      for (let i = 0; i < this.formQuestions.controls.length; i++) {
        let formQuestionControls: FormGroup = this.formQuestions.controls[i] as FormGroup;
        this.questionTypeChangedSubscription[i] = formQuestionControls.controls.typeSelect.valueChanges.subscribe({
          next: (val: string) => {
            if (val) {
              this.questionTypeChanged(val, i);
            }
          },
          error: (e) => {
            console.error(e);
            this.generalError = true;
          }
        });
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

    this.quizAdminService.getAllQuizTemplates().subscribe({
      next: (templates: QuizTemplateDataModel[]) => {
        if (templates && templates.length) {
          for (let template of templates) {
            this.templates.push(new QuizTemplateModel(template));
          }
        }
      },
      error: (e) => {
        console.error(e);
        this.generalError = true;
      }
    });
  }

  templateSelectionChanged(templateSelected: number): void {
    if (templateSelected) {
      this.clearStatusFlags();
      this.templateSelectionProcessing = true;
      this.quizAdminService.getQuizTemplate(templateSelected).subscribe({
        next: (template: QuizTemplateDataModel[]) => {
          if (template && template.length) {
            this.template = new QuizTemplateModel(template[0]);
            this.createModifyQuizTemplateForm.reset();
            this.resetFormQuestions();
            this.createModifyQuizTemplateForm.controls.name.setValue(this.template.name);
            this.createModifyQuizTemplateForm.controls.description.setValue(this.template.description);
            this.quizAdminService.getQuestionsForQuizTemplate(templateSelected).subscribe({
              next: (questions: QuizQuestionDataModel[]) => {
                if (questions && questions.length) {
                  for (let i = 0; i < questions.length; i++) {
                    this.addQuestion(new QuizQuestionModel(questions[i]));
                  }
                }
                this.templateSelectionProcessing = false;
              },
              error: (e) => {
                console.error(e);
                this.generalError = true;
                this.templateSelectionProcessing = false;
              }
            });
          }
          else {
            console.error('Error retrieving selected quiz template');
            this.generalError = true;
            this.templateSelectionProcessing = false;
          }
        },
        error: (e) => {
          console.error(e);
          this.generalError = true;
          this.templateSelectionProcessing = false;
        }
      });
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
    const name = this.createModifyQuizTemplateForm.get('name').value;
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
              this.quizAdminService.deleteQuizQuestionsByTemplateId(this.template.id).subscribe({
                next: (result: any) => {
                  if (result) {
                    this.quizAdminService.deleteQuizTemplate(this.template.id).subscribe({
                      next: (result: any) => {
                        if (result) {
                          this.deleteSuccess = true;
                          this.clearTemplateNoConfirm();
                          this.getTemplates();
                        }
                        else {
                          this.deleteError = true;
                        }
                      },
                      error: (e) => {
                        console.error(e);
                        this.deleteError = true;
                      }
                    });
                  }
                },
                error: (e) => {
                  console.error(e);
                  this.deleteError = true;
                }
              });     
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
    let name = this.createModifyQuizTemplateForm.get('name').value;
    if (name) {
      name = name.trim();
    }
    this.template.description = this.createModifyQuizTemplateForm.get('description').value;
    if (this.template.description) {
      this.template.description = this.template.description.trim();
    }
    if (!this.template.id || name !== this.template.name) { // if new template or template name changed
      this.template.name = name;
      this.template.id = null;
      this.quizAdminService.saveNewQuizTemplate(this.template).subscribe({
        next: (results: any) => {
          if (results && results.length) {
            const templateId = results[0].id;
            if (templateId) {
              this.saveAllTemplateQuestions(templateId)
            }
          }
        },
        error: (e) => {
          console.error(e);
          this.saveError = true;
        }
      });
    }
    else { // modifying existing template
      this.quizAdminService.saveExistingQuizTemplate(this.template.id, this.template).subscribe({
        next: (result: any) => {
          if (result) {
            this.quizAdminService.deleteQuizQuestionsByTemplateId(this.template.id).subscribe({
              next: (result: any) => {
                if (result) {
                  this.saveAllTemplateQuestions(this.template.id)
                }
              },
              error: (e) => {
                console.error(e);
                this.saveError = true;
              }
            });
          }
        },  
        error: (e) => {
          console.error(e);
          this.saveError = true;
        }
      });
    }
  }

  addQuestion(question?: QuizQuestionModel): void {
    this.unsubscribeToQuestionTypeChanges();
    this.quizTemplateForm.addQuestion(question);
    this.subscribeToQuestionTypeChanges()
  }

  onDeletedQuestion(index: number): void {
    this.unsubscribeToQuestionTypeChanges()
    this.quizTemplateForm.deleteQuestion(index);
    this.subscribeToQuestionTypeChanges()
  }

  saveAllTemplateQuestions(templateId: number): void {
    const questions: any = this.formQuestions.value;
    let questionSavedCount = 0;
    for (let i = 0; i < questions.length; i++) {
      const answer: any = questions[i].answer;
      let correctOption: number;

      this.question = new QuizQuestionModel()
      this.question.templateId = templateId;
      this.question.textQuestion = questions[i].text;
      if (this.question.textQuestion) {
        this.question.textQuestion = this.question.textQuestion.trim();
      }
      this.question.questionType = questions[i].typeSelect;
      this.question.options = [];

      if (typeof answer.correctOption === 'number') {
        correctOption = answer.correctOption;
      }
      for (let j = 0; j < answer.options.length; j++) {
        const option = answer.options[j];
        let correctAnswer = false;
        if (j === correctOption) {
          correctAnswer = true;
        }
        if (option.option) {
          this.question.options.push({
            optionCorrectAnswer: correctAnswer,
            option: option.option.trim()
          });
        }
      }
      this.question.booleanCorrectAnswer = questions[i].answer.booleanCorrectAnswer;
      this.question.correctAnswerArray = [];
      for (let correctAnswer of questions[i].answer.correctAnswerArray) {
        if (correctAnswer.correctAnswer) {
          this.question.correctAnswerArray.push(correctAnswer.correctAnswer.trim());
        }
      }
      this.quizAdminService.saveNewQuizQuestion(this.question).subscribe({
        next: (result: any) => {
          if (result) {
            questionSavedCount++;
            if (questionSavedCount === questions.length) {
              this.saveSuccess = true;
              this.getTemplates();
              this.clearTemplateNoConfirm();
            }
          }
        },
        error: (e) => {
          console.error(e);
          this.saveError = true;
        }
      });
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
    this.quizTemplateForm.questionTypeChanged(questionType, index);
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
    this.createModifyQuizTemplateForm.reset();
    this.resetFormQuestions();
    this.template = new QuizTemplateModel();
    this.selectTemplateForm.reset();
    const templateSelect = this.selectTemplateForm.get('templateSelect')
    templateSelect.setValue('');
  }
}
