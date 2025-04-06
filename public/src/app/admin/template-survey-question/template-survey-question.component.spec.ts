import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSurveyQuestionComponent } from './template-survey-question.component';

describe('TemplateSurveyQuestionComponent', () => {
  let component: TemplateSurveyQuestionComponent;
  let fixture: ComponentFixture<TemplateSurveyQuestionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateSurveyQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateSurveyQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
