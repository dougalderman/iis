import { TestBed, inject } from '@angular/core/testing';

import { QuizAdminService } from './quiz-admin.service';

describe('QuizAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizAdminService]
    });
  });

  it('should be created', inject([QuizAdminService], (service: QuizAdminService) => {
    expect(service).toBeTruthy();
  }));
});
