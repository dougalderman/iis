import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import  { Router } from '@angular/router';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { Location } from '@angular/common';
import * as _ from 'lodash';

import { QuizDataModel } from '../../../../../models/quizzes/data/quiz-data.model';
import { QuizConfigModel } from '../../../../../models/quizzes/quiz.model';
import { TakeQuizFormModel } from '../../../../../models/forms/quizzes/take-quiz-form.model';
import { QuizQuestionDataModel } from '../../../../../models/quizzes/data/quiz-question-data.model';
import { QuizQuestionModel } from '../../../../../models/quizzes/quiz-question.model';
import { QuizAnswerModel } from '../../../../../models/quizzes/quiz-answer.model';
import { QuizResultModel } from '../../../../../models/quizzes/quiz-result.model';

import { TakeQuizService } from '../../services/take-quiz.service';
import { QuizAdminService } from '../../services/quiz-admin.service';

import { TakeQuizQuestionComponent } from '../take-quiz-question/take-quiz-question.component';

@Component({
  imports: [CommonModule, TakeQuizQuestionComponent],
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.scss'],
  animations: [
    trigger('greatJobTrigger', [
      transition(':enter', [
        style({
          'background-image': 'url("https://media.giphy.com/media/iabcSfUB6VZYc/giphy.gif")',
          'background-size': 'cover'
        }),
        animate('7s ease-in',  style({transform: 'perspective(400px) rotateX(90deg)'}))
      ]),
    ]),
    trigger('okJobTrigger', [
      transition(':enter', [
        style({
          'background-image': 'url("https://media.giphy.com/media/aLdiZJmmx4OVW/giphy.gif")',
          'background-size': 'cover'
        }),
        animate('7s ease-in',  style({transform: 'perspective(400px) rotateX(90deg)'}))
      ])
    ])
  ]
})
export class TakeQuizComponent implements OnInit {

  quiz: QuizDataModel
  quizId: number = 0;
  title: string;
  displayQuizResults: boolean = false;
  questions: QuizQuestionModel[] = [];
  questionsAnsweredCount: number = 0;
  questionsCorrectlyAnsweredCount: number = 0;
  percentCorrectlyAnswered: number = 0;
  questionsCount: number = 0;
  quizAnswers: QuizAnswerModel[] = [];
  configPercentGreatJob: number = 0;
  quizDurationInSeconds: number = 0;

  takeQuizFormModel = new TakeQuizFormModel(this.fb);
  takeQuizForm: FormGroup = this.takeQuizFormModel.takeQuizForm;

  dateQuizStart: Date;
  dateQuestionStart: Date;

  answerFeedbackGiven: boolean = false;
  answeredCorrectly: boolean = false;
  correctAnswer: string = '';
  correctAnswerArray: string[] = [];

  generalError = false;

  constructor(
    private takeQuizService: TakeQuizService,
    private quizAdminService: QuizAdminService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.quizId = this.takeQuizService.getQuizId();
    if (this.quizId) {
      this.takeQuizService.resetQuizId();
      this.quizAdminService.getQuiz(this.quizId).subscribe({
        next: (quiz: QuizDataModel[]) => {
          if (quiz && quiz.length) {
            this.quiz = quiz[0];
            this.title = this.quiz.title;
            const config: QuizConfigModel = this.quiz.config;
            this.configPercentGreatJob = config.percentGreatJob;
            this.quizAdminService.getQuestionsForQuiz(this.quizId).subscribe({
              next: (questions: QuizQuestionDataModel[]) => {
                if (questions && questions.length) {
                  this.resetFormQuestions();
                  this.questionsCount = questions.length;
                  this.takeQuizService.randomizeArray(questions);
                  for (let i = 0; i < questions.length; i++) {
                    let question = new QuizQuestionModel(questions[i]);
                    if (question.questionType === 'textQuestionMultipleChoice') {
                      question.options = this.takeQuizService.randomizeArray(question.options);
                    }
                    this.takeQuizFormModel.addQuestion(question);
                    this.questions.push(question);
                  }
                  this.dateQuizStart = new Date();
                  this.dateQuestionStart = new Date();
                }
              },
              error: (e) => {
                console.error(e);
                this.generalError = true;
              }
            });
          }
        },
        error: (e) => {
          console.error(e);
          this.generalError = true;
        }
      });
    }
    else {
      // No quiz to display. Redirect to home page
      this.router.navigateByUrl('/');
    }
  }

  get formQuestions(): FormArray {
    return this.takeQuizForm.get('formQuestions') as FormArray;
  }

  submitAnswer(): void {
    this.resetAnswerVariables();
    const formQuestion: FormGroup = this.formQuestions.controls[this.questionsAnsweredCount] as FormGroup;
    const answer: FormGroup = formQuestion.controls.answer as FormGroup;
    const question: QuizQuestionModel = this.questions[this.questionsAnsweredCount];
    const dateQuestionEnd: Date = new Date();

    let quizAnswer = new QuizAnswerModel();
    quizAnswer.quizId = this.quizId;
    quizAnswer.questionId = question.id;

    switch (question.questionType) {
      case 'textQuestionMultipleChoice':
        const correctOptionIndex = _.findIndex(question.options, ['optionCorrectAnswer', true]);
        const userSelectedOptionIndex = answer.controls.selectedOption.value;

        if (correctOptionIndex === userSelectedOptionIndex) {
          this.answeredCorrectly = true;
          this.questionsCorrectlyAnsweredCount++;
        }
        else {
          this.correctAnswer = question.options[correctOptionIndex].option;
        }

        const options: FormArray = answer.controls.options as FormArray;
        const option: FormGroup = options.controls[userSelectedOptionIndex] as FormGroup;
        quizAnswer.textAnswer = option.controls.option.value;
        break;

      case 'textQuestionShortAnswer':
        let lowerCaseArray: string[] = [];
        const textAnswer = answer.controls.textAnswer.value.trim();

        for (let correctAnswer of question.correctAnswerArray) {
          lowerCaseArray.push(correctAnswer.toLowerCase());
        }

        if (_.find(lowerCaseArray, val => val === textAnswer.toLowerCase())) {
          this.answeredCorrectly = true;
          this.questionsCorrectlyAnsweredCount++;
        }
        else {
          this.correctAnswerArray = question.correctAnswerArray;
        }

        quizAnswer.textAnswer = textAnswer;
        break;

      case 'textQuestionBoolean':
        if (question.booleanCorrectAnswer === answer.controls.booleanAnswer.value) {
          this.answeredCorrectly = true;
          this.questionsCorrectlyAnsweredCount++;
        }

        quizAnswer.booleanAnswer = answer.controls.booleanAnswer.value
        break;
    }

    quizAnswer.answeredCorrectly = this.answeredCorrectly;
    quizAnswer.timeToAnswer = (dateQuestionEnd.getTime() - this.dateQuestionStart.getTime()).toString() + ' milliseconds';
    this.quizAnswers.push(quizAnswer);

    this.answerFeedbackGiven = true;
    this.dateQuestionStart = new Date();
  }

  getNextQuestion(): void {
    this.resetAnswerVariables();
    this.questionsAnsweredCount++;
    if (this.questionsAnsweredCount === this.questionsCount) {
      this.endOfQuizProcessing();
    }
  }

  resetFormQuestions(): void {
    const len = this.formQuestions.controls.length;
    for (let i = len - 1; i >= 0; i--) {
      this.takeQuizFormModel.deleteQuestion(i);
    }
    this.formQuestions.reset();
  }

  resetAnswerVariables(): void {
    this.answerFeedbackGiven = false;
    this.answeredCorrectly = false;
    this.correctAnswer = '';
    this.correctAnswerArray = [];
  }

  back(): void {
    this.location.back();
  }

  endOfQuizProcessing(): void {
    let quizResult = new QuizResultModel();
    quizResult.quizId = this.quizId;
    quizResult.questionsAnswered = this.questionsAnsweredCount;
    quizResult.questionsAnsweredCorrectly = this.questionsCorrectlyAnsweredCount;
    if (quizResult.questionsAnswered) {
      this.percentCorrectlyAnswered = (quizResult.questionsAnsweredCorrectly / quizResult.questionsAnswered) * 100;
    }
    quizResult.datetimeQuizCompleted = 'now';
    const quizDurationInMilliseconds = (new Date).getTime() - this.dateQuizStart.getTime()
    quizResult.quizDuration =  quizDurationInMilliseconds.toString() + ' milliseconds';
    this.quizDurationInSeconds = Math.round(quizDurationInMilliseconds / 1000);
    this.takeQuizService.saveNewQuizResult(quizResult).subscribe({
      next: (results: any) => {
        if (results && results.length) {
          const resultsId = results[0].id;
          if (resultsId) {
            for (let answer of this.quizAnswers) {
              answer.resultId = resultsId;
              this.takeQuizService.saveNewQuizAnswer(answer).subscribe({
                next: (res: any) => {},
                error: (e) => {
                  console.error(e);
                  this.generalError = true;
                }
              });
            }
          }
        }
      },
      error: (e) => {
        console.error(e);
        this.generalError = true;
      }
    });
  }
}
