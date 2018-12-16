import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { QuizTemplate } from  '../../../../../models/quizzes/quizTemplate';
import { QuizQuestion } from  '../../../../../models/quizzes/quizQuestion';
import { QuizTemplateData } from  '../../../../../models/quizzes/data/quizTemplateData';
import { QuizQuestionData } from  '../../../../../models/quizzes/data/quizQuestionData';

import { QuizAdminService } from '../../services/quiz-admin.service';
import { ModalService } from '../../services/modal.service';

class Template extends QuizTemplate {}
class Question extends QuizQuestion {}

const QUESTION_TYPES = [
  {name: 'textQuestionMultipleChoice', description: 'Text Question Multiple Choice', default: true},
  {name: 'textQuestionShortAnswer', description: 'Text Question Short Answer'},
  {name: 'textQuestionBoolean', description: 'Text Question Boolean'},
]

@Component({
  selector: 'app-create-modify-quiz-template',
  templateUrl: './create-modify-quiz-template.component.html',
  styleUrls: ['./create-modify-quiz-template.component.scss']
})
export class CreateModifyQuizTemplateComponent implements OnInit {

  template: QuizTemplate = new Template();
  templates: QuizTemplate[];
  question: QuizQuestion = new Question();
  questionTypeChangedSubscription: Subscription[] = [];
  saveSuccess: boolean = false;
  deleteSuccess: boolean = false;
  saveError: boolean = false;
  deleteError: boolean = false;
  generalError: boolean = false;
  errorMessage: string = '';
  alphaIdArray = [];

  constructor(
    private quizAdminService: QuizAdminService,
    private modalService: ModalService,
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
    this.createModifyQuizTemplateForm.get('name').valueChanges.subscribe(
      (val: string) => {
        if (val) {
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
    return this.createModifyQuizTemplateForm.get('formQuestions') as FormArray;
  }

  get name(): AbstractControl { return this.createModifyQuizTemplateForm.get('name'); }
  get description(): AbstractControl { return this.createModifyQuizTemplateForm.get('description'); }

  subscribeToQuestionTypeChanges(): void {
    if (this.formQuestions && this.formQuestions.controls) {
      for (let i = 0; i < this.formQuestions.controls.length; i++) {
        let formQuestionsControls: FormGroup = this.formQuestions.controls[i] as FormGroup;
        this.questionTypeChangedSubscription[i] = formQuestionsControls.controls.typeSelect.valueChanges.subscribe(
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
    this.quizAdminService.getAllQuizTemplates()
      .subscribe(
        (templates: QuizTemplateData[]) => {
          if (templates) {
            this.templates = templates;
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
      this.quizAdminService.getQuizTemplate(templateSelected)
        .subscribe(
          (template: QuizTemplateData[]) => {
            if (template && template.length) {
              this.template = template[0] as QuizTemplate;
              this.createModifyQuizTemplateForm.reset();
              this.resetFormQuestions();
              this.createModifyQuizTemplateForm.controls.name.setValue(this.template.name);
              this.createModifyQuizTemplateForm.controls.description.setValue(this.template.description);
              this.quizAdminService.getQuestionsForQuizTemplate(templateSelected)
                .subscribe(
                  (questions: QuizQuestionData[]) => {
                    if (questions && questions.length) {
                      for (let i = 0; i < questions.length; i++) {
                        let question = new Question();
                        question.textQuestion = questions[i].text_question;
                        question.questionType = questions[i].question_type;
                        question.options = questions[i].options;
                        question.booleanCorrectAnswer = questions[i].boolean_correct_answer;
                        question.correctAnswerArray = questions[i].correct_answer_array;
                        this.addQuestion(question);
                      }
                    }
                  },
                  error => {
                    console.error(error);
                    this.generalError = true;
                  }
                );
            }
            else {
              console.error('Error retrieving selected quiz template');
              this.generalError = true;
            }
        },
        error => {
          console.error(error);
          this.generalError = true;
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
              this.quizAdminService.deleteQuizQuestionsByTemplateId(this.template.id)
                .subscribe(
                  (result: any) => {
                    if (result) {
                      this.quizAdminService.deleteQuizTemplate(this.template.id)
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
      this.quizAdminService.saveNewQuizTemplate(this.template)
        .subscribe(
          (result: any) => {
            if (result) {
              this.quizAdminService.getQuizTemplateByName(this.template.name)
                .subscribe(
                  (template: QuizTemplateData[]) => {
                    if (template && template.length) {
                      const templateId = template[0].id;
                      if (templateId) {
                        this.saveAllTemplateQuestions(templateId)
                      }
                    }
                    else {
                      console.error('Error retrieving quiz template');
                      this.saveError = true;
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
      else { // modifying existing template
        this.quizAdminService.saveExistingQuizTemplate(this.template.id, this.template)
          .subscribe(
            (result: any) => {
              if (result) {
                this.quizAdminService.deleteQuizQuestionsByTemplateId(this.template.id)
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

  addQuestion(question?: QuizQuestion): void {
    this.unsubscribeToQuestionTypeChanges();
    const len = this.formQuestions.length;
    // addQuestion
    this.subscribeToQuestionTypeChanges()
  }

  onDeletedQuestion(index: number): void {
    this.unsubscribeToQuestionTypeChanges()
    // deleteQuestion
    this.subscribeToQuestionTypeChanges()
  }

  saveAllTemplateQuestions(templateId: number): void {
    let questions = this.formQuestions.value;
    let questionSavedCount = 0;
    for (let i = 0; i < questions.length; i++) {
      this.question = new Question()
      this.question.templateId = templateId;
      this.question.textQuestion = questions[i].text;
      if (this.question.textQuestion) {
        this.question.textQuestion = this.question.textQuestion.trim();
      }
      this.question.questionType = questions[i].typeSelect;
      this.question.options = [];
      for (let option of questions[i].answer.options) {
        if (option.option) {
          this.question.options.push({
            optionCorrectAnswer: option.optionCorrectAnswer,
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
      this.quizAdminService.saveNewQuizQuestion(this.question)
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
    this.formQuestions.removeAt(index);
    this.formQuestions.insert(index, this.fb.group({
      text: ['', requiredTrimWhitespaceValidator()],
      typeSelect: new FormControl(questionType),
      answer: this.getAnswer(questionType)
    }));
    this.subscribeToQuestionTypeChanges();
  }

  getAnswer(questionType: string, question?: QuizQuestion): FormGroup {
    let answer: FormGroup = _.cloneDeep(this.formAnswer);

    switch (questionType) {
      case 'textQuestionMultipleChoice':
        if (question) {
          let options = answer.controls.options as FormArray;
          if (question.options && question.options.length) {
            for (let i = 0; i < question.options.length; i++) {
              options.push(this.fb.group({
                optionCorrectAnswer: [question.options[i].optionCorrectAnswer],
                option: [question.options[i].option, [requiredTrimWhitespaceValidator(), checkForDuplicatesValidator('option', i)]]
              }));
            }
          }
        }
        break;

      case 'textQuestionShortAnswer':
        if (question) {
          let correctAnswerArray = answer.controls.correctAnswerArray as FormArray;
          if (question.correctAnswerArray && question.correctAnswerArray.length) {
            for (let i = 0; i < question.correctAnswerArray.length; i++) {
              correctAnswerArray.push(
                this.fb.group({
                  correctAnswer: [question.correctAnswerArray[i], [requiredTrimWhitespaceValidator(), checkForDuplicatesValidator('correctAnswer', i)]]
                })
              )
            }
          }
        }
        break;

      case 'textQuestionBoolean':
        if (question) {
          answer.controls.booleanCorrectAnswer.setValue(question.booleanCorrectAnswer);
        }
        break;
    }

    return answer;
  }

  clearStatusFlags() {
    this.saveSuccess = false;
    this.deleteSuccess = false;
    this.saveError = false;
    this.deleteError = false;
    this.generalError = false;
    this.errorMessage = '';
  }

  clearTemplateNoConfirm() {
    this.createModifyQuizTemplateForm.reset();
    this.resetFormQuestions();
    this.selectTemplateForm.reset();
    this.template = new Template();
  }
}
