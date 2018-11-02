import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms'

import { QuizTemplate } from  '../../../../../models/quizzes/quizTemplate';
import { QuizQuestion } from  '../../../../../models/quizzes/quizQuestion';

import { AdminService } from '../../services/admin.service'

class Template implements QuizTemplate {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-create-modify-quiz-template',
  templateUrl: './create-modify-quiz-template.component.html',
  styleUrls: ['./create-modify-quiz-template.component.scss']
})
export class CreateModifyQuizTemplateComponent implements OnInit {

  template: QuizTemplate = new Template()
  templates: QuizTemplate[]
  templateSelected: QuizTemplate
  error = ''

  profileForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    questions: this.fb.array([
      this.fb.group({
        text: [''],
        type: ['']
      })
    ])
  });

  get questions() {
    return this.profileForm.get('questions') as FormArray;
  }

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getTemplates();
  }

  getTemplates(): void {
    this.adminService.getAllQuizTemplates()
      .subscribe(templates => {
        if (templates && templates.length) {
          this.templates = templates;
        }
      });
  }

  templateChanged(): void {
    // console.log('templateSelected: ', this.templateSelected);
    if (this.templateSelected) {
      this.adminService.getQuizTemplate(this.templateSelected)
        .subscribe(template => {
          if (template && template.length) {
            this.template = template[0];
            this.adminService.getQuestionsForQuizTemplate(this.templateSelected)
              .subscribe(questions => {
                if (questions && questions.length) {
                  this.updateQuestions(questions);
                }
              });
          }
        });
    }
  }

  saveTemplate(): void {
    if (!this.checkForTemplateName()) {
      this.error = 'Please enter a template name';
      return;
    }
    this.adminService.saveQuizTemplate(this.template)
      .subscribe(result => {
        if (result) {
          // console.log('result: ', result);
          this.adminService.getQuizTemplateByName(this.template.name)
            .subscribe(template => {
              if (template && template.length) {
                const templateId = template[0].id;
                if (templateId) {
                  // TODO save quiz questions

                }
              }
            });
        }
      });
  }

  checkForTemplateName(): boolean {
    if (this.template.name) {
      return true
    }
    else {
      return false
    }
  }

  addQuestion() {
    this.questions.push(this.fb.group({
      text: [''],
      type: ['']
    }));
  }

  updateQuestions(questions) {
    this.questions.setValue(questions);
  }
}
