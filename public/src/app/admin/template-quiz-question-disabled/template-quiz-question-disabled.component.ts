import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TemplateQuizQuestionComponent } from '../template-quiz-question/template-quiz-question.component'
import { fillIdArray } from '../../utilities/fill-id-array.utility';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-template-quiz-question-disabled',
  templateUrl: './template-quiz-question-disabled.component.html',
  styleUrls: ['./template-quiz-question-disabled.component.scss']
})
export class TemplateQuizQuestionDisabledComponent
  extends TemplateQuizQuestionComponent implements OnInit {

  previewQuizTemplateForm: FormGroup;

  constructor() {
    super()
  }

  ngOnInit() {
    this.alphaIdArray = fillIdArray(this.alphaIdArray);
    if (this.quizTemplateForm) {
      this.previewQuizTemplateForm = this.quizTemplateForm.previewQuizTemplateForm;
      this.questions = this.previewQuizTemplateForm.get('formQuestions') as FormArray;
    }
  }
}
