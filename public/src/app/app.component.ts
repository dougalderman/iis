import { Component } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import '../assets/scss/styles.scss';

@Component({
  imports: [
    AppRoutingModule
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
}        
