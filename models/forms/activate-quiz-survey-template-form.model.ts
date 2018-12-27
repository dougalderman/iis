import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms'

export class ActivateQuizSurveyTemplateFormModel {
  constructor(
    private fb: FormBuilder,
  ) {}

  selectQuizTemplateForm: FormGroup = this.fb.group({
    quizTemplateSelect: new FormControl('')
  })

  selectSurveyTemplateForm: FormGroup = this.fb.group({
    surveyTemplateSelect: new FormControl('')
  })
  
  selectWebPageForm: FormGroup = this.fb.group({
    webPageSelect: new FormControl('')
  })  
}  