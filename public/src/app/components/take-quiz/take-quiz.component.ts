import { Component, OnInit } from '@angular/core';
import  { Router } from '@angular/router';
import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms'
import * as _ from 'lodash';

import { QuizDataModel } from '../../../../../models/quizzes/data/quiz-data.model';
import { TakeQuizFormModel } from '../../../../../models/forms/take-quiz-form.model';
import { QuizQuestionDataModel } from '../../../../../models/quizzes/data/quiz-question-data.model';
import { QuizQuestionModel } from '../../../../../models/quizzes/quiz-question.model';
import { QuizAnswerModel } from '../../../../../models/quizzes/quiz-answer.model';
import { QuizResultModel } from '../../../../../models/quizzes/quiz-result.model';
import { QuizResultDataModel } from '../../../../../models/quizzes/data/quiz-result-data.model';

import { TakeQuizService } from '../../services/take-quiz.service';
import { QuizAdminService } from '../../services/quiz-admin.service';

@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.scss']
})
export class TakeQuizComponent implements OnInit {

  quiz: QuizDataModel
  quizId: number = 0;
  title: string;
  displayQuizResults: boolean = false;
  questions: QuizQuestionModel[] = [];
  questionsAnsweredCount: number = 0;
  questionsCorrectlyAnsweredCount: number = 0;
  questionsCount: number = 0;
  quizAnswers: QuizAnswerModel[] = [];

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
    private router: Router
  ) { }

  ngOnInit() {
    this.quizId = this.takeQuizService.getQuizId();
    if (this.quizId) {
      this.takeQuizService.resetQuizId();
      this.quizAdminService.getQuiz(this.quizId)
        .subscribe(
          (quiz: QuizDataModel[]) => {
            if (quiz && quiz.length) {
              this.quiz = quiz[0];
              this.title = this.quiz.title;
              this.quizAdminService.getQuestionsForQuiz(this.quizId)
                .subscribe(
                  (questions: QuizQuestionDataModel[]) => {
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
        const userSelectedOptionIndex = _.findIndex(answer.controls.options.value, ['optionSelect', true])

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

        for (let correctAnswer of question.correctAnswerArray) {
          lowerCaseArray.push(correctAnswer.toLowerCase());
        }

        if (_.find(lowerCaseArray, val => val === answer.controls.textAnswer.value.toLowerCase())) {
          this.answeredCorrectly = true;
          this.questionsCorrectlyAnsweredCount++;
        }
        else {
          this.correctAnswerArray = question.correctAnswerArray;
        }

        quizAnswer.textAnswer = answer.controls.textAnswer.value;
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

  endOfQuizProcessing(): void {
    let quizResult = new QuizResultModel();
    quizResult.quizId = this.quizId;
    quizResult.questionsAnswered = this.questionsAnsweredCount;
    quizResult.questionsAnsweredCorrectly = this.questionsCorrectlyAnsweredCount;
    if (quizResult.questionsAnswered) {
      quizResult.percentAnsweredCorrectly = quizResult.questionsAnsweredCorrectly / quizResult.questionsAnswered;
    }
    else {
      quizResult.percentAnsweredCorrectly = 0;
    }
    quizResult.datetimeQuizCompleted = 'now';
    quizResult.quizDuration =  ((new Date).getTime() - this.dateQuizStart.getTime()).toString() + ' milliseconds';
    this.takeQuizService.saveNewQuizResult(quizResult)
      .subscribe(
        (result: any) => {
          if (result) {
            this.takeQuizService.getQuizResultByQuizId(this.quizId)
              .subscribe(
                (quizResult: QuizResultDataModel) => {
                  if (quizResult) {
                    for (let answer of this.quizAnswers) {
                      answer.resultId = quizResult.id;
                    }

                  }
                }
              )

  }
}
