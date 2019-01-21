import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms'
import * as _ from 'lodash';

import { SurveyQuestionModel } from  '../../surveys/survey-question.model';
import { noOptionsSelectedValidator } from '../../../public/src/app/validators/no-options-selected.validator';
import { requiredTrimWhitespaceValidator } from '../../../public/src/app/validators/required-trim-whitespace.validator';

export class TakeSurveyFormModel {
  constructor(
    private fb: FormBuilder
  ) {}

  answer: FormGroup = this.fb.group({
    options: this.fb.array([],
      {
        validators: noOptionsSelectedValidator
      }
    ),
    booleanAnswer: ['', Validators.required],
    textAnswer: ['', requiredTrimWhitespaceValidator()],
    numericAnswer: ['', Validators.required]
  })

  question: FormGroup = this.fb.group({
    text: [{value: '', disabled: true}],
    type: [{value: '', disabled: true}],
    answer: _.cloneDeep(this.answer)
  })

  questions: FormArray = this.fb.array([
    this.question
  ])

  takeSurveyForm: FormGroup = this.fb.group({
    title: [''],
    formQuestions: this.questions
  });

  get formQuestions(): FormArray {
    return this.takeSurveyForm.get('formQuestions') as FormArray;
  }

  addQuestion(question?: SurveyQuestionModel) {
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
      this.formQuestions.removeAt(index)
    }
  }

  getAnswer(questionType: string, question?: SurveyQuestionModel): FormGroup {
    let answer: FormGroup;

    switch (questionType) {
      case 'textQuestionMultipleChoice':

        answer = this.fb.group({
          options: this.fb.array([],
            {
              validators: noOptionsSelectedValidator
            }
          ),
          booleanAnswer: [{value: false, disabled: true}],
          textAnswer: [{value: '', disabled: true}],
          numericAnswer: [{value: '', disabled: true}]
        })

        if (question) {
          let options = answer.controls.options as FormArray;
          if (question.options && question.options.length) {
            for (let i = 0; i < question.options.length; i++) {
              options.push(this.fb.group({
                optionSelect: [false],
                option: [{value: question.options[i], disabled: true}]
              }));
            }
          }
        }

        break;

      case 'textQuestionShortAnswer':
        answer = this.fb.group({
          options: this.fb.array([]),
          booleanAnswer: [{value: false, disabled: true}],
          textAnswer: ['', requiredTrimWhitespaceValidator()],
          numericAnswer: [{value: '', disabled: true}]
        })
        break;

      case 'textQuestionBoolean':
        answer = this.fb.group({
          options: this.fb.array([]),
          booleanAnswer: ['', Validators.required],
          textAnswer: [{value: '', disabled: true}],
          numericAnswer: [{value: '', disabled: true}],
        })
        break;

      case 'textQuestionNumericAnswer':
        answer = this.fb.group({
          options: this.fb.array([]),
          booleanAnswer: [{value: false, disabled: true}],
          textAnswer: [{value: '', disabled: true}],
          numericAnswer: ['', Validators.required],
        })
        break;
    }

    return answer;
  }
}
