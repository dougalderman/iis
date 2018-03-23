import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FibroArticleComponent } from './fibro-article.component';

describe('FibroArticleComponent', () => {
  let component: FibroArticleComponent;
  let fixture: ComponentFixture<FibroArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FibroArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FibroArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
