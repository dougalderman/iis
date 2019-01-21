import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms'
import * as _ from 'lodash';

import { SurveyQuestionModel } from  '../../surveys/survey-question.model';
import { checkForDuplicatesValidator } from '../../../public/src/app/validators/check-for-duplicates.validator';
import { requiredTrimWhitespaceValidator } from '../../../public/src/app/validators/required-trim-whitespace.validator';
import { CheckTemplateNameValidator } from '../../../public/src/app/validators/check-template-name.validator';
import { getDefaultQuestionType } from '../../../public/src/app/utilities/get-default-question-type.utility';

export class CreateModifySurveyTemplateFormModel {
  constructor(
    private fb: FormBuilder,
    private checkTemplateName: CheckTemplateNameValidator
  ) {}

  selectTemplateForm: FormGroup = this.fb.group({
    templateSelect: new FormControl('')
  })

  answer: FormGroup = this.fb.group({
    options: this.fb.array([]),
    numericLowRange: [''],
    numericHighRange: ['']
  })

  question: FormGroup = this.fb.group({
    text: ['', requiredTrimWhitespaceValidator()],
    typeSelect: new FormControl(getDefaultQuestionType('survey')),
    answer: _.cloneDeep(this.answer)
  })

  questions: FormArray = this.fb.array([
    this.question
  ])

  createModifySurveyTemplateForm: FormGroup = this.fb.group({
    name: ['', {
      validators: requiredTrimWhitespaceValidator(),
      asyncValidators: this.checkTemplateName.validate.bind(this.checkTemplateName),
      updateOn: 'blur'
    }],
    description: [''],
    formQuestions: this.questions
  });

  get formQuestions(): FormArray {
    return this.createModifySurveyTemplateForm.get('formQuestions') as FormArray;
  }

  addQuestion(question?: SurveyQuestionModel) {
    if (question) {
      this.formQuestions.push(this.fb.group({
        text: [question.textQuestion, requiredTrimWhitespaceValidator()],
        typeSelect: new FormControl(question.questionType),
        answer: this.getAnswer(question.questionType, question)
      }));
    }
    else {
      const defaultQuestionType = getDefaultQuestionType('survey');
      this.formQuestions.push(this.fb.group({
        text: ['', requiredTrimWhitespaceValidator()],
        typeSelect: new FormControl(defaultQuestionType),
        answer: this.getAnswer(defaultQuestionType)
      }));
    }
  }

  deleteQuestion(index: number) {
    if (typeof index === 'number') {
      this.formQuestions.removeAt(index)
    }
  }

  questionTypeChanged(questionType: string, index: number): void {
    this.formQuestions.removeAt(index);
    this.formQuestions.insert(index, this.fb.group({
      text: ['', requiredTrimWhitespaceValidator()],
      typeSelect: new FormControl(questionType),
      answer: this.getAnswer(questionType)
    }));
  }

  getAnswer(questionType: string, question?: SurveyQuestionModel): FormGroup {
    let answer: FormGroup = _.cloneDeep(this.answer);

    switch (questionType) {
      case 'textQuestionMultipleChoice':
        if (question) {
          let options = answer.controls.options as FormArray;
          if (question.options && question.options.length) {
            for (let i = 0; i < question.options.length; i++) {
              options.push(this.fb.group({
                option: [question.options[i], [requiredTrimWhitespaceValidator(), checkForDuplicatesValidator('option', i)]]
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

  addOption(questionIndex: number): void {
    if (typeof questionIndex === 'number') {
      let question = this.formQuestions.controls[questionIndex] as FormGroup;
      let answer = question.controls.answer as FormGroup;
      let options =  answer.controls.options as FormArray;

      options.push(this.fb.group({
        option: ['', [requiredTrimWhitespaceValidator(), checkForDuplicatesValidator('option', options.length)]]
      }));
    }
  }

  deleteOption(questionIndex: number, optionIndex: number): void {
    if (typeof questionIndex === 'number' && typeof optionIndex === 'number') {
      let question = this.formQuestions.controls[questionIndex] as FormGroup;
      let answer = question.controls.answer as FormGroup;
      let options =  answer.controls.options as FormArray;

      options.removeAt(optionIndex);
    }
  }
}
