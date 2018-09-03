import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateSurveyTemplateComponent } from './activate-survey-template.component';

describe('ActivateSurveyTemplateComponent', () => {
  let component: ActivateSurveyTemplateComponent;
  let fixture: ComponentFixture<ActivateSurveyTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateSurveyTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateSurveyTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
