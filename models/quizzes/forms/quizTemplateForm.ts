import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms'
import * as _ from 'lodash';

import { QuizQuestion } from  '../quizQuestion';
import { checkForDuplicatesValidator } from '../../../public/src/app/validators/check-for-duplicates.validator';
import { optionsCorrectAnswerRequiredValidator } from '../../../public/src/app/validators/options-correct-answer-required.validator';
import { requiredTrimWhitespaceValidator } from '../../../public/src/app/validators/required-trim-whitespace.validator';
import { CheckTemplateNameValidator } from '../../../public/src/app/validators/check-template-name.validator';
import { getDefaultQuestionType } from '../../../public/src/app/utilities/get-default-question-type.utility';

export class QuizTemplateForm {
  constructor(
    private fb: FormBuilder,
    private checkTemplateName: CheckTemplateNameValidator
  ) {}

  selectTemplateForm: FormGroup = this.fb.group({
    templateSelect: new FormControl('')
  })

  formAnswer: FormGroup = this.fb.group({
    options: this.fb.array([],
      {
        validators: optionsCorrectAnswerRequiredValidator,
      }
    ),
    booleanCorrectAnswer: [false],
    correctAnswerArray: this.fb.array([]),
  })

  formQuestion: FormGroup = this.fb.group({
    text: ['', requiredTrimWhitespaceValidator()],
    typeSelect: new FormControl(getDefaultQuestionType()),
    answer: _.cloneDeep(this.formAnswer)
  })

  formQuestions: FormArray = this.fb.array([
    this.formQuestion
  ])

  createModifyQuizTemplateForm: FormGroup = this.fb.group({
    name: ['', {
      validators: requiredTrimWhitespaceValidator(),
      asyncValidators: this.checkTemplateName.validate.bind(this.checkTemplateName),
      updateOn: 'blur'
    }],
    description: [''],
    formQuestions: this.formQuestions
  });

  addQuestion(question?: QuizQuestion) {
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

  getAnswer(questionType: string, question?: QuizQuestion): FormGroup {
    let answer: FormGroup = _.cloneDeep(this.formAnswer);

    switch (questionType) {
      case 'textQuestionMultipleChoice':
        if (question) {
          let options = answer.controls.options as FormArray;
          if (question.options && question.options.length) {
            for (let i = 0; i < question.options.length; i++) {
              options.push(this.fb.group({
                optionCorrectAnswer: [question.options[i].optionCorrectAnswer],
                option: [question.options[i].option, [requiredTrimWhitespaceValidator(), checkForDuplicatesValidator('option', i)]]
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
                  correctAnswer: [question.correctAnswerArray[i], [requiredTrimWhitespaceValidator(), checkForDuplicatesValidator('correctAnswer', i)]]
                })
              )
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

  addOption(): void {
    let answer = this.formQuestion.controls.answer as FormGroup;
    let options =  answer.controls.options as FormArray;

    options.push(this.fb.group({
      optionCorrectAnswer: [false],
      option: ['', [requiredTrimWhitespaceValidator(), checkForDuplicatesValidator('option', options.length)]]
    }));
  }

  deleteOption(optionIndex: number): void {
    if (typeof optionIndex === 'number') {
      let answer = this.formQuestion.controls.answer as FormGroup;
      let options =  answer.controls.options as FormArray;
      options.removeAt(optionIndex);
    }
  }

  addCorrectAnswer(): void {
    let answer = this.formQuestion.controls.answer as FormGroup;
    let correctAnswerArray = answer.controls.correctAnswerArray as FormArray;

    correctAnswerArray.push(this.fb.group({
      correctAnswer: ['', [requiredTrimWhitespaceValidator(), checkForDuplicatesValidator('correctAnswer', correctAnswerArray.length)]],
    }));
  }

  deleteCorrectAnswer(correctAnswerIndex: number): void {
    if (typeof correctAnswerIndex === 'number') {
      let answer = this.formQuestion.controls.answer as FormGroup;
      let correctAnswerArray =  answer.controls.correctAnswerArray as FormArray;

      correctAnswerArray.removeAt(correctAnswerIndex);
    }
  }

}
