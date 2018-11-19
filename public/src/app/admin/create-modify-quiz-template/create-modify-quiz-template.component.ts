import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms'
import { Subscription } from 'rxjs'
import { QuizTemplate } from  '../../../../../models/quizzes/quizTemplate';
import { QuizQuestion } from  '../../../../../models/quizzes/quizQuestion';
import { QuizTemplateData } from  '../../../../../models/quizzes/data/quizTemplateData';
import { QuizQuestionData } from  '../../../../../models/quizzes/data/quizQuestionData';

import { QuizAdminService } from '../../services/quiz-admin.service'

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
  answer: any[] = [];
  questionTypeChangedSubscription: Subscription[] = [];
  success: boolean = false;
  error: boolean = false;

  selectTemplateForm: FormGroup = this.fb.group({
    templateSelect: new FormControl('')
  })

  createModifyQuizTemplateForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    formQuestions: this.fb.array([
      this.fb.group({
        text: ['', Validators.required],
        typeSelect: new FormControl(''),
        answer: this.fb.group({
          options: this.fb.array([
            this.fb.group({
              option: this.fb.group({
                id: [''],
                answer: ['']
              })
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
      })
    ])
  });

  constructor(
    private quizAdminService: QuizAdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getTemplates();
    this.setDefaultQuestionType(0);
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
        this.error = true;
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
            this.error = true;
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
          this.error = true;
        }
      );
  }

  templateSelectionChanged(templateSelected: number): void {
    if (templateSelected) {
      this.success = false;
      this.error = false;
      this.quizAdminService.getQuizTemplate(templateSelected)
        .subscribe(
          (template: QuizTemplateData[]) => {
            if (template && template.length) {
              this.template = template[0];
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
                    this.error = true;
                  }
                );
            }
            else {
              console.error('Error retrieving selected quiz template');
              this.error = true;
            }
        },
        error => {
          console.error(error);
          this.error = true;
        }
      );
    }
  }

  saveTemplate(): void {
    this.error = false;
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
                      this.error = true;
                    }
                  },
                  error => {
                    console.error(error);
                    this.error = true;
                  }
                );
            }
          },
          error => {
            console.error(error);
            this.error = true;
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
                      this.error = true;
                    }
                  )
              }
            },
            error => {
              console.error(error);
              this.error = true;
            }
          );
      }
  }

  addQuestion(question?: QuizQuestion): void {
    this.unsubscribeToQuestionTypeChanges()
    if (question) {
      this.formQuestions.push(this.fb.group({
        text: [question.textQuestion, Validators.required],
        typeSelect: new FormControl(question.questionType),
        answer: new FormControl(this.getAnswer(question.questionType, question))
      }));
    }
    else {
      this.formQuestions.push(this.fb.group({
          text: ['', Validators.required],
          typeSelect: new FormControl(''),
          answer: new FormControl(this.getAnswer(this.getDefaultQuestionType()))
      }));
      const indxLastQuestion = this.formQuestions.length - 1;
      this.setDefaultQuestionType(indxLastQuestion);
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

  addOption(): void {
    console.log('in addOption()');
  }

  deleteOption(indx1, indx2): void {
    console.log('in deleteOption()')
  }

  addCorrectAnswer(): void {
    console.log('in addCorrectAnswer()');
  }

  deleteCorrectAnswer(indx1, indx2): void {
    console.log('in deleteCorrectAnswer()')
  }

  saveAllTemplateQuestions(templateId: number): void {
    let questions = this.formQuestions.value;
    let questionSavedCount = 0;
    for (let question of questions) {
      this.question = new Question()
      this.question.templateId = templateId;
      this.question.textQuestion = question.text;
      this.question.questionType = question.typeSelect;
      this.question.options = questions.options;
      this.question.booleanCorrectAnswer = question.answer.booleanCorrectAnswer;
      this.question.correctAnswer = question.answer.correctAanswer;
      this.question.correctAnswerArray = question.answer.correctAnswerArray;
      this.question.integerCorrectAnswer = question.answer.integerCorrectAnswer;
      this.question.integerStartCorrectAnswer = question.answer.integerStartCorrectAnswer;
      this.question.integerEndCorrectAnswer = question.answer.integerEndCorrectAnswer;
      this.quizAdminService.saveNewQuizQuestion(this.question)
        .subscribe(
          (result: any) => {
            if (result) {
              questionSavedCount++;
              if (questionSavedCount === questions.length) {
                this.success = true;
                this.createModifyQuizTemplateForm.reset();
                this.resetFormQuestions();
                this.getTemplates();
                this.selectTemplateForm.reset();
              }
            }
          },
          error => {
            console.error(error);
            this.error = true;
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
    let formQuestion: FormGroup = this.formQuestions.controls[index] as FormGroup;
    formQuestion.controls.answer.setValue(this.getAnswer(questionType));
  }

  /* question.options = questions[i].options;
  question.booleanCorrectAnswer = questions[i].boolean_correct_answer;
  question.correctAnswer = questions[i].correct_answer;
  question.correctAnswerArray = questions[i].correct_answer_array;
  question.integerCorrectAnswer = questions[i].integer_correct_answer;
  question.integerStartCorrectAnswer = questions[i].integer_start_correct_answer;
  question.integerEndCorrectAnswer = questions[i].integer_end_correct_answer;


 answer: this.fb.group({
  options: this.fb.array([
    this.fb.group({
      option: this.fb.group({
        id: [''],
        answer: ['']
      })
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
}) */

  getAnswer(questionType: string, question?: QuizQuestion): AbstractControl {
    const answer = this.fb.group({});
    const options = answer.controls.options as FormArray;
    const correctAnswerArray = answer.controls.correctAnswerArray as FormArray;
    switch (questionType) {
      case 'textQuestionMultipleChoice':
        if (question) {
          if (question.options && question.options.length) {
            for (let i = 0; i < question.options.length; i++) {
              options.push(
                this.fb.group({
                  id: [question.options[i].id],
                  answer: [question.options[i].answer]
                })
              )
            }
          }
          answer.controls.correctAnswer.setValue(question.correctAnswer);
        }
        break;
      case 'textQuestionShortAnswer':
        if (question) {
          if (question.correctAnswerArray && question.correctAnswerArray.length) {
            for (let i = 0; i < question.correctAnswerArray.length; i++) {
              correctAnswerArray.push(
                this.fb.group({
                  id: [question.options[i].id],
                  answer: [question.options[i].answer]
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

  setDefaultQuestionType(index: number): void {
    let formQuestion: FormGroup = this.formQuestions.controls[index] as FormGroup;
    formQuestion.controls.typeSelect.setValue(this.getDefaultQuestionType());

  }
}
