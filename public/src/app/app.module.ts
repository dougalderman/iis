import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FibroArticleComponent } from './fibro-article/fibro-article.component';
import { AdminModule } from './admin/admin.module';
import { QuizAdminService } from './services/quiz-admin.service';
import { ModalService } from './services/modal.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ConfirmModalComponent } from './bootstrap-components/confirm-modal/confirm-modal.component';
import { CheckTemplateNameValidator } from './validators/check-template-name.validator';
import { SamplePageOneComponent } from './sample-page-one/sample-page-one.component';
import { SamplePageTwoComponent } from './sample-page-two/sample-page-two.component';

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
  providers: [QuizAdminService, ModalService, CheckTemplateNameValidator],
  bootstrap: [AppComponent]
})
export class AppModule { }
