import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: 'demo-menu', loadComponent: () => import('./components/demo-menu/demo-menu.component').then(mod => mod.DemoMenuComponent) },
  { path: 'fibro-article', loadComponent: () => import('./components/fibro-article/fibro-article.component').then(mod => mod.FibroArticleComponent), data: {title: 'Fibromyalgia - Wikipedia'} },
  { path: 'sample-page-one', loadComponent: () => import('./components/sample-page-one/sample-page-one.component').then(mod => mod.SamplePageOneComponent), data: {title: 'Sample Page One'} },
  { path: 'sample-page-two', loadComponent: () => import('./components/sample-page-two/sample-page-two.component').then(mod => mod.SamplePageTwoComponent), data: {title: 'Sample Page Two'} },
  { path: 'take-quiz', loadComponent: () => import('./components/take-quiz/take-quiz.component').then(mod => mod.TakeQuizComponent) },
  { path: 'take-survey', loadComponent: () => import('./components/take-survey/take-survey.component').then(mod => mod.TakeSurveyComponent) },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(mod => mod.adminRoutes) },
  { path: '', redirectTo: '/demo-menu', pathMatch: 'full' },
  { path: '**', loadComponent: () => import('./components/page-not-found/page-not-found.component').then(mod => mod.PageNotFoundComponent) },
];