import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { QUIZ_QUESTION_TYPES } from '../../constants/quiz-question-types.constant';
import { fillIdArray } from '../../utilities/fill-id-array.utility';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-template-quiz-question',
  templateUrl: './template-quiz-question.component.html',
  styleUrls: ['./template-quiz-question.component.scss']
})
export class TemplateQuizQuestionComponent implements OnInit {

  @Input() quizTemplateForm: any;
  @Input() questionIndex: number;
  @Output() deletedQuestion = new EventEmitter<number>();

  alphaIdArray: string[] = [];
  questionTypes: any[] = QUIZ_QUESTION_TYPES;
  createModifyQuizTemplateForm: FormGroup
  questions: FormArray

  constructor() {}

  ngOnInit() {
    this.alphaIdArray = fillIdArray(this.alphaIdArray);
    if (this.quizTemplateForm) {
      this.createModifyQuizTemplateForm = this.quizTemplateForm.createModifyQuizTemplateForm;
      this.questions = this.createModifyQuizTemplateForm.get('formQuestions') as FormArray;
    }
  }

  get question(): FormGroup {
    return this.questions.controls[this.questionIndex] as FormGroup;
  }

  deleteQuestion(): void {
    this.deletedQuestion.emit(this.questionIndex);
  }

  addOption(): void {
    this.quizTemplateForm.addOption(this.questionIndex);
  }

  deleteOption(indx: number): void {
    this.quizTemplateForm.deleteOption(this.questionIndex, indx);
  }

  addCorrectAnswer(): void {
    this.quizTemplateForm.addCorrectAnswer(this.questionIndex);
  }

  deleteCorrectAnswer(indx: number): void {
    this.quizTemplateForm.deleteCorrectAnswer(this.questionIndex, indx);
  }
}
