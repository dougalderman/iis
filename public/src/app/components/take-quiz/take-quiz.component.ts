import { Component, OnInit } from '@angular/core';

import { QuizDataModel } from '../../../../../models/quizzes/data/quiz-data.model';
import { QuizQuestionDataModel } from '../../../../../models/quizzes/data/quiz-question-data.model';
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
  questionType: string = '';
  displayQuizResults: boolean = false;

  generalError = false;

  constructor(
    private takeQuizService: TakeQuizService,
    private quizAdminService: QuizAdminService
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
                      for (let i = 0; i < questions.length; i++) {
                        let question = new QuizQuestionModel(questions[i]);
                        this.quizTemplateForm.addQuestion(question);
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
        },
        error => {
          console.error(error);
          this.generalError = true;
        }
      );

  }
}
