import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateQuizQuestionComponent } from './template-quiz-question.component';

describe('TemplateQuizQuestionComponent', () => {
  let component: TemplateQuizQuestionComponent;
  let fixture: ComponentFixture<TemplateQuizQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateQuizQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateQuizQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
