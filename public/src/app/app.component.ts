import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import '../assets/scss/styles.scss';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
}        