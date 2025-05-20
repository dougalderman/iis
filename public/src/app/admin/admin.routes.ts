import { Route } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component'
import { CreateModifyQuizTemplateComponent } from './create-modify-quiz-template/create-modify-quiz-template.component'
import { CreateModifySurveyTemplateComponent } from './create-modify-survey-template/create-modify-survey-template.component'
import { ActivateQuizSurveyTemplateComponent } from './activate-quiz-survey-template/activate-quiz-survey-template.component'

export const adminRoutes: Route[] = [
  { path: 'create-modify-quiz-template', loadComponent: () => import('./create-modify-quiz-template/create-modify-quiz-template.component').then(mod => mod.CreateModifyQuizTemplateComponent) },
  { path: 'create-modify-survey-template', loadComponent: () => import('./create-modify-survey-template/create-modify-survey-template.component').then(mod => mod.CreateModifySurveyTemplateComponent) },
  { path: 'activate-quiz-survey-template', loadComponent: () => import('./activate-quiz-survey-template/activate-quiz-survey-template.component').then(mod => mod.ActivateQuizSurveyTemplateComponent) },
  { path: '', loadComponent: () => import('./admin-home/admin-home.component').then(mod => mod.AdminHomeComponent) },
];