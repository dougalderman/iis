import { Component, OnInit } from '@angular/core';

import { TakeQuizService } from '../../services/take-quiz.service';

@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.scss']
})
export class TakeQuizComponent implements OnInit {

  quizId: number = 0;

  constructor(
    private takeQuizService: TakeQuizService
  ) { }

  ngOnInit() {
    this.quizId = this.takeQuizService.getQuizId();
    if (this.quizId) {
      this.takeQuizService.resetQuizId();
    }
  }
}
