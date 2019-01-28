import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSurveyQuestionDisabledComponent } from './template-survey-question-disabled.component';

describe('TemplateSurveyQuestionDisabledComponent', () => {
  let component: TemplateSurveyQuestionDisabledComponent;
  let fixture: ComponentFixture<TemplateSurveyQuestionDisabledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateSurveyQuestionDisabledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateSurveyQuestionDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
