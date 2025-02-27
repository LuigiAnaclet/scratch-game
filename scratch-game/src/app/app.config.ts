import { provideRouter, withHashLocation  } from '@angular/router';
import { routes } from './app.routes';

export const appConfig = {
  providers: [provideRouter(routes, withHashLocation())] 
};
