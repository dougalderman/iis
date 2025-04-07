import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeSurveyQuestionComponent } from './take-survey-question.component';

describe('TakeSurveyQuestionComponent', () => {
  let component: TakeSurveyQuestionComponent;
  let fixture: ComponentFixture<TakeSurveyQuestionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeSurveyQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeSurveyQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
