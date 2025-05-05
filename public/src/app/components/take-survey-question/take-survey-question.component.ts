import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { fillIdArray } from '../../utilities/fill-id-array.utility';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-take-survey-question',
  templateUrl: './take-survey-question.component.html',
  styleUrls: ['./take-survey-question.component.scss']
})
export class TakeSurveyQuestionComponent implements OnInit {

  @Input() takeSurveyForm: FormGroup;
  @Input() questionIndex: number;

  @Output() submitAns = new EventEmitter();

  alphaIdArray: string[] = [];
  questions: FormArray;
  dislikeEmoticon: string = '';
  smileyEmoticon: string = '';

  constructor() {}

  ngOnInit() {
    this.dislikeEmoticon =  require("../../../assets/images/dislike_emoticon.jpg");
    this.smileyEmoticon =  require("../../../assets/images/smiley_emoticon.jpg");

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
    this.submitAns.emit();
  }
}
