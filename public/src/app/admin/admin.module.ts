import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component'
import { CreateModifyQuizTemplateComponent } from './create-modify-quiz-template/create-modify-quiz-template.component';
import { CreateModifySurveyTemplateComponent } from './create-modify-survey-template/create-modify-survey-template.component';
import { ActivateQuizSurveyTemplateComponent } from './activate-quiz-survey-template/activate-quiz-survey-template.component';
import { TemplateQuizQuestionComponent } from './template-quiz-question/template-quiz-question.component';
import { TemplateQuizQuestionDisabledComponent } from './template-quiz-question-disabled/template-quiz-question-disabled.component';
import { TemplateSurveyQuestionComponent } from './template-survey-question/template-survey-question.component';
import { TemplateSurveyQuestionDisabledComponent } from './template-survey-question-disabled/template-survey-question-disabled.component';
import { ActivateQuizTemplateComponent } from './activate-quiz-template/activate-quiz-template.component';
import { ActivateSurveyTemplateComponent } from './activate-survey-template/activate-survey-template.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    NgbTooltipModule
  ],
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    CreateModifyQuizTemplateComponent,
    CreateModifySurveyTemplateComponent,
    ActivateQuizSurveyTemplateComponent,
    TemplateQuizQuestionComponent,
    TemplateQuizQuestionDisabledComponent,
    TemplateSurveyQuestionComponent,
    TemplateSurveyQuestionDisabledComponent,
    ActivateQuizTemplateComponent,
    ActivateSurveyTemplateComponent
  ]
})
export class AdminModule {}