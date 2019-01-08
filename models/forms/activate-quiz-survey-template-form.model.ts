import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import * as _ from 'lodash';

import { requiredTrimWhitespaceValidator } from '../../public/src/app/validators/required-trim-whitespace.validator';
import { CheckQuizUniqueNameValidator } from '../../public/src/app/validators/check-quiz-unique-name.validator';

export class ActivateQuizSurveyTemplateFormModel {
  constructor(
    private fb: FormBuilder,
    private checkQuizUniqueName: CheckQuizUniqueNameValidator
  ) {}

  selectQuizTemplateForm: FormGroup = this.fb.group({
    quizTemplateSelect: new FormControl('')
  })

  quizForm: FormGroup = this.fb.group({
    uniqueName: ['', {
      validators: requiredTrimWhitespaceValidator(),
      asyncValidators: this.checkQuizUniqueName.validate.bind(this.checkQuizUniqueName),
      updateOn: 'blur'
    }],
    title: [''],
    description: ['']
  })

  defaultQuizConfigurationForm: FormGroup = this.fb.group({
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
