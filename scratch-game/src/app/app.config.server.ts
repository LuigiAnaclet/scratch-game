import { mergeApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

const serverConfig = {
  providers: [provideRouter(routes)]
};

export const config = mergeApplicationConfig(serverConfig);
