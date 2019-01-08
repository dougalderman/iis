import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateQuizQuestionDisabledComponent } from './template-quiz-question-disabled.component';

describe('TemplateQuizQuestionDisabledComponent', () => {
  let component: TemplateQuizQuestionDisabledComponent;
  let fixture: ComponentFixture<TemplateQuizQuestionDisabledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateQuizQuestionDisabledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateQuizQuestionDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
