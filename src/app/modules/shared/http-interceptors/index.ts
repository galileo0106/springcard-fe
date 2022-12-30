import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceInterceptor } from './service.interceptor';

/**
 * Http interceptor providers in outside-in order
 */
export const httpInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: ServiceInterceptor, multi: true }];
