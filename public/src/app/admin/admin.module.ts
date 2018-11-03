import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component'
import { CreateModifyQuizTemplateComponent } from './create-modify-quiz-template/create-modify-quiz-template.component';
import { CreateModifySurveyTemplateComponent } from './create-modify-survey-template/create-modify-survey-template.component';
import { ActivateQuizTemplateComponent } from './activate-quiz-template/activate-quiz-template.component';
import { ActivateSurveyTemplateComponent } from './activate-survey-template/activate-survey-template.component';
import { QuizQuestionComponent } from './quiz-question/quiz-question.component';

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
    ActivateQuizTemplateComponent,
    ActivateSurveyTemplateComponent,
    QuizQuestionComponent
  ]
})
export class AdminModule {}
