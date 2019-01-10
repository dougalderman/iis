import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizTextQuestionBooleanComponent } from './quiz-text-question-boolean.component';

describe('QuizTextQuestionBooleanComponent', () => {
  let component: QuizTextQuestionBooleanComponent;
  let fixture: ComponentFixture<QuizTextQuestionBooleanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizTextQuestionBooleanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizTextQuestionBooleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
