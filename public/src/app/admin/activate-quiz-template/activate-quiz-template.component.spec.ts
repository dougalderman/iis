import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateQuizTemplateComponent } from './activate-quiz-template.component';

describe('ActivateQuizTemplateComponent', () => {
  let component: ActivateQuizTemplateComponent;
  let fixture: ComponentFixture<ActivateQuizTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateQuizTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateQuizTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
