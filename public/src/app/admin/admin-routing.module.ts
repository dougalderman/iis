import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component'
import { AdminHomeComponent } from './admin-home/admin-home.component'
import { CreateModifyQuizTemplateComponent } from './create-modify-quiz-template/create-modify-quiz-template.component'
import { CreateModifySurveyTemplateComponent } from './create-modify-survey-template/create-modify-survey-template.component'
import { ActivateQuizTemplateComponent } from './activate-quiz-template/activate-quiz-template.component'
import { ActivateSurveyTemplateComponent } from './activate-survey-template/activate-survey-template.component'

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'create-modify-quiz-template',
        component: CreateModifyQuizTemplateComponent
      },
      {
        path: 'create-modify-survey-template',
        component: CreateModifySurveyTemplateComponent
      },
      {
        path: 'activate-quiz-template',
        component: ActivateQuizTemplateComponent
      },
      {
        path: 'activate-survey-template',
        component: ActivateSurveyTemplateComponent
      },
      {
        path: '',
        component: AdminHomeComponent
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
