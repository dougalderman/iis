import { Route } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component'
import { CreateModifyQuizTemplateComponent } from './create-modify-quiz-template/create-modify-quiz-template.component'
import { CreateModifySurveyTemplateComponent } from './create-modify-survey-template/create-modify-survey-template.component'
import { ActivateQuizSurveyTemplateComponent } from './activate-quiz-survey-template/activate-quiz-survey-template.component'

export const adminRoutes: Route[] = [
  {
    path: 'create-modify-quiz-template',
    component: CreateModifyQuizTemplateComponent
  },
  {
    path: 'create-modify-survey-template',
    component: CreateModifySurveyTemplateComponent
  },
  {
    path: 'activate-quiz-survey-template',
    component: ActivateQuizSurveyTemplateComponent
  },
  {
    path: '',
    component: AdminHomeComponent
  },
];