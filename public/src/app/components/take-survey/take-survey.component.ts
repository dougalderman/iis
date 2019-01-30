import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import * as _ from 'lodash';

import { SurveyDataModel } from '../../../../../models/surveys/data/survey-data.model';
import { SurveyConfigModel } from '../../../../../models/surveys/survey.model';
import { TakeSurveyFormModel } from '../../../../../models/forms/surveys/take-survey-form.model';
import { SurveyQuestionDataModel } from '../../../../../models/surveys/data/survey-question-data.model';
import { SurveyQuestionModel } from '../../../../../models/surveys/survey-question.model';
import { SurveyAnswerModel } from '../../../../../models/surveys/survey-answer.model';
import { SurveyResultModel } from '../../../../../models/surveys/survey-result.model';

import { TakeSurveyService } from '../../services/take-survey.service';
import { SurveyAdminService } from '../../services/survey-admin.service';

@Component({
  selector: 'app-take-survey',
  templateUrl: './take-survey.component.html',
  styleUrls: ['./take-survey.component.scss']
})
export class TakeSurveyComponent implements OnInit {

  survey: SurveyDataModel
  surveyId: number = 0;
  title: string;
  displaySurveyResults: boolean = false;
  questions: SurveyQuestionModel[] = [];
  questionsAnsweredCount: number = 0;
  questionsCount: number = 0;
  surveyAnswers: SurveyAnswerModel[] = [];
  surveyDurationInSeconds: number = 0;

  takeSurveyFormModel = new TakeSurveyFormModel(this.fb);
  takeSurveyForm: FormGroup = this.takeSurveyFormModel.takeSurveyForm;

  dateSurveyStart: Date;
  dateQuestionStart: Date;

  generalError = false;

  constructor(
    private takeSurveyService: TakeSurveyService,
    private surveyAdminService: SurveyAdminService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.surveyId = this.takeSurveyService.getSurveyId();
    if (this.surveyId) {
      this.takeSurveyService.resetSurveyId();
      this.surveyAdminService.getSurvey(this.surveyId)
        .subscribe(
          (survey: SurveyDataModel[]) => {
            if (survey && survey.length) {
              this.survey = survey[0];
              this.title = this.survey.title;
              this.surveyAdminService.getQuestionsForSurvey(this.surveyId)
                .subscribe(
                  (questions: SurveyQuestionDataModel[]) => {
                    if (questions && questions.length) {
                      this.resetFormQuestions();
                      this.questionsCount = questions.length;
                      this.takeSurveyService.randomizeArray(questions);
                      for (let i = 0; i < questions.length; i++) {
                        let question = new SurveyQuestionModel(questions[i]);
                        this.takeSurveyFormModel.addQuestion(question);
                        this.questions.push(question);
                      }
                      this.dateSurveyStart = new Date();
                      this.dateQuestionStart = new Date();
                    }
                  },
                  error => {
                    console.error(error);
                    this.generalError = true;
                  }
                );
            }
          },
          error => {
            console.error(error);
            this.generalError = true;
          }
        );
    }
    else {
      // No survey to display. Redirect to home page
      this.router.navigateByUrl('/');
    }
  }

  get formQuestions(): FormArray {
    return this.takeSurveyForm.get('formQuestions') as FormArray;
  }

  submitAnswer(): void {
    const formQuestion: FormGroup = this.formQuestions.controls[this.questionsAnsweredCount] as FormGroup;
    const answer: FormGroup = formQuestion.controls.answer as FormGroup;
    const question: SurveyQuestionModel = this.questions[this.questionsAnsweredCount];
    const dateQuestionEnd: Date = new Date();

    let surveyAnswer = new SurveyAnswerModel();
    surveyAnswer.surveyId = this.surveyId;
    surveyAnswer.questionId = question.id;

    switch (question.questionType) {
      case 'textQuestionMultipleChoice':
        const userSelectedOptionIndex = _.findIndex(answer.controls.options.value, ['optionSelect', true])
        const options: FormArray = answer.controls.options as FormArray;
        const option: FormGroup = options.controls[userSelectedOptionIndex] as FormGroup;
        surveyAnswer.textAnswer = option.controls.option.value;
        break;

      case 'textQuestionShortAnswer':
        surveyAnswer.textAnswer = answer.controls.textAnswer.value.trim();
        break;

      case 'textQuestionBoolean':
        surveyAnswer.booleanAnswer = answer.controls.booleanAnswer.value
        break;

      case 'textQuestionNumericAnswer':
        surveyAnswer.integerAnswer = answer.controls.numericAnswer.value;
        break;
    }

    surveyAnswer.timeToAnswer = (dateQuestionEnd.getTime() - this.dateQuestionStart.getTime()).toString() + ' milliseconds';
    this.surveyAnswers.push(surveyAnswer);

    this.dateQuestionStart = new Date();

    this.questionsAnsweredCount++;
    if (this.questionsAnsweredCount === this.questionsCount) {
      this.endOfSurveyProcessing();
    }
  }

  resetFormQuestions(): void {
    const len = this.formQuestions.controls.length;
    for (let i = len - 1; i >= 0; i--) {
      this.takeSurveyFormModel.deleteQuestion(i);
    }
    this.formQuestions.reset();
  }

  back(): void {
    this.location.back();
  }

  endOfSurveyProcessing(): void {
    let surveyResult = new SurveyResultModel();
    surveyResult.surveyId = this.surveyId;
    surveyResult.questionsAnswered = this.questionsAnsweredCount;
    surveyResult.datetimeSurveyCompleted = 'now';
    const surveyDurationInMilliseconds = (new Date).getTime() - this.dateSurveyStart.getTime()
    surveyResult.surveyDuration =  surveyDurationInMilliseconds.toString() + ' milliseconds';
    this.surveyDurationInSeconds = Math.round(surveyDurationInMilliseconds / 1000);
    this.takeSurveyService.saveNewSurveyResult(surveyResult)
      .subscribe(
        (results: any) => {
          if (results && results.length) {
            const resultsId = results[0].id;
            if (resultsId) {
              for (let answer of this.surveyAnswers) {
                answer.resultId = resultsId;
                this.takeSurveyService.saveNewSurveyAnswer(answer)
                  .subscribe(
                    (res: any) => {
                    },
                    error => {
                      console.error(error);
                      this.generalError = true;
                    }
                  );
              }
            }
          }
        },
        error => {
          console.error(error);
          this.generalError = true;
        }
      );
  }
}
