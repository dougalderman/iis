import { Component, OnInit } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';

@Component({
  imports: [AdminRoutingModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
