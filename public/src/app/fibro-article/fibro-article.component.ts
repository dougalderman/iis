import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fibro-article',
  templateUrl: './fibro-article.component.html',
  styleUrls: ['./fibro-article.component1.scss','./fibro-article.component2.scss','./fibro-article.component3.scss']
})
export class FibroArticleComponent implements OnInit {

  private LOGO = require("./enwiki-1.5x.png");

  constructor() { }

  ngOnInit() {
  }

}
