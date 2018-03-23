import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FibroArticleComponent } from './fibro-article/fibro-article.component';

@NgModule({
  declarations: [
    AppComponent,
    FibroArticleComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
