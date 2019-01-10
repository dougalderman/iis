import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizTextQuestionMultipleChoiceComponent } from './quiz-text-question-multiple-choice.component';

describe('QuizTextQuestionMultipleChoiceComponent', () => {
  let component: QuizTextQuestionMultipleChoiceComponent;
  let fixture: ComponentFixture<QuizTextQuestionMultipleChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizTextQuestionMultipleChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizTextQuestionMultipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
