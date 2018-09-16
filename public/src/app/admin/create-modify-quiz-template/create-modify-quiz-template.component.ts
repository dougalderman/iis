import { Component, OnInit } from '@angular/core';

import { QuizTemplate } from  '../../../../../models/quizzes/quizTemplate';
import { AdminService } from '../../services/admin.service'

@Component({
  selector: 'app-create-modify-quiz-template',
  templateUrl: './create-modify-quiz-template.component.html',
  styleUrls: ['./create-modify-quiz-template.component.scss']
})
export class CreateModifyQuizTemplateComponent implements OnInit {

  templates: QuizTemplate[]
  templateSelected: QuizTemplate

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.getTemplates();
  }

  getTemplates(): void {
    this.adminService.getAllQuizTemplates()
        .subscribe(templates =>
          this.templates = templates);
  }
}
