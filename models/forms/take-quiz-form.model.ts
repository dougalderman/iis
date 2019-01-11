import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms'
import * as _ from 'lodash';

import { QuizQuestionModel } from  '../quizzes/quiz-question.model';
import { noOptionsSelectedValidator } from '../../public/src/app/validators/no-options-selected.validator';
import { requiredTrimWhitespaceValidator } from '../../public/src/app/validators/required-trim-whitespace.validator';

export class TakeQuizFormModel {
  constructor(
    private fb: FormBuilder
  ) {}

  answer: FormGroup = this.fb.group({
    options: this.fb.array([],
      {
        validators: noOptionsSelectedValidator,
      }
    ),
    booleanAnswer: [false],
    textAnswer: ['', , requiredTrimWhitespaceValidator()]
  })

  question: FormGroup = this.fb.group({
    text: [''],
    type: [''],
    answer: _.cloneDeep(this.answer)
  })

  questions: FormArray = this.fb.array([
    this.question
  ])

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
        text: [question.textQuestion],
        type: [question.questionType],
        answer: this.getAnswer(question.questionType, question)
      }));
    }
  }

  getAnswer(questionType: string, question?: QuizQuestionModel): FormGroup {
    let answer: FormGroup = _.cloneDeep(this.answer);

    switch (questionType) {
      case 'textQuestionMultipleChoice':
        if (question) {
          let options = answer.controls.options as FormArray;
          if (question.options && question.options.length) {
            for (let i = 0; i < question.options.length; i++) {
              options.push(this.fb.group({
                optionSelect: [''],
                option: [question.options[i].option]
              }));
            }
          }
        }
        break;
    }

    return answer;
  }
}
