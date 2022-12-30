import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getServiceUrl } from '@shared/appSettings';
import { AuthService } from '@shared/services/AuthService';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Intercept the traffic between this app and the service
 */
@Injectable()
export class ServiceInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  private isCallToBackend(url: string) {
    return url.startsWith(getServiceUrl('BACKEND_URL')) ? true : false;
  }

  // Is the route called is a route that does not require JWT ?
  private isRouteWithoutJWT(req: HttpRequest<any>): boolean {
    const routeMethod = req.method.trim().toLowerCase();
    const routeUrl = req.url.trim().toLowerCase();
    // List all routes that do not require JWT
    const routesWithoutJWT = [
      {
        routePattern: '(/users)$', // Add user
        routeMethod: 'post',
      },
      {
        routePattern: '(/lost-password)$',
        routeMethod: 'put',
      },
      {
        routePattern: '(/lost-password)$',
        routeMethod: 'post',
      },
      {
        routePattern: '(/login)$', // @todohth, c'est encore utile ?
        routeMethod: 'post',
      },
      {
        routePattern: '(/validate)$',
        routeMethod: 'get',
      },
    ];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < routesWithoutJWT.length; i++) {
      const method = routesWithoutJWT[i].routeMethod.trim().toLowerCase();
      if (routeMethod !== method) {
        continue;
      }
      const regex = RegExp(routesWithoutJWT[i].routePattern);
      if (regex.test(routeUrl)) {
        return true;
      }
    }
    return false;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isCallToBackend(req.url)) {
      return next.handle(req);
    }

    if (this.isRouteWithoutJWT(req)) {
      return next.handle(req);
    }

    const jwt = this.auth.getJWT();
    if (jwt) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + jwt),
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 402) {
            this.router.navigate(['account']);
          }
          if (error.status === 401) {
            //alert("Redirection 1 vers /user");
            this.router.navigate(['user']);
          }
          return throwError(error);
        }),
      );
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 402) {
          this.router.navigate(['account']);
        }
        if (error.status === 401) {
          //alert("Redirection 2 vers /user");
          this.router.navigate(['user']);
        }
        return throwError(error);
      }),
    );
  }
}
