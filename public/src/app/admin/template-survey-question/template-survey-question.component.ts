import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SURVEY_QUESTION_TYPES } from '../../constants/survey-question-types.constant';
import { fillIdArray } from '../../utilities/fill-id-array.utility';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-template-survey-question',
  templateUrl: './template-survey-question.component.html',
  styleUrls: ['./template-survey-question.component.scss']
})
export class TemplateSurveyQuestionComponent implements OnInit {

  @Input() surveyTemplateForm: any;
  @Input() questionIndex: number;
  @Output() deletedQuestion = new EventEmitter<number>();

  alphaIdArray: string[] = [];
  questionTypes: any[] = SURVEY_QUESTION_TYPES;
  createModifySurveyTemplateForm: FormGroup
  questions: FormArray

  constructor() {}

  ngOnInit() {
    this.alphaIdArray = fillIdArray(this.alphaIdArray);
    if (this.surveyTemplateForm) {
      this.createModifySurveyTemplateForm = this.surveyTemplateForm.createModifySurveyTemplateForm;
      this.questions = this.createModifySurveyTemplateForm.get('formQuestions') as FormArray;
    }
  }

  get question(): FormGroup {
    return this.questions.controls[this.questionIndex] as FormGroup;
  }

  deleteQuestion() {
    this.deletedQuestion.emit(this.questionIndex);
  }

  addOption() {
    this.surveyTemplateForm.addOption(this.questionIndex);
  }

  deleteOption(indx: number) {
    this.surveyTemplateForm.deleteOption(this.questionIndex, indx);
  }
}
