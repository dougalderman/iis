import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WebpageDataModel } from '../../../../../models/webpages/data/webpage-data.model';
import { WebpageAdminService } from '../../services/webpage-admin.service';

@Component({
  selector: 'app-sample-page-one',
  templateUrl: './sample-page-one.component.html',
  styleUrls: ['./sample-page-one.component.scss']
})
export class SamplePageOneComponent implements OnInit {

  quizId: number;
  surveyId: number;

  constructor(
    private route: ActivatedRoute,
    private webpageAdminService: WebpageAdminService
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
                      const page = pages[0];
                      this.quizId = page.quiz_id;
                      this.surveyId = page.survey_id;
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
