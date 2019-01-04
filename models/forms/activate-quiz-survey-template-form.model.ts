import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import * as _ from 'lodash';

import { requiredTrimWhitespaceValidator } from '../../public/src/app/validators/required-trim-whitespace.validator';
import { CheckQuizTitleValidator } from '../../public/src/app/validators/check-quiz-title.validator';

export class ActivateQuizSurveyTemplateFormModel {
  constructor(
    private fb: FormBuilder,
    private checkQuizTitle: CheckQuizTitleValidator
  ) {}

  selectQuizTemplateForm: FormGroup = this.fb.group({
    quizTemplateSelect: new FormControl('')
  })

  quizForm: FormGroup = this.fb.group({
    title: ['', {
      validators: requiredTrimWhitespaceValidator(),
      asyncValidators: this.checkQuizTitle.validate.bind(this.checkQuizTitle),
      updateOn: 'blur'
    }],
    description: ['']
  })

  defaultQuizConfigurationForm: FormGroup = this.fb.group({
    randomizeQuestionSequence: [true],
    randomizeAnswerSequence: [true],
    autoSubmit: [false],
    percentGreatJob: [75, [Validators.min(0), Validators.max(100)]]
  })

  quizConfigurationForm: FormGroup = _.cloneDeep(this.defaultQuizConfigurationForm);

  selectSurveyTemplateForm: FormGroup = this.fb.group({
    surveyTemplateSelect: new FormControl('')
  })

  selectWebpageForm: FormGroup = this.fb.group({
    webpageSelect: new FormControl('')
  })
}
