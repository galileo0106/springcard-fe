import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fromIso8601toJsDate, getServiceUrl } from '@shared/appSettings';
import { IAuthSubject } from '@shared/models/User/iauthsubject.model';
import { ICanDoSomethingJsonResponse } from '@shared/models/icandosomethingjsonresponse.model';
import { IChangeTeamMemberStatus } from '@shared/models/Team/ichangeteammemberstatus.model';
import { IJsonSuccessResponse } from '@shared/models/ijson.success.response.model';
import { IJwtError } from '@shared/models/IJwtError.model';
import { ITeamMemberInvitation } from '@shared/models/Team/iteammemberinvitation.model';
import { IUpdateProfile } from '@shared/models/User/iupdateprofile.model';
import { IJsonResponse } from '@shared/models/jsonresponse.model';
import { IJwt } from '@shared/models/jwt.model';
import { IMe } from '@shared/models/User/me.model';
import { IRegisterUser } from '@shared/models/User/registeruser.model';
import { IRequestNewPassword } from '@shared/models/User/requestnewpassword.model';
import { ISetNewPassword } from '@shared/models/User/setnewpassword.model';
import { IChangePassword } from '@shared/models/User/changepassword.model';
import { IUserHistory } from '@shared/models/User/iuserhistory.model';
import { ISupport } from '@shared/models/support.model';
import { Observable,Subject } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { INewHistory } from '@shared/models/User/inewhistory.model';

/**
 * Gère l'authentification et les authorisations
 */
@Injectable()
export class AuthService {
  private subject = new Subject<any>();

  constructor(private http: HttpClient) {}

  // Connexion via login/mot de passe
  public login(email: string, password: string, rememberPassword: boolean = false): Observable<IJwt | IJwtError> {
    if (rememberPassword) {
      try {
        localStorage.setItem('sc_password', this.str_rot13(password));
      } catch (error) {
        console.error("Can't save the password in the local storage");
      }
    }
    const route = getServiceUrl('BACKEND_URL') + 'users/login';
    return this.http.post<IJwt | IJwtError>(route, { email, password }); // JWT = réponse attendue  -   .pipe(tap(res => this.saveSession(res)));
  }

  public getPasswordFromSession(): string {
    const password = localStorage.getItem('sc_password');
    if (password) {
      return this.str_rot13(password);
    } else {
      return '';
    }
  }

  private str_rot13(str: string) {
    return (str + '').replace(/[a-zA-Z]/gi, (s) => {
      return String.fromCharCode(s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13));
    });
  }

  // Enrgistrement des informations de connexion dans la local storage
  public saveSession(authResult: IJwt) {
    try {
      localStorage.setItem('sc_jwt', authResult.token);
      localStorage.setItem('sc_expires_at', authResult.expire); // Date d'expiration du token
      localStorage.setItem('sc_email', authResult.email);
      localStorage.setItem('sc_isSocialAccount', authResult.isSocialAccount.toString());
      localStorage.setItem('sc_socialProvider', authResult.socialProvider);
      localStorage.setItem('sc_type', authResult.type.toString());
      localStorage.setItem('sc_admin', authResult.isAdmin.toString());
      if (authResult.expiration_date) {
        // Date d'expiration du compte
        localStorage.setItem('sc_expiration', authResult.expiration_date);
      }
    } catch (error) {
      console.error("Can't write the user information in the local storage");
    }
  }

  public markUserAsLogged() {
    localStorage.setItem('sc_logged', true.toString());
  }

  public markUserAsLoggedOut() {
    localStorage.setItem('sc_logged', false.toString());
  }

  // Retourne la date d'expiration du compte
  public getAccountExpirationDate(): Date {
    const expiration = localStorage.getItem('sc_expiration');
    if (expiration) {
      return fromIso8601toJsDate(expiration, true);
    }
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow;
  }

  public daysBetween(startDate: Date, endDate: Date): number {
    const diffInMs = endDate.getTime() - startDate.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }

  // Est-ce que le compte expire dans les 30 jours ?
  public accountExpiresNextMonth(): boolean {
    return this.daysBetween(new Date(), this.getAccountExpirationDate()) <= 30 ? true : false;
  }

  // Est-ce que le compte est expiré ?
  public accountIsExpired(): boolean {
    const today = new Date();
    return today > this.getAccountExpirationDate() ? true : false;
  }

  // Retourne la date d'expiration du JWT
  public getTokenExpiration(): Date {
    const expiration = localStorage.getItem('sc_expires_at');
    if (expiration) {
      return fromIso8601toJsDate(expiration, true);
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }

  // Type de compte, 0=Gratuit, 1=Single, 2=Team
  public getType(): number {
    const type = localStorage.getItem('sc_type');
    return type === null ? 0 : parseInt(type, 10);
  }

  // Est-ce que le compte de l'utilisateur courant est un compte admin d'équipe ?
  public isAdmin(): boolean {
    const isAdmin = localStorage.getItem('sc_admin');
    if (isAdmin === null) {
      return false;
    }
    return isAdmin.trim().toLowerCase() === 'true' ? true : false;
  }

  // Retourne le type de compte sour la forme d'un libellé
  public getTypeAsString(): string {
    const type = localStorage.getItem('sc_type');
    if (!type || type === null || type == undefined) {
      return '';
    }
    let typeLabel = '';
    switch (parseInt(type, 10)) {
      case 0:
        typeLabel = 'free';
        break;
      case 1:
        typeLabel = 'single';
        break;
      case 2:
        typeLabel = 'team';
        break;
      default:
        typeLabel = 'free';
        break;
    }
    return typeLabel;
  }

  // Mise en place du type de compte à partir des données retournée par GET /me
  public setTypeFromString(type: string) {
    let numeralType = 0;
    switch (type.toLowerCase().trim()) {
      case 'free':
        numeralType = 0;
        break;

      case 'single':
        numeralType = 1;
        break;

      case 'team':
        numeralType = 2;
        break;

      default:
        numeralType = 0;
        break;
    }
    localStorage.setItem('sc_type', numeralType.toString());
  }

  // Est-ce qu'on a des informations d'une précédente connexion ?
  public hasPreviousLoginInformation(): boolean {
    return localStorage.getItem('sc_email') === null ? false : true;
  }

  // Est-ce que la précédent connexion a été faite via un réseau social ?
  public previousConnectionWasMadeWithSocialProvider(): boolean {
    const isSocialAccount = localStorage.getItem('sc_isSocialAccount');
    if (isSocialAccount === null) {
      return false;
    }
    return isSocialAccount === 'true' ? true : false;
  }

  // Retourne l'URL à utiliser pour se connecter via un réseau social
  public getSocialAccountLoginUrl(defaultSocialProvider = ''): string {
    let socialProvider = '';
    if (defaultSocialProvider.trim() !== '') {
      socialProvider = defaultSocialProvider;
    } else {
      const sc_socialProvider = localStorage.getItem('sc_socialProvider');
      if (sc_socialProvider === null) {
        return '';
      }
      socialProvider = sc_socialProvider;
    }

    let url = '';
    switch (socialProvider.trim().toLowerCase()) {
      case 'google':
        url = environment.googleOAuthUrl;
        break;

      default:
        url = '';
        break;
    }
    return url;
  }

  // Lance la connexion ou la création de compte à l'aide d'un réseau social
  public loginWithSocialProvider(socialProvider = '') {
    const route = this.getSocialAccountLoginUrl(socialProvider);
    return this.http.post<IJwt | IJwtError>(route, {});
  }

  public logout() {
    localStorage.removeItem('sc_jwt');
    localStorage.removeItem('sc_expires_at');
    localStorage.removeItem('sc_password');
    this.markUserAsLoggedOut();
  }

  private isTokenExpired(): boolean {
    const today = new Date(); // Date.now() - 3000
    return today < this.getTokenExpiration() ? true : false;
  }

  public isLoggedIn(): boolean {
    return this.isTokenExpired();
    /*const isLogged = localStorage.getItem('sc_logged');
    if (isLogged === null) {
      return this.isTokenExpired();
    }
    if (isLogged === 'true' && !this.isTokenExpired()) {
      return true;
    }
    return false;*/
  }

  public isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  public getEmailFromSession(): string {
    const email = localStorage.getItem('sc_email');
    if (email) {
      return email;
    } else {
      return '';
    }
  }

  // Utilisé pour créer un nouveau compte
  public register(userinfo: IRegisterUser): Observable<IJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users';
    return this.http.post<IJsonResponse>(route, userinfo);
  }

  // Mise à jour de son compte
  public updateProfile(userInfo: IUpdateProfile): Observable<IJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users/me';
    return this.http.put<IJsonResponse>(route, userInfo);
  }

  // Utilisé pour faire une demande de support
  public support(supportRequest: ISupport): Observable<IJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users/support';
    return this.http.post<IJsonResponse>(route, supportRequest);
  }

  // Demande de nouveau mot de passe
  public requestNewPassword(requestNewPassword: IRequestNewPassword): Observable<IJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users/lost-password';
    return this.http.post<IJsonResponse>(route, requestNewPassword);
  }

  public setNewPassword(setNewPassword: ISetNewPassword): Observable<IJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users/lost-password';
    return this.http.put<IJsonResponse>(route, setNewPassword);
  }

  public changePassword(changePassword: IChangePassword): Observable<IJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users/changepassword';
    return this.http.put<IJsonResponse>(route, changePassword);
  }

  // Get curent user's informations
  public me(): Observable<IMe> {
    const route = getServiceUrl('BACKEND_URL') + 'users/me';
    return this.http.get<IMe>(route);
  }

  public history(): Observable<any> {
    const route = getServiceUrl('BACKEND_URL') + 'users/history';
    return this.http.get<IUserHistory>(route);
  }

  public setHistory(setHistory: INewHistory): Observable<any> {
    const route = getServiceUrl('BACKEND_URL') + 'users/history';
    return this.http.put<IJsonResponse>(route, setHistory);
  }

  public getJWT(): string | boolean {
    if (!this.isLoggedIn()) {
      return false;
    }

    if (localStorage.getItem('sc_jwt')) {
      return localStorage.getItem('sc_jwt') as string;
    } else {
      return false;
    }
  }

  public hasValidatedCGU() {
    return localStorage.getItem('sc_accept_cgu') ? true : false;
  }

  public acceptCGU() {
    try {
      localStorage.setItem('sc_accept_cgu', 'true');
    } catch (error) {
      console.error("Can't write the sc_accept_cgu in the local storage");
    }
  }

  // Est-ce que l'utilisateur peut toujours flasher un produit ?
  public canFlashProducts(): Observable<ICanDoSomethingJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users/canflash';
    return this.http.get<ICanDoSomethingJsonResponse>(route);
  }

  // Est-ce que l'utilisateur peut encore charger une configuration dans un lecteur ?
  public canLoadConfiguration(): Observable<ICanDoSomethingJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users/canloadconfiguration';
    return this.http.get<ICanDoSomethingJsonResponse>(route);
  }

  // Est-ce que l'utilisateur peut encore créer une configuration dans un lecteur ?
  public canCreateConfiguration(): Observable<ICanDoSomethingJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users/cancreateconfiguration';
    return this.http.get<ICanDoSomethingJsonResponse>(route);
  }

  // Est-ce que l'utilisateur peut envoyer une configuration à un autre utilisateur ?
  public canSendConfiguration(): Observable<ICanDoSomethingJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users/cansendconfigurationtoother';
    return this.http.get<ICanDoSomethingJsonResponse>(route);
  }

  // Est-ce que l'utilisateur peut entrer des données d'inventaire ?
  public canEnterInventoryData(): Observable<ICanDoSomethingJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users/canenterinventorydata';
    return this.http.get<ICanDoSomethingJsonResponse>(route);
  }

  // Retourne la liste des membres de l'équipe en excluant l'utilisateur courant
  public getTeamMembersList(withMe = false): Observable<IMe[]> {
    let httpParams = new HttpParams();
    if (withMe) {
      httpParams = httpParams.append('withMe', true.toString());
    }

    const route = getServiceUrl('BACKEND_URL') + 'teams/members';
    return this.http.get<IMe[]>(route, { params: httpParams });
  }

  // Invitation pour qu'un membre rejoigne une équipe
  public inviteTeamMember(invitation: ITeamMemberInvitation): Observable<IJsonSuccessResponse | IJwtError> {
    const route = getServiceUrl('BACKEND_URL') + 'teams/invitation';
    return this.http.post<IJsonSuccessResponse | IJwtError>(route, invitation);
  }

  // Change le statut d'administrateur d'un utilisateur
  public changeTeamUserAdminStatus(newStatus: IChangeTeamMemberStatus): Observable<IJsonSuccessResponse | IJwtError> {
    const route = getServiceUrl('BACKEND_URL') + 'teams/admin';
    return this.http.post<IJsonSuccessResponse | IJwtError>(route, newStatus);
  }

  // Supprime un membre de l'équipe
  public deleteTeamUser(email: string): Observable<IJsonSuccessResponse | IJwtError> {
    const route = getServiceUrl('BACKEND_URL') + 'teams/members/' + email;
    return this.http.delete<IJsonSuccessResponse | IJwtError>(route);
  }

  // Est-ce que l'utilisateur peut supprimer son compte ?
  public canRemoveMyAccount(): Observable<ICanDoSomethingJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users/canremove';
    return this.http.get<ICanDoSomethingJsonResponse>(route);
  }

  // Supprime le compte de l'utilisateur courant
  public deleteMe(): Observable<IJsonSuccessResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users';
    return this.http.delete<IJsonSuccessResponse>(route);
  }

  //#region Observation de l'état de connexion de l'utilisateur
  // Utilisé par le composant de pied de page pour mettre à jour l'état de connexion de l'utilisateur
  public getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  private sendSubject(parameters: IAuthSubject) {
    this.subject.next({ type: parameters['type'], text: parameters['text'] });
  }

  // Envoie un message de succès quand quelque chose de relatif à l'utilisateur se passe bien
  public success(message: string) {
    this.sendSubject({ type: 'success', text: message });
  }

  // Envoie un message d'erreur quand quelque chose de relatif à l'utilisateur se passe mal
  public error(message: string) {
    this.sendSubject({ type: 'error', text: message });
  }

  // Simule la suppression des messages en envoyant un next() sans paramètres
  public clear() {
    this.subject.next();
  }
  //#endregion
}
