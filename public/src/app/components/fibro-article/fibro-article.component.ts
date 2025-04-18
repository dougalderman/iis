import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { WebpageDataModel } from '../../../../../models/webpages/data/webpage-data.model';
import { WebpageAdminService } from '../../services/webpage-admin.service';
import { TakeQuizService } from '../../services/take-quiz.service';
import { TakeSurveyService } from '../../services/take-survey.service';

@Component({
  standalone: false,
  selector: 'app-fibro-article',
  templateUrl: './fibro-article.component.html',
  styleUrls: ['./fibro-article.component1.scss','./fibro-article.component2.scss','./fibro-article.component3.scss']
})
export class FibroArticleComponent implements OnInit {

  LOGO = require('../../../assets/images/enwiki-1.5x.png');

  quizId: number;
  surveyId: number;

  constructor(
    private route: ActivatedRoute,
    private webpageAdminService: WebpageAdminService,
    private takeQuizService: TakeQuizService,
    private takeSurveyService: TakeSurveyService
  ) {}

  ngOnInit() {
    this.route.data
      .subscribe(
        (result: any) => {
          if (result) {
            const title = result.title;
            if (title) {
              this.webpageAdminService.getWebpageByTitle(title)
                .subscribe(
                  (pages: WebpageDataModel[]) => {
                    if (pages && pages.length) {
                      const page: WebpageDataModel = pages[0];
                      this.quizId = page.quiz_id;
                      if (this.quizId) {
                        this.takeQuizService.setQuizId(this.quizId);
                      }
                      this.surveyId = page.survey_id;
                      if (this.surveyId) {
                        this.takeSurveyService.setSurveyId(this.surveyId);
                      }
                    }
                  },
                  error => {
                    console.error(error);
                  }
              );
            }
          }
        },
        error => {
          console.error(error);
        }
      );
  }
}
