import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, AbstractControl } from '@angular/forms'
import * as _ from 'lodash';

import { checkForDuplicatesValidator } from '../../validators/check-for-duplicates.validator';
import { requiredTrimWhitespaceValidator } from '../../validators/required-trim-whitespace.validator';
import { optionsCorrectAnswerRequiredValidator } from '../../validators/options-correct-answer-required.validator';

const QUESTION_TYPES = [
  {name: 'textQuestionMultipleChoice', description: 'Text Question Multiple Choice', default: true},
  {name: 'textQuestionShortAnswer', description: 'Text Question Short Answer'},
  {name: 'textQuestionBoolean', description: 'Text Question Boolean'},
]

@Component({
  selector: 'app-template-quiz-question',
  templateUrl: './template-quiz-question.component.html',
  styleUrls: ['./template-quiz-question.component.scss']
})
export class TemplateQuizQuestionComponent implements OnInit {

  @Input() question: FormGroup;
  @Input() index: number;
  @Output() deletedQuestion = new EventEmitter<number>();

  alphaIdArray = [];
  questionTypes: any[] = QUESTION_TYPES;

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
    typeSelect: new FormControl(this.getDefaultQuestionType()),
    answer: _.cloneDeep(this.formAnswer)
  })

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.alphaIdArray = this.fillIdArray(this.alphaIdArray);
  }

  deleteQuestion() {
    this.deletedQuestion.emit(this.index);
  }

  addOption(): void {
    let answer = this.question.controls.answer as FormGroup;
    let options =  answer.controls.options as FormArray;

    options.push(this.fb.group({
      optionCorrectAnswer: [false],
      option: ['', [requiredTrimWhitespaceValidator(), checkForDuplicatesValidator('option', options.length)]]
    }));
  }

  deleteOption(optionIndex: number): void {
    if (typeof optionIndex === 'number') {
      let answer = this.question.controls.answer as FormGroup;
      let options =  answer.controls.options as FormArray;
      options.removeAt(optionIndex);
    }
  }

  addCorrectAnswer(): void {
    let answer = this.question.controls.answer as FormGroup;
    let correctAnswerArray = answer.controls.correctAnswerArray as FormArray;

    correctAnswerArray.push(this.fb.group({
      correctAnswer: ['', [requiredTrimWhitespaceValidator(), checkForDuplicatesValidator('correctAnswer', correctAnswerArray.length)]],
    }));
  }

  deleteCorrectAnswer(correctAnswerIndex: number): void {
    if (typeof correctAnswerIndex === 'number') {
      let answer = this.question.controls.answer as FormGroup;
      let correctAnswerArray =  answer.controls.correctAnswerArray as FormArray;

      correctAnswerArray.removeAt(correctAnswerIndex);
    }
  }

  getDefaultQuestionType(): string {
    const defaultQuestionType = this.questionTypes.find(
      (type: any) => {
        return type.default === true;
      }
    );
    return defaultQuestionType.name;
  }

  fillIdArray(id: string[]): string[] {
    let c = 'a';

    for (let i = 0; i < 26; i++) {
      id.push(c);
      c = this.nextChar(c)
    }
    return id;
  }

  nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
  }


}
