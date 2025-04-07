import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeQuizQuestionComponent } from './take-quiz-question.component';

describe('TakeQuizQuestionComponent', () => {
  let component: TakeQuizQuestionComponent;
  let fixture: ComponentFixture<TakeQuizQuestionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeQuizQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeQuizQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
