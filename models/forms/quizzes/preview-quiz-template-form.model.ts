import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms'
import * as _ from 'lodash';

import { QuizQuestionModel } from  '../../quizzes/quiz-question.model';
import { getDefaultQuestionType } from '../../../public/src/app/utilities/get-default-question-type.utility';

export class PreviewQuizTemplateFormModel  {
  constructor(
    private fb: FormBuilder
  ) {}

  answer: FormGroup = this.fb.group({
    options: this.fb.array([]),
    correctOption: [{value: 0, disabled: true}],
    booleanCorrectAnswer: [{value: false, disabled: true}],
    correctAnswerArray: this.fb.array([]),
  });

  question: FormGroup = this.fb.group({
    text: [{value: '', disabled: true}],
    typeSelect: new FormControl({value: getDefaultQuestionType('quiz'), disabled: true}),
    answer: _.cloneDeep(this.answer)
  });

  questions: FormArray = this.fb.array([
    this.question
  ]);

  previewQuizTemplateForm: FormGroup = this.fb.group({
    formQuestions: this.questions
  });

  get formQuestions(): FormArray {
    return this.previewQuizTemplateForm.get('formQuestions') as FormArray;
  }

  addQuestion(question: QuizQuestionModel) {
    if (question) {
      this.formQuestions.push(this.fb.group({
        text: [{value: question.textQuestion, disabled: true}],
        typeSelect: new FormControl({value: question.questionType, disabled: true}),
        answer: this.getAnswer(question.questionType, question)
      }));
    }
  }

  deleteQuestion(index: number) {
    if (typeof index === 'number') {
      this.formQuestions.removeAt(index);
    }
  }

  getAnswer(questionType: string, question: QuizQuestionModel): FormGroup {
    let answer: FormGroup = _.cloneDeep(this.answer);

    switch (questionType) {
      case 'textQuestionMultipleChoice':

        if (question) {
          let options = answer.controls.options as FormArray;
          let correctOption = answer.controls.correctOption;
          if (question.options && question.options.length) {
            for (let i = 0; i < question.options.length; i++) {
              const option = question.options[i];
              if (option.optionCorrectAnswer) {
                correctOption.setValue(i);
              }
              options.push(this.fb.group({
                option: [{value: question.options[i].option, disabled: true}]
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
                  correctAnswer: [{value: question.correctAnswerArray[i], disabled: true}]
                })
              );
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
}
