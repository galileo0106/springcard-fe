import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router'; // NavigationStart,
import { doWeUseWebsocket } from '@shared/appSettings';
import { IPongresponse } from '@shared/models/ipong.response.model';
import { AuthService } from '@shared/services/AuthService';
import { ServiceService } from '@shared/services/service.service';
import { Subscription } from 'rxjs';
import { setUserInformation } from '@shared/appSettings';
import { IServiceLastVersion } from '@shared/models/iservice.last.version.interface';
import { SettingsService } from '@shared/services/settings.service';
/**
 * Main component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  loading = { isLoading: true, header: "", description: "" };
  serviceTested = false;
  doNotTestServiceVersion = false;
  serviceDetected = true;
  serviceIsDeprecated = false;
  showDownloadCard = false;
  showChat = false;
  timer: ReturnType<typeof setTimeout> | null = null;
  isWebsocketUsed = true;
  showLeftMenu = true;
  runningVersion = '';
  currentVersion = '';
  isMemberOfTeam = false;
  isSingleAccount = false;
  isRunningWithoutService = false;
  openSideMenu = {
    devices: true,
    configurations: true,
    exploreAndLean: true,
    realtimeEvent: true,
    supportCenter: true,
    springcard: true,
    more: true,
  }
  private authSubscription: Subscription; // Surveille le changement d'état de la connexion utilisateur

  public constructor(
    private titleService: Title,
    private serviceInformation: ServiceService,
    public authService: AuthService,
    private router: Router,
    private settings: SettingsService,
  ) {
    this.titleService.setTitle($localize`SpringCard Companion`);
  }

  ngOnInit(): void {
    (async () => {
      this.loading = { isLoading: true, header: $localize`Connected to SpringCard Companion`, description: '' }
      this.loadSettings();
      this.monitorAuthenticationChages();
      this.isWebsocketUsed = doWeUseWebsocket();
      if (!this.authService.hasValidatedCGU())
        this.router.navigate(['/welcome']);
      await this.testIfServiceAvailable();
      await this.getUserInformationFromService();
      this.showLeftMenu = this.authService.isLoggedIn();
      this.isMemberOfTeam = this.authService.getType() === 2 ? true : false;
      this.isSingleAccount = this.authService.getType() === 1 ? true : false;
      this.loading = { isLoading: false, header: "", description: "" };
    })();

  }

  delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  // Surveille les changements d'authentification
  monitorAuthenticationChages() {
    this.authSubscription = this.authService.getAlert().subscribe(() => {
      this.isMemberOfTeam = this.authService.getType() === 2 ? true : false;
      this.isSingleAccount = this.authService.getType() === 1 ? true : false;
      this.showLeftMenu = this.authService.isLoggedIn();
      if (this.showLeftMenu && !this.serviceTested) this.testIfServiceAvailable();
    })
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  setOpenSideMenu(name: "devices" | "configurations" | "exploreAndLean" | "realtimeEvent" | "supportCenter" | "springcard" | "more"): void {
    switch (name) {
      case "devices":
        this.openSideMenu.devices = !this.openSideMenu.devices;
        break;
      case "configurations":
        this.openSideMenu.configurations = !this.openSideMenu.configurations;
        break;
      case "exploreAndLean":
        this.openSideMenu.exploreAndLean = !this.openSideMenu.exploreAndLean;
        break;
      case "realtimeEvent":
        this.openSideMenu.realtimeEvent = !this.openSideMenu.realtimeEvent;
        break;
      case "supportCenter":
        this.openSideMenu.supportCenter = !this.openSideMenu.supportCenter;
        break;
      case "springcard":
        this.openSideMenu.springcard = !this.openSideMenu.springcard;
        break;
      case "more":
        this.openSideMenu.more = !this.openSideMenu.more;
        break;
      default:
        break;
    }
  }

  // Retrouve les informations de l'utilisateur pour les stocker globalement
  async getUserInformationFromService() {
    try {
      if (this.isRunningWithoutService) return;
      this.loading.description = $localize`Please wait a few seconds while we are detecting system information...`
      const systemInformation: any = await this.serviceInformation.getSystemInformation().toPromise();
      const machineName = systemInformation.hasOwnProperty('MachineName') ? systemInformation['MachineName'] : '';
      const computerName = systemInformation.hasOwnProperty('ComputerName') ? systemInformation['ComputerName'] : '';
      const userName = systemInformation.hasOwnProperty('UserName') ? systemInformation['UserName'] : '';
      setUserInformation(machineName, computerName, userName);
    } catch (error) {
      console.error(error)
    }
  }

  // Est-ce que la version courante du service est à jour ?
  async isServiceVersionUpToDate(localServiceVersion: IPongresponse) {
    try {
      if (this.doNotTestServiceVersion) return;
      this.loading.description = $localize`Please wait a few seconds while we are checking the Companion Service version...`
      const lastServiceVersion: IServiceLastVersion = await this.serviceInformation.getLastVersionNumber().toPromise();
      this.serviceIsDeprecated = false;
      if (this.serviceInformation.isServiceVersionOlderThanProductionVersion(localServiceVersion.Version, lastServiceVersion.version)) {
        this.serviceIsDeprecated = true;
        this.runningVersion = localServiceVersion.Version;
        this.currentVersion = lastServiceVersion.version;
        throw new Error('Service is deprecated!')
      }
      this.loading.description = $localize`Companion Service has been detected, loading the application...`

    } catch (error) {
      console.error(error)
    }
  }

  async testIfServiceAvailable() {
    try {
      // if (!this.authService.isLoggedIn()) return;
      this.loading.description = $localize`Please wait a few seconds while we are detecting the Companion Service...`
      if (this.isRunningWithoutService) return;
      const response: IPongresponse = await this.serviceInformation.getServiceInformation().toPromise();
      this.serviceTested = true;
      this.serviceDetected = true;
      await this.isServiceVersionUpToDate(response);
    } catch (error) {
      this.serviceTested = true;
      console.error(error);
      this.serviceDetected = false;
    }
  }

  skipServiceVersion() {
    this.doNotTestServiceVersion = true;
    this.serviceIsDeprecated = false;
  }

  async updateService() {
    try {
      if (this.doNotTestServiceVersion) return;
      this.loading = {
        isLoading: true,
        header: $localize`Updating the Service`,
        description: $localize`Please wait will the SpringCard Companion Service is updated to a new version ` + this.currentVersion + "...."
      }
      if (this.timer === null) {
        this.timer = setInterval(async () => {
          try {
            const response: IPongresponse = await this.serviceInformation.getServiceInformation().toPromise();
            const lastServiceVersion: IServiceLastVersion = await this.serviceInformation.getLastVersionNumber().toPromise();
            if (this.timer !== null && response.Version === lastServiceVersion.version) {
              this.currentVersion = lastServiceVersion.version;
              this.serviceIsDeprecated = false;
              this.serviceDetected = true;
              this.serviceTested = true;
              this.loading.description = $localize`Companion service updated successfully!`
              await this.delay(2000);
              clearInterval(this.timer);
              this.loading = {
                isLoading: false,
                header: "",
                description: ""
              }
            }
          } catch {
            this.serviceTested = true;
            this.serviceDetected = false;
          }
        }, 5000);
      }
    } catch {

    }
  }

  async startService() {
    try {
      this.loading = {
        isLoading: true,
        header: $localize`Opening Companion Service`,
        description: $localize`Please wait a few seconds while we are opening the Companion Service...`
      }

      if (this.timer === null) {
        this.timer = setInterval(async () => {
          try {
            const response = await this.serviceInformation.getServiceInformation().toPromise();
            this.serviceTested = true;
            this.serviceDetected = true;
            this.loading.description = $localize`Companion service opened successfully!`
            if (this.timer !== null) {
              clearInterval(this.timer);
              await this.isServiceVersionUpToDate(response);
              this.loading = { isLoading: false, header: "", description: "" }
            };
          } catch {
            this.serviceTested = true;
            this.serviceDetected = false;
          }
        }, 5000);
      }
    } catch {

    }

  }

  runOnMacOs() {
    this.isWebsocketUsed = false;
    this.doNotTestServiceVersion = true;
    this.showLeftMenu = true;
    this.serviceDetected = true;
    this.settings.set('runWithoutService', 'true');
    this.loadSettings();
  }

  private loadSettings(): void {
    this.isRunningWithoutService = this.settings.getBoolean('runWithoutService', false);
  }

  reuseService(): void {
    this.settings.set('runWithoutService', false.toString());
    this.isRunningWithoutService = false;
  }
}
