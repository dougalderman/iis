import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TemplateSurveyQuestionComponent } from '../template-survey-question/template-survey-question.component'
import { fillIdArray } from '../../utilities/fill-id-array.utility';


@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-template-survey-question-disabled',
  templateUrl: './template-survey-question-disabled.component.html',
  styleUrls: ['./template-survey-question-disabled.component.scss']
})
export class TemplateSurveyQuestionDisabledComponent
  extends TemplateSurveyQuestionComponent implements OnInit {

    previewSurveyTemplateForm: FormGroup;

    constructor() {
      super()
    }

    ngOnInit() {
      this.alphaIdArray = fillIdArray(this.alphaIdArray);
      if (this.surveyTemplateForm) {
        this.previewSurveyTemplateForm = this.surveyTemplateForm.previewSurveyTemplateForm;
        this.questions = this.previewSurveyTemplateForm.get('formQuestions') as FormArray;
      }
    }
}
