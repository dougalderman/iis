import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TakeQuizService {

  private quizId: number = 0;

  constructor() { }

  getQuizId() {
    return this.quizId;
  }

  setQuizId(id: number) {
    if (id) {
      this.quizId = id;
    }
  }

  resetQuizId() {
    this.quizId = 0;
  }
}
