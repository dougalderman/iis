import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FibroArticleComponent } from './components/fibro-article/fibro-article.component';
import { SamplePageOneComponent } from './components/sample-page-one/sample-page-one.component';
import { SamplePageTwoComponent } from './components/sample-page-two/sample-page-two.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'

export const appRoutes: Routes = [
  { path: 'fibro-article', component: FibroArticleComponent, data: {title: 'Fibromyalgia - Wikipedia'} },
  { path: 'sample-page-one', component: SamplePageOneComponent, data: {title: 'Sample Page One'} } ,
  { path: 'sample-page-two', component: SamplePageTwoComponent, data: {title: 'Sample Page Two'} },
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
