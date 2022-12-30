import { Injectable } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';
import { DevicesList } from '@shared/configurations/devicesList';
import { IDeviceList } from '@shared/models/Device/device.list.model';

/**
 * Permet de gérer les sorties d'écran et/ou les fermetures de fenêtre
 */
@Injectable({
  providedIn: 'root',
})
export class PageOrAppQuitService {
  private devicesList: IDeviceList[] = DevicesList;

  constructor() {}

  /**
   * Permet d'extraire la route d'une URL
   *
   * A partir d'une URL comme celle-là : /Fpf18176SpringcoreH518PuckComponent/0/0/d948911c-06d8-8895-f5ef-d2fb4f717558
   * On va retourner Fpf18176SpringcoreH518PuckComponent
   * Et à partir de /savewrite/0/0/Fpf18176SpringcoreH518PuckComponent/d948911c-06d8-8895-f5ef-d2fb4f717558
   * On va retourner savewrite
   *
   * @param url l'URL dont on souhaite récupérer la route
   */
  private extractRouteFromUrl(url: string): string {
    const parts = url.trim().toLowerCase().split('/');
    if (parts.length === 0) {
      console.error(url);
      throw new Error("Error, it's not possible to extract parts of the URL");
    }
    if (parts[0] !== '/' && parts[0].trim() !== '') {
      return parts[0].trim().toLowerCase();
    } else {
      if (typeof parts[1] !== 'undefined') {
        return parts[1].trim().toLowerCase();
      } else {
        return '';
      }
    }
  }

  /**
   * Est-ce qu'on a besoin de demander une confirmation à l'utilisateur lorsqu'il
   * quitte un écran de configuration ?
   */
  needConfirmationBeforeToLeaveConfiguration(nextState?: RouterStateSnapshot): boolean {
    if (!nextState) {
      return false;
    }
    // Liste des URL qu'on ne peut pas rechercher dynamiquement
    const staticUrls = ['templates', 'savewrite'];
    const nextUrl = nextState.url;
    const nextRoute = this.extractRouteFromUrl(nextUrl);
    for (const staticUrl of staticUrls) {
      if (staticUrl.trim().toLowerCase() === nextRoute) {
        return false;
      }
    }
    // Si on est encore là c'est qu'il faut chercher dans les composants des périphériques
    for (const device of this.devicesList) {
      if (device.component.trim().toLowerCase() === nextRoute) {
        return false;
      }
    }
    return true;
  }
}
