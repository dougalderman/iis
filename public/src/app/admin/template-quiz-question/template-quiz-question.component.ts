import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'

import { QuizTemplateForm } from '../../../../../models/quizzes/forms/quizTemplateForm';
import { QUIZ_QUESTION_TYPES } from '../../constants/quiz-question-types.constant';
import { fillIdArray } from '../../utilities/fill-id-array.utility';

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
  questionTypes: any[] = QUIZ_QUESTION_TYPES;
  quizTemplateForm = new QuizTemplateForm(this.fb);

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.alphaIdArray = fillIdArray(this.alphaIdArray);
  }

  deleteQuestion() {
    this.deletedQuestion.emit(this.index);
  }

  addOption() {
    this.quizTemplateForm.addOption();
  }

  deleteOption(indx: number) {
    this.quizTemplateForm.deleteOption(indx);
  }

  addCorrectAnswer() {
    this.quizTemplateForm.addCorrectAnswer();
  }

  deleteCorrectAnswer(indx: number) {
    this.quizTemplateForm.deleteCorrectAnswer(indx);
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
