import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-demo-menu',
  templateUrl: './demo-menu.component.html',
  styleUrls: ['./demo-menu.component.scss']
})
export class DemoMenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
