import { NgModule } from '@angular/core';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component'
import { CreateModifyQuizTemplateComponent } from './create-modify-quiz-template/create-modify-quiz-template.component';
import { CreateModifySurveyTemplateComponent } from './create-modify-survey-template/create-modify-survey-template.component';
import { ActivateQuizTemplateComponent } from './activate-quiz-template/activate-quiz-template.component';
import { ActivateSurveyTemplateComponent } from './activate-survey-template/activate-survey-template.component';

@NgModule({
  imports: [
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    CreateModifyQuizTemplateComponent,
    CreateModifySurveyTemplateComponent,
    ActivateQuizTemplateComponent,
    ActivateSurveyTemplateComponent
  ]
})
export class AdminModule {}
