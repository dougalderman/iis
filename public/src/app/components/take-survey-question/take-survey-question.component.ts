import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { fillIdArray } from '../../utilities/fill-id-array.utility';

@Component({
  selector: 'app-take-survey-question',
  templateUrl: './take-survey-question.component.html',
  styleUrls: ['./take-survey-question.component.scss']
})
export class TakeSurveyQuestionComponent implements OnInit {

  @Input() takeSurveyForm: FormGroup;
  @Input() questionIndex: number;

  @Output() submit = new EventEmitter();

  alphaIdArray: string[] = [];
  questions: FormArray

  constructor() {}

  ngOnInit() {
    this.alphaIdArray = fillIdArray(this.alphaIdArray);
    if (this.takeSurveyForm) {
      this.questions = this.takeSurveyForm.get('formQuestions') as FormArray;
    }
  }

  get question(): FormGroup {
    return this.questions.controls[this.questionIndex] as FormGroup;
  }

  get sliderOptions(): any {
    let answer = this.question.controls.answer as FormGroup;
    let numericRange = answer.controls.numericRange as FormGroup;
    let numericLowRange = numericRange.controls.numericLowRange;
    let numericHighRange = numericRange.controls.numericHighRange;

    return {
      floor: numericLowRange.value,
      ceil: numericHighRange.value
    };
  }

  submitAnswer(): void {
    this.submit.emit();
  }
}
