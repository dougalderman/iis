import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { FibroArticleComponent } from './fibro-article/fibro-article.component';
import { AdminComponent } from './admin/admin/admin.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'


const appRoutes: Routes = [
  { path: 'fibro-article', component: FibroArticleComponent },
  { path: 'admin', component: AdminComponent },
  { path: '', redirectTo: '/fibro-article', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FibroArticleComponent,
    AdminComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
