import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, AbstractControl } from '@angular/forms'

import { QUIZ_QUESTION_TYPES } from '../../constants/quiz-question-types.constant';
import { fillIdArray } from '../../utilities/fill-id-array.utility';

@Component({
  selector: 'app-template-quiz-question',
  templateUrl: './template-quiz-question.component.html',
  styleUrls: ['./template-quiz-question.component.scss']
})
export class TemplateQuizQuestionComponent implements OnInit {

  @Input() quizTemplateForm: any;
  @Input() index: number;
  @Output() deletedQuestion = new EventEmitter<number>();

  alphaIdArray = [];
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
    return this.questions.controls[this.index] as FormGroup;
  }

  deleteQuestion() {
    this.deletedQuestion.emit(this.index);
  }

  addOption() {
    this.quizTemplateForm.addOption.call(this.question);
  }

  deleteOption(indx: number) {
    this.quizTemplateForm.deleteOption.call(this.question, indx);
  }

  addCorrectAnswer() {
    this.quizTemplateForm.addCorrectAnswer.call(this.question);
  }

  deleteCorrectAnswer(indx: number) {
    this.quizTemplateForm.deleteCorrectAnswer.call(this.question, indx);
  }

  getDefaultQuestionType(): string {
    const defaultQuestionType = this.questionTypes.find(
      (type: any) => {
        return type.default === true;
      }
    );

    return defaultQuestionType.name;
  }
}
