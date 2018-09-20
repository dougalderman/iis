import { Component, OnInit } from '@angular/core';

import { QuizTemplate } from  '../../../../../models/quizzes/quizTemplate';
import { QuizQuestion } from  '../../../../../models/quizzes/quizQuestion';

import { AdminService } from '../../services/admin.service'

class Template implements QuizTemplate {
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
  questions: QuizQuestion[]

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.getTemplates();
  }

  getTemplates(): void {
    this.adminService.getAllQuizTemplates()
      .subscribe(templates => {
        if (templates && templates.length) {
          this.templates = templates
        }
      });
  }

  templateChanged(): void {
    // console.log('templateSelected: ', this.templateSelected);
    if (this.templateSelected) {
      this.adminService.getQuizTemplate(this.templateSelected)
        .subscribe(template => {
          if (template && template.length) {
            this.template = template[0]
            this.adminService.getQuestionsForQuizTemplate(this.templateSelected)
              .subscribe(questions => {
                if (questions && questions.length) {
                  this.questions = questions
                }
              });
          }
        });
    }
  }
}
