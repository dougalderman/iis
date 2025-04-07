import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { fillIdArray } from '../../utilities/fill-id-array.utility';

@Component({
  standalone: false,
  selector: 'app-take-quiz-question',
  templateUrl: './take-quiz-question.component.html',
  styleUrls: ['./take-quiz-question.component.scss']
})
export class TakeQuizQuestionComponent implements OnInit {

  @Input() takeQuizForm: FormGroup;
  @Input() questionIndex: number;
  @Input() answerFeedbackGiven: boolean;
  @Input() answeredCorrectly: boolean;
  @Input() correctAnswer: string;
  @Input() correctAnswerArray: string[];

  @Output() submit = new EventEmitter();
  @Output() nextQuestion = new EventEmitter();

  alphaIdArray: string[] = [];
  questions: FormArray

  constructor() {}

  ngOnInit() {
    this.alphaIdArray = fillIdArray(this.alphaIdArray);
    if (this.takeQuizForm) {
      this.questions = this.takeQuizForm.get('formQuestions') as FormArray;
    }
  }

  get question(): FormGroup {
    return this.questions.controls[this.questionIndex] as FormGroup;
  }

  getNextQuestion(): void {
    this.nextQuestion.emit();
  }

  submitAnswer(): void {
    this.submit.emit();
  }
}
