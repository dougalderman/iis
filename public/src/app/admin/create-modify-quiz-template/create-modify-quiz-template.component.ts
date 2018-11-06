import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray } from '@angular/forms'

import { QuizTemplate } from  '../../../../../models/quizzes/quizTemplate';
import { QuizQuestion } from  '../../../../../models/quizzes/quizQuestion';

import { AdminService } from '../../services/admin.service'

class Template extends QuizTemplate {}
class Question extends QuizQuestion {}


@Component({
  selector: 'app-create-modify-quiz-template',
  templateUrl: './create-modify-quiz-template.component.html',
  styleUrls: ['./create-modify-quiz-template.component.scss']
})
export class CreateModifyQuizTemplateComponent implements OnInit {

  template: QuizTemplate = new Template()
  templates: QuizTemplate[]
  question: QuizQuestion = new Question()
  questions: QuizQuestion[]
  error = ''

  createModifyQuizTemplateForm = this.fb.group({
    templateSelect: new FormControl(''),
    name: ['', Validators.required],
    description: [''],
    formQuestions: this.fb.array([
      this.fb.group({
        text: [''],
        type: [''],
        answer: ['']
      })
    ])
  });

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getTemplates();
    this.onChanges();
  }

  onChanges(): void {
    this.createModifyQuizTemplateForm.get('templateSelect').valueChanges.subscribe(val => {
      this.templateChanged(val);
    })
  }

  get formQuestions() {
    return this.createModifyQuizTemplateForm.get('formQuestions') as FormArray;
  }

  get name() { return this.createModifyQuizTemplateForm.get('name'); }
  get description() { return this.createModifyQuizTemplateForm.get('description'); }

  getTemplates(): void {
    this.adminService.getAllQuizTemplates()
      .subscribe(templates => {
        if (templates && templates.length) {
          this.templates = templates;
        }
      });
  }

  templateChanged(templateSelected): void {
    // console.log('templateSelected: ', this.templateSelected);
    if (templateSelected) {
      this.adminService.getQuizTemplate(templateSelected)
        .subscribe(template => {
          if (template && template.length) {
            this.template = template[0];
            this.formQuestions.reset();
            this.adminService.getQuestionsForQuizTemplate(templateSelected)
              .subscribe(questions => {
                if (questions && questions.length) {
                  for (let question of questions) {
                    this.addQuestion(question);
                  }
                }
              });
          }
        });
    }
  }

  saveTemplate(): void {
    if (!this.template.id) { // if new template
      this.template.name = this.createModifyQuizTemplateForm.get('name').value;
      this.template.description = this.createModifyQuizTemplateForm.get('description').value;
      this.adminService.saveQuizTemplate(this.template)
        .subscribe(result => {
          if (result) {
            // console.log('result: ', result);
            this.adminService.getQuizTemplateByName(this.template.name)
              .subscribe(template => {
                if (template && template.length) {
                  const templateId = template[0].id;
                  if (templateId) {
                    for (let i = 0; i < this.formQuestions.length; i++) {
                      this.question = new Question()
                      /* this.question.textQuestion = this.formQuestions.at(i)
                      this.adminService.saveQuizQuestion(this.question)
                        .subscribe(result => {
                       if (result) { */
                    }
                  }
                }
              });
          }
        });
      }
  }

  addQuestion(question?) {
    let questions = <FormArray>this.createModifyQuizTemplateForm.controls.formQuestions;

    if (question) {
      questions.push(this.fb.group({
        text: [this.question.textQuestion],
        type: [this.question.questionType],
        answer: [this.question.correctAnswer]
      }));
    }
    else {
      questions.push(this.fb.group({
        text: [''],
        type: ['']
      }));
    }
  }
}
