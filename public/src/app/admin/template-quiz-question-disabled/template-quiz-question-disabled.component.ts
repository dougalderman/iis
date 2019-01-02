import { Component, OnInit } from '@angular/core';

import { TemplateQuizQuestionComponent } from '../template-quiz-question/template-quiz-question.component'

@Component({
  selector: 'app-template-quiz-question-disabled',
  templateUrl: './template-quiz-question-disabled.component.html',
  styleUrls: ['./template-quiz-question-disabled.component.scss']
})
export class TemplateQuizQuestionDisabledComponent extends TemplateQuizQuestionComponent {

  constructor() {
    super()
  }
}
