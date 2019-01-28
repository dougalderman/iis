import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { TakeQuizQuestionComponent } from './components/take-quiz-question/take-quiz-question.component';
import { TakeSurveyQuestionComponent } from './components/take-survey-question/take-survey-question.component';

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
    TakeQuizQuestionComponent,
    TakeSurveyQuestionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AdminModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModalModule
  ],
  entryComponents: [
    ConfirmModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
