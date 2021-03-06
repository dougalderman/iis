import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms'

import { SurveyQuestionModel } from  '../../surveys/survey-question.model';
import { numericRangeValidator } from '../../../public/src/app/validators/numeric-range.validator';
import { checkForDuplicatesValidator } from '../../../public/src/app/validators/check-for-duplicates.validator';
import { requiredTrimWhitespaceValidator } from '../../../public/src/app/validators/required-trim-whitespace.validator';
import { CheckSurveyTemplateNameValidator } from '../../../public/src/app/validators/check-survey-template-name.validator';
import { getDefaultQuestionType } from '../../../public/src/app/utilities/get-default-question-type.utility';

export class CreateModifySurveyTemplateFormModel {
  constructor(
    private fb: FormBuilder,
    private checkSurveyTemplateName: CheckSurveyTemplateNameValidator
  ) {}

  private defaultQuestionType = getDefaultQuestionType('survey');

  selectTemplateForm: FormGroup = this.fb.group({
    templateSelect: new FormControl('')
  });

  question: FormGroup = this.fb.group({
    text: ['', requiredTrimWhitespaceValidator()],
    typeSelect: new FormControl(this.defaultQuestionType),
    answer: this.getAnswer(this.defaultQuestionType)
  });

  questions: FormArray = this.fb.array([
    this.question
  ]);

  createModifySurveyTemplateForm: FormGroup = this.fb.group({
    name: ['', {
      validators: requiredTrimWhitespaceValidator(),
      asyncValidators: this.checkSurveyTemplateName.validate.bind(this.checkSurveyTemplateName),
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
      this.formQuestions.push(this.fb.group({
        text: ['', requiredTrimWhitespaceValidator()],
        typeSelect: new FormControl(this.defaultQuestionType),
        answer: this.getAnswer(this.defaultQuestionType)
      }));
    }
  }

  deleteQuestion(index: number) {
    if (typeof index === 'number') {
      this.formQuestions.removeAt(index);
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
    let answer: FormGroup;

    switch (questionType) {
      case 'textQuestionMultipleChoice':

        answer = this.fb.group({
          options: this.fb.array([],
            {
              validators: checkForDuplicatesValidator('option')
            }
          ),
          numericRange: this.fb.group({
            numericLowRange: [{value: '', disabled: true}],
            numericHighRange: [{value: '', disabled: true}]
          })
        });

        if (question) {
          let options = answer.controls.options as FormArray;
          if (question.options && question.options.length) {
            for (let i = 0; i < question.options.length; i++) {
              options.push(this.fb.group({
                option: [question.options[i], requiredTrimWhitespaceValidator()]
              }));
            }
          }
        }
        break;

      case 'textQuestionBoolean':
      case 'textQuestionShortAnswer':
        answer = this.fb.group({
          options: this.fb.array([]),
          numericRange: this.fb.group({
            numericLowRange: [{value: '', disabled: true}],
            numericHighRange: [{value: '', disabled: true}]
          })
        });
        break;

      case 'textQuestionNumericAnswer':
        answer = this.fb.group({
          options: this.fb.array([]),
          numericRange: this.fb.group({
            numericLowRange: ['', [Validators.required, Validators.min(1)]],
            numericHighRange: ['', [Validators.required, Validators.min(2)]]
          }, {
            validators: numericRangeValidator
          })
        });

        if (question) {
          let numericRange = answer.controls.numericRange as FormGroup;

          if (question.integerStartAnswerRange) {
            numericRange.controls.numericLowRange.setValue(question.integerStartAnswerRange);
          }
          if (question.integerEndAnswerRange) {
            numericRange.controls.numericHighRange.setValue(question.integerEndAnswerRange);
          }
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
        option: ['', requiredTrimWhitespaceValidator()]
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
