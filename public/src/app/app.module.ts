import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FibroArticleComponent } from './components/fibro-article/fibro-article.component';
import { AdminModule } from './admin/admin.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ConfirmModalComponent } from './components/bootstrap-components/confirm-modal/confirm-modal.component';
import { SamplePageOneComponent } from './components/sample-page-one/sample-page-one.component';
import { SamplePageTwoComponent } from './components/sample-page-two/sample-page-two.component';
import { TakeQuizComponent } from './components/take-quiz/take-quiz.component';
import { TakeSurveyComponent } from './components/take-survey/take-survey.component';
import { QuizTextQuestionBooleanComponent } from './components/take-quiz/quiz-text-question-boolean/quiz-text-question-boolean.component';
import { QuizTextQuestionShortAnswerComponent } from './components/take-quiz/quiz-text-question-short-answer/quiz-text-question-short-answer.component';
import { QuizTextQuestionMultipleChoiceComponent } from './components/take-quiz/quiz-text-question-multiple-choice/quiz-text-question-multiple-choice.component';
import { QuizResultsComponent } from './components/take-quiz/quiz-results/quiz-results.component';

@NgModule({
  declarations: [
    AppComponent,
    FibroArticleComponent,
    PageNotFoundComponent,
    ConfirmModalComponent,
    SamplePageOneComponent,
    SamplePageTwoComponent,
    TakeQuizComponent,
    TakeSurveyComponent,
    QuizTextQuestionBooleanComponent,
    QuizTextQuestionShortAnswerComponent,
    QuizTextQuestionMultipleChoiceComponent,
    QuizResultsComponent
  ],
  imports: [
    BrowserModule,
    AdminModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModalModule
  ],
  entryComponents: [
    ConfirmModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
