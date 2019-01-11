import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms'

import { QuizDataModel } from '../../../../../models/quizzes/data/quiz-data.model';
import { TakeQuizFormModel } from '../../../../../models/forms/take-quiz-form.model';
import { QuizQuestionDataModel } from '../../../../../models/quizzes/data/quiz-question-data.model';
import { QuizQuestionModel } from '../../../../../models/quizzes/quiz-question.model';
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
  questionsAnsweredCount: number = 0;
  questionsCount: number = 0;

  takeQuizFormModel = new TakeQuizFormModel(this.fb);
  takeQuizForm = this.takeQuizFormModel.takeQuizForm;

  generalError = false;

  constructor(
    private takeQuizService: TakeQuizService,
    private quizAdminService: QuizAdminService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.quizId = this.takeQuizService.getQuizId();
    if (this.quizId) {
      this.takeQuizService.resetQuizId();
    }

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
                    this.questionsCount = questions.length;
                    for (let i = 0; i < questions.length; i++) {
                      let question = new QuizQuestionModel(questions[i]);
                      this.takeQuizFormModel.addQuestion(question);
                    }
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

  get formQuestions(): FormArray {
    return this.takeQuizForm.get('formQuestions') as FormArray;
  }

  submit(): void {
    // TODO compare submitted answer to correct answer. Give feedback.
  }

  getNextQuestion(): void {
    this.questionsAnsweredCount++;
  }

}
