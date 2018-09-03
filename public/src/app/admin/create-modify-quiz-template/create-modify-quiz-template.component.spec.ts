import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModifyQuizTemplateComponent } from './create-modify-quiz-template.component';

describe('CreateModifyQuizTemplateComponent', () => {
  let component: CreateModifyQuizTemplateComponent;
  let fixture: ComponentFixture<CreateModifyQuizTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModifyQuizTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModifyQuizTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
