import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms'
import * as _ from 'lodash';

import { QuizQuestionModel } from  '../quizzes/quiz-question.model';
import { checkForDuplicatesValidator } from '../../public/src/app/validators/check-for-duplicates.validator';
import { optionsCorrectAnswerRequiredValidator } from '../../public/src/app/validators/options-correct-answer-required.validator';
import { requiredTrimWhitespaceValidator } from '../../public/src/app/validators/required-trim-whitespace.validator';
import { getDefaultQuestionType } from '../../public/src/app/utilities/get-default-question-type.utility';

export class TakeQuizForm {
  constructor(
    private fb: FormBuilder
  ) {}

  answer: FormGroup = this.fb.group({
    options: this.fb.array([]),
    booleanAnswer: [false],
    textAnswer: ['']
  })

  question: FormGroup = this.fb.group({
    text: [''],
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
        text: [question.textQuestion, requiredTrimWhitespaceValidator()],
        typeSelect: new FormControl(question.questionType),
        answer: this.getAnswer(question.questionType, question)
      }));
    }
    else {
      const defaultQuestionType = getDefaultQuestionType();
      this.formQuestions.push(this.fb.group({
        text: [''],
        answer: this.getAnswer(defaultQuestionType)
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
                optionSelect: [question.options[i].optionCorrectAnswer],
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
