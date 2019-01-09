import { Component, OnInit } from '@angular/core';

import { TakeSurveyService } from '../../services/take-survey.service';

@Component({
  selector: 'app-take-survey',
  templateUrl: './take-survey.component.html',
  styleUrls: ['./take-survey.component.scss']
})
export class TakeSurveyComponent implements OnInit {

  surveyId: number = 0;

  constructor(
    private takeSurveyService: TakeSurveyService
  ) { }

  ngOnInit() {
    this.surveyId = this.takeSurveyService.getSurveyId();
    if (this.surveyId) {
      this.takeSurveyService.resetSurveyId();
    }
  }
}
