import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms'

import { QuizTemplate } from  '../../../../../models/quizzes/quizTemplate';
import { QuizQuestion } from  '../../../../../models/quizzes/quizQuestion';

import { QuizAdminService } from '../../services/quiz-admin.service'

class Template extends QuizTemplate {}
class Question extends QuizQuestion {}

const QUESTION_TYPES = [
  {name: 'textQuestionMultipleChoice', description: 'Text Question Multiple Choice', default: true},
  {name: 'textQuestionShortAnswer', description: 'Text Question Short Answer'},
  {name: 'textQuestionBoolean', description: 'Text Question Boolean'},
  {name: 'textQuestionNumericAnswer', description: 'Text Question Numeric Answer'},
  {name: 'textQuestionNumericRangeAnswer', description: 'Text Question Numeric Range Answer'},
]

@Component({
  selector: 'app-create-modify-quiz-template',
  templateUrl: './create-modify-quiz-template.component.html',
  styleUrls: ['./create-modify-quiz-template.component.scss']
})
export class CreateModifyQuizTemplateComponent implements OnInit {

  template: QuizTemplate = new Template();
  templates: QuizTemplate[];
  question: QuizQuestion = new Question();
  questionTypes = QUESTION_TYPES;
  questionTypeChangedSubscription = [];
  success = false;
  error = false;

  selectTemplateForm = this.fb.group({
    templateSelect: new FormControl('')
  })

  createModifyQuizTemplateForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    formQuestions: this.fb.array([
      this.fb.group({
        text: ['', Validators.required],
        typeSelect: new FormControl(''),
        answer: ['', Validators.required]
      })
    ])
  });

  constructor(
    private quizAdminService: QuizAdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getTemplates();
    this.onChanges();
  }

  onChanges(): void {
    this.selectTemplateForm.get('templateSelect').valueChanges.subscribe(val => {
      this.templateSelectionChanged(val);
    });
    this.subscribeToQuestionTypeChanges();
  }

  subscribeToQuestionTypeChanges() {
    if (this.formQuestions && this.formQuestions.controls) {
      for (let i = 0; i < this.formQuestions.controls.length; i++) {
        let control: FormGroup = this.formQuestions.controls[i] as FormGroup;
        this.questionTypeChangedSubscription[i] = control.controls.typeSelect.valueChanges.subscribe(val => {
          this.questionTypeChanged(val, i);
        })
      }
    }
  }

  unsubscribeToQuestionTypeChanges() {
    if (this.formQuestions && this.formQuestions.controls) {
      for (let i = 0; i < this.formQuestions.controls.length; i++) {
        this.questionTypeChangedSubscription[i].unsubscribe();
      }
    }
  }

  get formQuestions(): FormArray {
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

  templateSelectionChanged(templateSelected: number): void {
    if (templateSelected) {
      this.success = false;
      this.error = false;
      this.quizAdminService.getQuizTemplate(templateSelected)
        .subscribe(template => {
          if (template && template.length) {
            this.template = template[0];
            this.createModifyQuizTemplateForm.reset();
            this.resetFormQuestions();
            this.createModifyQuizTemplateForm.controls.name.setValue(this.template.name);
            this.createModifyQuizTemplateForm.controls.description.setValue(this.template.description);
            this.quizAdminService.getQuestionsForQuizTemplate(templateSelected)
              .subscribe((questions: any) => {
                if (questions && questions.length) {
                  for (let i = 0; i < questions.length; i++) {
                    let question = new Question();
                    question.textQuestion = questions[i].text_question;
                    question.questionType = questions[i].question_type;
                    question.correctAnswer = questions[i].correct_answer;
                    this.addQuestion(question);
                  }
                }
              });
          }
        });
    }
  }

  saveTemplate(): void {
    this.error = false;
    const name = this.createModifyQuizTemplateForm.get('name').value;
    this.template.description = this.createModifyQuizTemplateForm.get('description').value;
    if (!this.template.id || name !== this.template.name) { // if new template or template name changed
      this.template.name = name;
      this.template.id = null;
      this.quizAdminService.saveNewQuizTemplate(this.template)
        .subscribe(result => {
          if (result) {
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
    this.unsubscribeToQuestionTypeChanges()
    if (question) {
      this.formQuestions.push(this.fb.group({
        text: [question.textQuestion, Validators.required],
        typeSelect: new FormControl(question.questionType),
        answer: [question.correctAnswer, Validators.required]
      }));
    }
    else {
      this.formQuestions.push(this.fb.group({
          text: ['', Validators.required],
          typeSelect: new FormControl(''),
          answer: ['', Validators.required]
      }));
    }
    this.subscribeToQuestionTypeChanges()
  }

  deleteQuestion(index: number): void {
    this.unsubscribeToQuestionTypeChanges()
    if (typeof index === 'number') {
      this.formQuestions.removeAt(index)
    }
    this.subscribeToQuestionTypeChanges()
  }


  saveAllTemplateQuestions(templateId: number): void {
    let questions = this.formQuestions.value;
    let questionSavedCount = 0;
    for (let question of questions) {
      this.question = new Question()
      this.question.templateId = templateId;
      this.question.textQuestion = question.text;
      this.question.questionType = question.typeSelect;
      this.question.correctAnswer = question.answer;
      this.quizAdminService.saveNewQuizQuestion(this.question)
        .subscribe(
          result => {
            if (result) {
              console.log('result: ', result);
              questionSavedCount++;
              if (questionSavedCount === questions.length) {
                this.success = true;
                this.createModifyQuizTemplateForm.reset();
                this.resetFormQuestions();
                this.getTemplates();
                this.selectTemplateForm.reset();
              }
            }
          },
          error => {
            console.error(error);
            this.error = true;
          }
        );
    }
  }

  resetFormQuestions(): void {
    const len = this.formQuestions.controls.length;
    for (let i = len - 1; i >= 0; i--) {
      this.deleteQuestion(i);
    }
    this.formQuestions.reset();
  }

  questionTypeChanged(questionType: string, index: number): void {
    console.log('questionType: ', questionType);
    console.log('index: ', index);
  }
}
