import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms'
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
  {name: 'textQuestionNumericAnswer', description: 'Text Question Numeric Answer'},
  {name: 'textQuestionNumericRangeAnswer', description: 'Text Question Numeric Range Answer'},
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
  questionTypes: any[] = QUESTION_TYPES;
  questionTypeChangedSubscription: Subscription[] = [];
  saveSuccess: boolean = false;
  deleteSuccess: boolean = false;
  saveError: boolean = false;
  deleteError: boolean = false;
  generalError: boolean = false;
  errorMessage: string = '';
  alphaIdArray = [];

  selectTemplateForm: FormGroup = this.fb.group({
    templateSelect: new FormControl('')
  })

  formAnswer: FormGroup = this.fb.group({
    options: this.fb.array([
      this.fb.group({
        option: ['']
      })
    ]),
    booleanCorrectAnswer: [false],
    correctAnswer: [''],
    correctAnswerArray: this.fb.array([
      this.fb.group({
        correctAnswer: ['']
      })
    ]),
    integerCorrectAnswer: [0],
    integerStartCorrectAnswer: [0],
    integerEndCorrectAnswer: [0]
  })

  createModifyQuizTemplateForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    formQuestions: this.fb.array([
      this.fb.group({
        text: ['', Validators.required],
        typeSelect: new FormControl(this.getDefaultQuestionType()),
        answer: _.cloneDeep(this.formAnswer)
      })
    ])
  });

  constructor(
    private quizAdminService: QuizAdminService,
    private modalService: ModalService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.alphaIdArray = this.fillIdArray(this.alphaIdArray);
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
          if (templates && templates.length) {
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
                        question.correctAnswer = questions[i].correct_answer;
                        question.correctAnswerArray = questions[i].correct_answer_array;
                        question.integerCorrectAnswer = questions[i].integer_correct_answer;
                        question.integerStartCorrectAnswer = questions[i].integer_start_correct_answer;
                        question.integerEndCorrectAnswer = questions[i].integer_end_correct_answer;
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
    const name = this.createModifyQuizTemplateForm.get('name').value;
    this.template.description = this.createModifyQuizTemplateForm.get('description').value;
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
    if (question) {
      this.formQuestions.push(this.fb.group({
        text: [question.textQuestion, Validators.required],
        typeSelect: new FormControl(question.questionType),
        answer: this.getAnswer(question.questionType, question)
      }));
    }
    else {
      const defaultQuestionType = this.getDefaultQuestionType();
      this.formQuestions.push(this.fb.group({
        text: ['', Validators.required],
        typeSelect: new FormControl(defaultQuestionType),
        answer: this.getAnswer(defaultQuestionType)
      }));
    }
    this.subscribeToQuestionTypeChanges()
  }

  deleteQuestion(index: number): void {
    this.unsubscribeToQuestionTypeChanges()
    if (typeof index === 'number') {
      this.formQuestions.removeAt(index)
    }
    this.subscribeToQuestionTypeChanges()
  }

  addOption(questionIndex, option?: string): void {
    if (typeof questionIndex === 'number') {
      let formQuestion = this.formQuestions.controls[questionIndex] as FormGroup;
      let answer = formQuestion.controls.answer as FormGroup;
      let options =  answer.controls.options as FormArray;
      console.log('in addOption()');

      if (option) {
        options.push(this.fb.group({
          option: [option],
        }));
      }
      else {
        options.push(this.fb.group({
          option: [''],
        }));
      }
    }
  }

  deleteOption(questionIndex, optionIndex): void {
    if (typeof questionIndex === 'number' && typeof optionIndex === 'number') {
      let formQuestion = this.formQuestions.controls[questionIndex] as FormGroup;
      let answer = formQuestion.controls.answer as FormGroup;
      let options =  answer.controls.options as FormArray;
      console.log('in deleteOption()');

      options.removeAt(optionIndex);
    }
  }

  addCorrectAnswer(questionIndex, correctAnswer?: string): void {
    if (typeof questionIndex === 'number') {
      let formQuestion = this.formQuestions.controls[questionIndex] as FormGroup;
      let answer = formQuestion.controls.answer as FormGroup;
      let correctAnswerArray = answer.controls.correctAnswerArray as FormArray;
      console.log('in addCorrectAnswer()');

      if (correctAnswer) {
        correctAnswerArray.push(this.fb.group({
          correctAnswer: [correctAnswer],
        }));
      }
      else {
        correctAnswerArray.push(this.fb.group({
          correctAnswer: [''],
        }));
      }
    }
  }

  deleteCorrectAnswer(questionIndex, correctAnswerIndex): void {
    if (typeof questionIndex === 'number' && typeof correctAnswerIndex === 'number') {
      let formQuestion = this.formQuestions.controls[questionIndex] as FormGroup;
      let answer = formQuestion.controls.answer as FormGroup;
      let correctAnswerArray =  answer.controls.correctAnswerArray as FormArray;
      console.log('in deleteOption()');

      correctAnswerArray.removeAt(correctAnswerIndex);
    }
  }

  saveAllTemplateQuestions(templateId: number): void {
    let questions = this.formQuestions.value;
    let questionSavedCount = 0;
    for (let question of questions) {
      this.question = new Question()
      this.question.templateId = templateId;
      this.question.textQuestion = question.text;
      this.question.questionType = question.typeSelect;
      this.question.options = [];
      for (let option of question.answer.options) {
        if (option.option) {
          this.question.options.push(option.option);
        }
      }
      this.question.booleanCorrectAnswer = question.answer.booleanCorrectAnswer;
      this.question.correctAnswer = question.answer.correctAnswer;
      this.question.correctAnswerArray = [];
      for (let correctAnswer of question.answer.correctAnswerArray) {
        if (correctAnswer.correctAnswer) {
          this.question.correctAnswerArray.push(correctAnswer.correctAnswer);
        }
      }
      this.question.integerCorrectAnswer = question.answer.integerCorrectAnswer;
      this.question.integerStartCorrectAnswer = question.answer.integerStartCorrectAnswer;
      this.question.integerEndCorrectAnswer = question.answer.integerEndCorrectAnswer;
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
      this.deleteQuestion(i);
    }
    this.formQuestions.reset();
  }

  questionTypeChanged(questionType: string, index: number): void {
    this.unsubscribeToQuestionTypeChanges();
    this.formQuestions.removeAt(index);
    this.formQuestions.insert(index, this.fb.group({
      text: ['', Validators.required],
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
            options.removeAt(0);
            for (let i = 0; i < question.options.length; i++) {
              options.push(
                this.fb.group({
                  option: [question.options[i]]
                })
              )
            }
          }
          answer.controls.correctAnswer.setValue(question.correctAnswer);
        }
        else {
          answer.controls.correctAnswer.setValue('');
        }
        break;

      case 'textQuestionShortAnswer':
        if (question) {
          let correctAnswerArray = answer.controls.correctAnswerArray as FormArray;
          if (question.correctAnswerArray && question.correctAnswerArray.length) {
            correctAnswerArray.removeAt(0);
            for (let i = 0; i < question.correctAnswerArray.length; i++) {
              correctAnswerArray.push(
                this.fb.group({
                  correctAnswer: [question.correctAnswerArray[i]]
                })
              )
            }
          }
        }
        break;
    }

    return answer;
  }

  getDefaultQuestionType(): string {
    const defaultQuestionType = this.questionTypes.find(
      (type: any) => {
        return type.default === true;
      }
    );
    return defaultQuestionType.name;
  }

  fillIdArray(id: string[]): string[] {
    let c = 'a';

    for (let i = 0; i < 26; i++) {
      id.push(c);
      c = this.nextChar(c)
    }
    return id;
  }

  nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
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
