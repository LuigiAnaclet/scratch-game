import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withDebugTracing } from '@angular/router';
import { routes } from './app/app.routes';
import {provideHttpClient, withFetch } from '@angular/common/http';
import { HomeComponent } from './app/home/home.component';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    
  ]
}).catch(err => console.error(err));