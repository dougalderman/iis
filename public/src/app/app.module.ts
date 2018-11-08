import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FibroArticleComponent } from './fibro-article/fibro-article.component';
import { AdminModule } from './admin/admin.module';
import { QuizAdminService } from './services/quiz-admin.service'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

@NgModule({
  declarations: [
    AppComponent,
    FibroArticleComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AdminModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [QuizAdminService],
  bootstrap: [AppComponent]
})
export class AppModule { }
