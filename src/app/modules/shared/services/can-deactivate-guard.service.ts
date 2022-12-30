import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface IIsDirty {
  isDirty(
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ): boolean | Observable<boolean>;
}

/**
 * Permet aux composants (pour l'instant des templates et des lecteurs) de ne pas quitter une route sans demander, éventuellement, une confirmation.
 * Le typique, "voulez-vous quitter cette page sans sauvegarder"
 */
@Injectable({
  providedIn: 'root',
})
export class IsNotDirtyGuard implements CanDeactivate<IIsDirty> {
  canDeactivate(
    component: IIsDirty,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.isDirty(currentRoute, currentState, nextState);
  }
}
