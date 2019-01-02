import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component'
import { CreateModifyQuizTemplateComponent } from './create-modify-quiz-template/create-modify-quiz-template.component';
import { CreateModifySurveyTemplateComponent } from './create-modify-survey-template/create-modify-survey-template.component';
import { ActivateQuizSurveyTemplateComponent } from './activate-quiz-survey-template/activate-quiz-survey-template.component';
import { TemplateQuizQuestionComponent } from './template-quiz-question/template-quiz-question.component';
import { TemplateQuizQuestionDisabledComponent } from './template-quiz-question-disabled/template-quiz-question-disabled.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    CreateModifyQuizTemplateComponent,
    CreateModifySurveyTemplateComponent,
    ActivateQuizSurveyTemplateComponent,
    TemplateQuizQuestionComponent,
    TemplateQuizQuestionDisabledComponent
  ]
})
export class AdminModule {}
