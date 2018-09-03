import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModifySurveyTemplateComponent } from './create-modify-survey-template.component';

describe('CreateModifySurveyTemplateComponent', () => {
  let component: CreateModifySurveyTemplateComponent;
  let fixture: ComponentFixture<CreateModifySurveyTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModifySurveyTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModifySurveyTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
