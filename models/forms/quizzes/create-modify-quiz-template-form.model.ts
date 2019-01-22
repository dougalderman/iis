import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms'
import * as _ from 'lodash';

import { QuizQuestionModel } from  '../../quizzes/quiz-question.model';
import { checkForDuplicatesValidator } from '../../../public/src/app/validators/check-for-duplicates.validator';
import { optionsCorrectAnswerRequiredValidator } from '../../../public/src/app/validators/options-correct-answer-required.validator';
import { requiredTrimWhitespaceValidator } from '../../../public/src/app/validators/required-trim-whitespace.validator';
import { CheckQuizTemplateNameValidator } from '../../../public/src/app/validators/check-quiz-template-name.validator';
import { getDefaultQuestionType } from '../../../public/src/app/utilities/get-default-question-type.utility';

export class CreateModifyQuizTemplateFormModel {
  constructor(
    private fb: FormBuilder,
    private checkQuizTemplateName: CheckQuizTemplateNameValidator
  ) {}

  selectTemplateForm: FormGroup = this.fb.group({
    templateSelect: new FormControl('')
  })

  answer: FormGroup = this.fb.group({
    options: this.fb.array([],
      {
        validators: optionsCorrectAnswerRequiredValidator
      }
    ),
    booleanCorrectAnswer: [false],
    correctAnswerArray: this.fb.array([]),
  })

  question: FormGroup = this.fb.group({
    text: ['', requiredTrimWhitespaceValidator()],
    typeSelect: new FormControl(getDefaultQuestionType('quiz')),
    answer: _.cloneDeep(this.answer)
  })

  questions: FormArray = this.fb.array([
    this.question
  ])

  createModifyQuizTemplateForm: FormGroup = this.fb.group({
    name: ['', {
      validators: requiredTrimWhitespaceValidator(),
      asyncValidators: this.checkQuizTemplateName.validate.bind(this.checkQuizTemplateName),
      updateOn: 'blur'
    }],
    description: [''],
    formQuestions: this.questions
  });

  get formQuestions(): FormArray {
    return this.createModifyQuizTemplateForm.get('formQuestions') as FormArray;
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
      const defaultQuestionType = getDefaultQuestionType('quiz');
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

  getAnswer(questionType: string, question?: QuizQuestionModel): FormGroup {
    let answer: FormGroup = _.cloneDeep(this.answer);

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

  addOption(questionIndex: number): void {
    if (typeof questionIndex === 'number') {
      let question = this.formQuestions.controls[questionIndex] as FormGroup;
      let answer = question.controls.answer as FormGroup;
      let options =  answer.controls.options as FormArray;

      options.push(this.fb.group({
        optionCorrectAnswer: [false],
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

  addCorrectAnswer(questionIndex: number): void {
    if (typeof questionIndex === 'number') {
      let question = this.formQuestions.controls[questionIndex] as FormGroup;
      let answer = question.controls.answer as FormGroup;
      let correctAnswerArray = answer.controls.correctAnswerArray as FormArray;

      correctAnswerArray.push(this.fb.group({
        correctAnswer: ['', [requiredTrimWhitespaceValidator(), checkForDuplicatesValidator('correctAnswer', correctAnswerArray.length)]],
      }));
    }
  }

  deleteCorrectAnswer(questionIndex: number, correctAnswerIndex: number): void {
    if (typeof questionIndex === 'number' && typeof correctAnswerIndex === 'number') {
      let question = this.formQuestions.controls[questionIndex] as FormGroup;
      let answer = question.controls.answer as FormGroup;
      let correctAnswerArray =  answer.controls.correctAnswerArray as FormArray;

      correctAnswerArray.removeAt(correctAnswerIndex);
    }
  }
}
