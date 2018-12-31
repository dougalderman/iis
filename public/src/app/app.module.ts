import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FibroArticleComponent } from './components/fibro-article/fibro-article.component';
import { AdminModule } from './admin/admin.module';
import { QuizAdminService } from './services/quiz-admin.service';
import { WebpageAdminService } from './services/webpage-admin.service';
import { ModalService } from './services/modal.service';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ConfirmModalComponent } from './components/bootstrap-components/confirm-modal/confirm-modal.component';
import { CheckTemplateNameValidator } from './validators/check-template-name.validator';
import { SamplePageOneComponent } from './components/sample-page-one/sample-page-one.component';
import { SamplePageTwoComponent } from './components/sample-page-two/sample-page-two.component';

@NgModule({
  declarations: [
    AppComponent,
    FibroArticleComponent,
    PageNotFoundComponent,
    ConfirmModalComponent,
    SamplePageOneComponent,
    SamplePageTwoComponent
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
  providers: [
    QuizAdminService,
    WebpageAdminService,
    ModalService,
    CheckTemplateNameValidator
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
