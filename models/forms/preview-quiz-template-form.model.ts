import { FormBuilder } from '@angular/forms'

import { CreateModifyQuizTemplateFormModel } from "./create-modify-quiz-template-form.model";
import { CheckTemplateNameValidator } from '../../public/src/app/validators/check-template-name.validator';

export class PreviewQuizTemplateFormModel extends CreateModifyQuizTemplateFormModel {
  constructor(
    fb: FormBuilder,
    checkTemplateName: CheckTemplateNameValidator
  ) {
    super(fb, checkTemplateName);
  }

  previewQuizTemplateForm = this.createModifyQuizTemplateForm;
}
