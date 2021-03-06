import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms'
import * as _ from 'lodash';

import { QuizQuestionModel } from  '../../quizzes/quiz-question.model';
import { requiredTrimWhitespaceValidator } from '../../../public/src/app/validators/required-trim-whitespace.validator';

export class TakeQuizFormModel {
  constructor(
    private fb: FormBuilder
  ) {}

  answer: FormGroup = this.fb.group({
    options: this.fb.array([]),
    selectedOption: ['', Validators.required],
    booleanAnswer: ['', Validators.required],
    textAnswer: ['', requiredTrimWhitespaceValidator()]
  });

  question: FormGroup = this.fb.group({
    text: [{value: '', disabled: true}],
    type: [{value: '', disabled: true}],
    answer: _.cloneDeep(this.answer)
  });

  questions: FormArray = this.fb.array([
    this.question
  ]);

  takeQuizForm: FormGroup = this.fb.group({
    title: [''],
    formQuestions: this.questions
  });

  get formQuestions(): FormArray {
    return this.takeQuizForm.get('formQuestions') as FormArray;
  }

  addQuestion(question?: QuizQuestionModel) {
    if (question) {
      this.formQuestions.push(this.fb.group({
        text: [{value: question.textQuestion, disabled: true}],
        type: [{value: question.questionType, disabled: true}],
        answer: this.getAnswer(question.questionType, question)
      }));
    }
  }

  deleteQuestion(index: number) {
    if (typeof index === 'number') {
      this.formQuestions.removeAt(index);
    }
  }

  getAnswer(questionType: string, question?: QuizQuestionModel): FormGroup {
    let answer: FormGroup;

    switch (questionType) {
      case 'textQuestionMultipleChoice':

        answer = this.fb.group({
          options: this.fb.array([]),
          selectedOption: ['', Validators.required],
          booleanAnswer: [{value: false, disabled: true}],
          textAnswer: [{value: '', disabled: true}]
        });

        if (question) {
          let options = answer.controls.options as FormArray;
          if (question.options && question.options.length) {
            for (let i = 0; i < question.options.length; i++) {
              options.push(this.fb.group({
                option: [{value: question.options[i].option, disabled: true}]
              }));
            }
          }
        }

        break;

      case 'textQuestionShortAnswer':
        answer = this.fb.group({
          options: this.fb.array([]),
          selectedOption: [{value: 0, disabled: true}],
          booleanAnswer: [{value: false, disabled: true}],
          textAnswer: ['', requiredTrimWhitespaceValidator()]
        });
        break;

      case 'textQuestionBoolean':
        answer = this.fb.group({
          options: this.fb.array([]),
          selectedOption: [{value: 0, disabled: true}],
          booleanAnswer: ['', Validators.required],
          textAnswer: [{value: '', disabled: true}]
        });
        break;
    }

    return answer;
  }
}
