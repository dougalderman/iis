import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray } from '@angular/forms'

import { QuizTemplate } from  '../../../../../models/quizzes/quizTemplate';
import { QuizQuestion } from  '../../../../../models/quizzes/quizQuestion';

import { QuizAdminService } from '../../services/quiz-admin.service'

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
  success = false

  createModifyQuizTemplateForm = this.fb.group({
    templateSelect: new FormControl(''),
    name: ['', Validators.required],
    description: [''],
    formQuestions: this.fb.array([
      this.fb.group({
        text: ['', Validators.required],
        type: ['', Validators.required],
        answer: ['', Validators.required]
      })
    ])
  });

  constructor(
    private quizAdminService: QuizAdminService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getTemplates();
    this.onChanges();
  }

  onChanges(): void {
    this.createModifyQuizTemplateForm.get('templateSelect').valueChanges.subscribe(val => {
      this.templateSelectionChanged(val);
    })
  }

  get formQuestions() {
    return this.createModifyQuizTemplateForm.get('formQuestions') as FormArray;
  }

  get name() { return this.createModifyQuizTemplateForm.get('name'); }
  get description() { return this.createModifyQuizTemplateForm.get('description'); }

  getTemplates(): void {
    this.quizAdminService.getAllQuizTemplates()
      .subscribe(templates => {
        if (templates && templates.length) {
          this.templates = templates;
        }
      });
  }

  templateSelectionChanged(templateSelected): void {
    // console.log('templateSelected: ', this.templateSelected);
    if (templateSelected) {
      this.success = false;
      this.quizAdminService.getQuizTemplate(templateSelected)
        .subscribe(template => {
          if (template && template.length) {
            this.template = template[0];
            this.createModifyQuizTemplateForm.controls.name.setValue(this.template.name);
            this.createModifyQuizTemplateForm.controls.description.setValue(this.template.description)
            this.quizAdminService.getQuestionsForQuizTemplate(templateSelected)
              .subscribe((questions: any) => {
                let formQuestions = <FormArray>this.createModifyQuizTemplateForm.controls.formQuestions;
                if (questions && questions.length) {
                  for (let i = 0; i < questions.length; i++) {
                    let question = new Question();
                    question.textQuestion = questions[i].text_question;
                    question.questionType = questions[i].question_type;
                    question.correctAnswer = questions[i].correct_answer;
                    if (i === 0) {
                      formQuestions.setValue([{
                        text: question.textQuestion,
                        type: question.questionType,
                        answer: question.correctAnswer
                      }]);
                    }
                    else {
                      this.addQuestion(question);
                    }
                  }
                }
                else {
                  formQuestions.reset();
                }
              });
          }
        });
    }
  }

  saveTemplate(): void {
    const name = this.createModifyQuizTemplateForm.get('name').value;
    this.template.description = this.createModifyQuizTemplateForm.get('description').value;
    if (!this.template.id || name !== this.template.name) { // if new template or template name changed
      this.template.name = name;
      this.template.id = null;
      this.quizAdminService.saveNewQuizTemplate(this.template)
        .subscribe(result => {
          if (result) {
            // console.log('result: ', result);
            this.quizAdminService.getQuizTemplateByName(this.template.name)
              .subscribe(template => {
                if (template && template.length) {
                  const templateId = template[0].id;
                  if (templateId) {
                    this.saveAllTemplateQuestions(templateId)
                  }
                }
              });
          }
        });
      }
      else { // modifying existing template
        this.quizAdminService.saveExistingQuizTemplate(this.template.id, this.template)
          .subscribe(result => {
            if (result) {
              this.quizAdminService.deleteQuizQuestionsByTemplateId(this.template.id)
                .subscribe(result => {
                  if (result) {
                    this.saveAllTemplateQuestions(this.template.id)
                  }
                })
            }
          });
      }
  }

  addQuestion(question?: QuizQuestion): void {
    let questions = <FormArray>this.createModifyQuizTemplateForm.controls.formQuestions;

    if (question) {
      questions.push(this.fb.group({
        text: [question.textQuestion, Validators.required],
        type: [question.questionType, Validators.required],
        answer: [question.correctAnswer, Validators.required]
      }));
    }
    else {
      questions.push(this.fb.group({
        text: ['', Validators.required],
        type: ['', Validators.required],
        answer: ['', Validators.required]
      }));
    }
  }

  deleteQuestion(index: number): void {
    let questions = <FormArray>this.createModifyQuizTemplateForm.controls.formQuestions;

    if (typeof index === 'number') {
      questions.removeAt(index)
    }
  }


  saveAllTemplateQuestions(templateId: number): void {
    let questions = this.createModifyQuizTemplateForm.get('formQuestions').value;
    let questionSavedCount = 0;
    for (let question of questions) {
      this.question = new Question()
      this.question.templateId = templateId;
      this.question.textQuestion = question.text;
      this.question.questionType = question.type;
      this.question.correctAnswer = question.answer;
      this.quizAdminService.saveNewQuizQuestion(this.question)
        .subscribe(result => {
          if (result) {
            console.log('Quiz Question saved: ', this.question);
            questionSavedCount++;
            if (questionSavedCount === questions.length) {
              this.success = true;
              this.createModifyQuizTemplateForm.reset();
              this.createModifyQuizTemplateForm.controls.formQuestions = <FormArray>this.fb.array([
                this.fb.group({
                  text: ['', Validators.required],
                  type: ['', Validators.required],
                  answer: ['', Validators.required]
                })
              ]);
              this.getTemplates();
            }
          }
        });
    }
  }
}
