import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FibroArticleComponent } from './fibro-article/fibro-article.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

const appRoutes: Routes = [
  { path: 'fibro-article', component: FibroArticleComponent },
  { path: '', redirectTo: '/fibro-article', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
