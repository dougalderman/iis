import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms'

import { QUIZ_QUESTION_TYPES } from '../../constants/quiz-question-types.constant';
import { fillIdArray } from '../../utilities/fill-id-array.utility';

@Component({
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

  deleteQuestion() {
    this.deletedQuestion.emit(this.questionIndex);
  }

  addOption() {
    this.quizTemplateForm.addOption(this.questionIndex);
  }

  deleteOption(indx: number) {
    this.quizTemplateForm.deleteOption(this.questionIndex, indx);
  }

  addCorrectAnswer() {
    this.quizTemplateForm.addCorrectAnswer(this.questionIndex);
  }

  deleteCorrectAnswer(indx: number) {
    this.quizTemplateForm.deleteCorrectAnswer(this.questionIndex, indx);
  }
}
