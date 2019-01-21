import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms'
import * as _ from 'lodash';

import { SurveyQuestionModel } from  '../../surveys/survey-question.model';
import { getDefaultQuestionType } from '../../../public/src/app/utilities/get-default-question-type.utility';

export class PreviewSurveyTemplateFormModel  {
  constructor(
    private fb: FormBuilder
  ) {}

  answer: FormGroup = this.fb.group({
    options: this.fb.array([]),
    numericLowRange: [{value: '', disabled: true}],
    numericHighRange: [{value: '', disabled: true}]
  })

  question: FormGroup = this.fb.group({
    text: [{value: '', disabled: true}],
    typeSelect: new FormControl({value: getDefaultQuestionType('survey'), disabled: true}),
    answer: _.cloneDeep(this.answer)
  })

  questions: FormArray = this.fb.array([
    this.question
  ])

  previewSurveyTemplateForm: FormGroup = this.fb.group({
    formQuestions: this.questions
  });

  get formQuestions(): FormArray {
    return this.previewSurveyTemplateForm.get('formQuestions') as FormArray;
  }

  addQuestion(question: SurveyQuestionModel) {
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
      this.formQuestions.removeAt(index)
    }
  }

  getAnswer(questionType: string, question: SurveyQuestionModel): FormGroup {
    let answer: FormGroup = _.cloneDeep(this.answer);

    switch (questionType) {
      case 'textQuestionMultipleChoice':
        if (question) {
          let options = answer.controls.options as FormArray;
          if (question.options && question.options.length) {
            for (let i = 0; i < question.options.length; i++) {
              options.push(this.fb.group({
                option: [{value: question.options[i], disabled: true}]
              }));
            }
          }
        }
        break;

      case 'textQuestionNumericAnswer':
        if (question) {
          let numericLowRange = answer.controls.numericLowRange;
          let numericHighRange = answer.controls.numericHighRange;

          numericLowRange.setValue(question.integerStartAnswerRange);
          numericHighRange.setValue(question.integerEndAnswerRange);
        }
        break;
    }

    return answer;
  }
}
