import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizTextQuestionShortAnswerComponent } from './quiz-text-question-short-answer.component';

describe('QuizTextQuestionShortAnswerComponent', () => {
  let component: QuizTextQuestionShortAnswerComponent;
  let fixture: ComponentFixture<QuizTextQuestionShortAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizTextQuestionShortAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizTextQuestionShortAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
