import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sample-page-one',
  templateUrl: './sample-page-one.component.html',
  styleUrls: ['./sample-page-one.component.scss']
})
export class SamplePageOneComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('route: ', this.route);
  }

}
