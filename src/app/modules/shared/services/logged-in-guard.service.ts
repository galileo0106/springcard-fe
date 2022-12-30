import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@shared/services/AuthService';
import { Observable } from 'rxjs';

/**
 * Protège les routes où l'utilisateur doit être connecté
 */
@Injectable({
  providedIn: 'root',
})
export class LoggedInGuardService implements CanActivate {
  // @ts-ignore
  canActivate(state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    //return this.authService.isLoggedIn() || this.router.parseUrl('/user');
    return this.authService.isLoggedIn() || this.router.createUrlTree(['/login'], { queryParams: { redirectURL: state.url } });
  }

  constructor(private router: Router, private authService: AuthService) {}
}
