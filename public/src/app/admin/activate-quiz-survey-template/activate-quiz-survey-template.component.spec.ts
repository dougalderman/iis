import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateQuizSurveyTemplateComponent } from './activate-quiz-survey-template.component';

describe('ActivateQuizSurveyTemplateComponent', () => {
  let component: ActivateQuizSurveyTemplateComponent;
  let fixture: ComponentFixture<ActivateQuizSurveyTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateQuizSurveyTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateQuizSurveyTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
