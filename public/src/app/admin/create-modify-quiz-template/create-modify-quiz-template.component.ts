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

class Question implements QuizQuestion {
  quizId: number;
  templateId: number;
  textQuestion: string;
  pictureQuestion: string;
  questionType: string;
  options: object[];
  booleanCorrectAnswer: boolean;
  correctAnswer: string;
  correctAnswerArray: string[];
  locationCorrectAnswers: object[];
  dateCorrectAnswer: Date;
  dateStartCorrectAnswer: Date;
  dateEndCorrectAnswer: Date;
  integerCorrectAnswer: number;
  integerStartCorrectAnswer: number;
  integerEndCorrectAnswer: number;
  realCorrectAnswer: number;
  realStartCorrectAnswer: number;
  realEndCorrectAnswer: number;
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
  question: QuizQuestion = new Question()
  questions: QuizQuestion[]
  error = ''

  createModifyQuizTemplateForm = this.fb.group({
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
  }

  get formQuestions() {
    return this.createModifyQuizTemplateForm.get('formQuestions') as FormArray;
  }

  get name() { return this.createModifyQuizTemplateForm.get('name'); }

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
            this.formQuestions.reset();
            this.adminService.getQuestionsForQuizTemplate(this.templateSelected)
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
