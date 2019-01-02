import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

export class ActivateQuizSurveyTemplateFormModel {
  constructor(
    private fb: FormBuilder,
  ) {}

  selectQuizTemplateForm: FormGroup = this.fb.group({
    quizTemplateSelect: new FormControl('')
  })

  quizOptionsForm: FormGroup = this.fb.group({
    randomizeQuestionSequence: [true],
    randomizeAnswerSequence: [true],
    autoSubmit: [false],
    percentGreatJob: [70, [Validators.min(0), Validators.max(100)]]
  })

  selectSurveyTemplateForm: FormGroup = this.fb.group({
    surveyTemplateSelect: new FormControl('')
  })

  selectWebPageForm: FormGroup = this.fb.group({
    webPageSelect: new FormControl('')
  })
}
