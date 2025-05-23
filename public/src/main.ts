import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

if (process.env.ENV === 'production') {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    provideAnimations()
  ],
}).catch(err => console.error(err));