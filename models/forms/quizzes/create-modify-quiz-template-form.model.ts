import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';

import { QuizQuestionModel } from  '../../quizzes/quiz-question.model';
import { checkForDuplicatesValidator } from '../../../public/src/app/validators/check-for-duplicates.validator';
import { requiredTrimWhitespaceValidator } from '../../../public/src/app/validators/required-trim-whitespace.validator';
import { CheckQuizTemplateNameValidator } from '../../../public/src/app/validators/check-quiz-template-name.validator';
import { getDefaultQuestionType } from '../../../public/src/app/utilities/get-default-question-type.utility';

export class CreateModifyQuizTemplateFormModel {
  constructor(
    private fb: FormBuilder,
    private checkQuizTemplateName: CheckQuizTemplateNameValidator
  ) {}

  private defaultQuestionType = getDefaultQuestionType('quiz');

  selectTemplateForm: FormGroup = this.fb.group({
    templateSelect: new FormControl('')
  })

  question: FormGroup = this.fb.group({
    text: ['', requiredTrimWhitespaceValidator()],
    typeSelect: new FormControl(this.defaultQuestionType),
    answer: this.getAnswer(this.defaultQuestionType)
  });

  questions: FormArray = this.fb.array([
    this.question
  ]);

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

  getAnswer(questionType: string, question?: QuizQuestionModel): FormGroup {
    let answer: FormGroup;

    switch (questionType) {
      case 'textQuestionMultipleChoice':
        answer = this.fb.group({
          options: this.fb.array([],
            {
              validators: checkForDuplicatesValidator('option')
            }
          ),
          correctOption: ['', Validators.required],
          booleanCorrectAnswer: [{value: false, disabled: true}],
          correctAnswerArray: this.fb.array([])
        });

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
                option: [option.option, requiredTrimWhitespaceValidator()]
              }));
            }
          }
        }
        break;

      case 'textQuestionShortAnswer':
        answer = this.fb.group({
          options: this.fb.array([]),
          correctOption: [{value: 0, disabled: true}],
          booleanCorrectAnswer: [{value: false, disabled: true}],
          correctAnswerArray: this.fb.array([],
            {
              validators: checkForDuplicatesValidator('correctAnswer')
            }
          )
        });

        if (question) {
          let correctAnswerArray = answer.controls.correctAnswerArray as FormArray;
          if (question.correctAnswerArray && question.correctAnswerArray.length) {
            for (let i = 0; i < question.correctAnswerArray.length; i++) {
              correctAnswerArray.push(
                this.fb.group({
                  correctAnswer: [question.correctAnswerArray[i], requiredTrimWhitespaceValidator()]
                })
              );
            }
          }
        }
        break;

      case 'textQuestionBoolean':
        answer = this.fb.group({
          options: this.fb.array([]),
          correctOption: [{value: 0, disabled: true}],
          booleanCorrectAnswer: [false],
          correctAnswerArray: this.fb.array([])
        });

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
        option: ['', requiredTrimWhitespaceValidator()]
      }));
    }
  }

  deleteOption(questionIndex: number, optionIndex: number): void {
    if (typeof questionIndex === 'number' && typeof optionIndex === 'number') {
      let question = this.formQuestions.controls[questionIndex] as FormGroup;
      let answer = question.controls.answer as FormGroup;
      let options =  answer.controls.options as FormArray;
      let correctOption = answer.controls.correctOption;

      if (optionIndex <= correctOption.value) {
      // Selected radio button becomes out of sync with correctOption after deleting option,
      // so force user to re-select.
        correctOption.setValue('');
      }

      options.removeAt(optionIndex);
    }
  }

  addCorrectAnswer(questionIndex: number): void {
    if (typeof questionIndex === 'number') {
      let question = this.formQuestions.controls[questionIndex] as FormGroup;
      let answer = question.controls.answer as FormGroup;
      let correctAnswerArray = answer.controls.correctAnswerArray as FormArray;

      correctAnswerArray.push(this.fb.group({
        correctAnswer: ['', requiredTrimWhitespaceValidator()],
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
