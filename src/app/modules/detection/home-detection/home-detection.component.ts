import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { doWeUseWebsocket, getUserInformation, searchForAppSettings } from '@shared/appSettings';
import { Device } from '@shared/classes/Device';
import { IDeviceSeen } from '@shared/models/Device/device.seen.model';
import { IButtonClick } from '@shared/models/UI/ibuttonclick.model';
import { IServiceSettings } from '@shared/models/iservicesettings.model';
import { IDevicesSeenConfigurations } from '@shared/models/Configuration/idevicesseenconfigurations';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { ControlService } from '@shared/services/control.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { SettingsService } from '@shared/services/settings.service';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { WsService } from '@shared/services/ws.service';
import { Subscription } from 'rxjs';
import { DetectionService } from '../detection.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IconsList } from '@shared/configurations/iconsList';

/**
 * Détection des périphériques connectés
 */
@Component({
  selector: 'app-home-detection',
  templateUrl: './home-detection.component.html',
  styleUrls: ['./home-detection.component.scss'],
})
export class HomeDetectionComponent implements OnInit, OnDestroy {
  channel = 'all';
  devices$: Device[] = [];
  devicesDetected = false;
  errorWhileDetecting = false;
  errorGettingSerialPorts = false;
  errorMessage = '';
  isWebsocketUsed = true;
  IsSerialEnabled = false;
  IsNetworkEnabled = false;
  userCanEnterInventoryData = false;
  isRunningWithoutService = false;
  deviceType: string = ""

  private topButtons = Array<ITopButton>();
  private buttonsClickSubscriber: Subscription;
  private devicesListChangeSubscription: Subscription;
  public serialPorts: any;

  constructor(
    public dialog: MatDialog,
    private detectService: DetectionService,
    private controlService: ControlService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private topButtonsService: TopButtonsService,
    private currentTitleService: CurrentTitleService,
    private activatedRoute: ActivatedRoute,
    private wsService: WsService,
    private authService: AuthService,
    private settings: SettingsService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.currentTitleService.changeTitle($localize`Connected Devices`);
    this.isWebsocketUsed = doWeUseWebsocket();
    this.deviceType = this.activatedRoute.snapshot.params['device-type'];
  }

  ngOnInit() {
    searchForAppSettings(this.activatedRoute); // Recherche d'une éventuelle MAJ des paramètres d'hôtes (serveur Rest et WS)
    this.loadSettings();
    this.setTopButtons();
    this.getDevicesList();
    this.getServiceSettings();
    this.listenDevicesListChanges();
    this.canEnterInventoryData();
    this.getSerialPorts();
  }

  ngOnDestroy() {
    if (this.buttonsClickSubscriber) {
      this.buttonsClickSubscriber.unsubscribe();
    }
    this.topButtonsService.removeTopButtons();
    if (this.devicesListChangeSubscription) {
      this.devicesListChangeSubscription.unsubscribe();
    }
  }

  openDialog(value: "serial" | "network") {
    var ref: any;
    if (value === "serial") {
      ref = this.dialog.open(FindSerialDialog, { minWidth: '400px', data: { serialPorts: this.serialPorts } });
    } else if (value === "network") {
      ref = this.dialog.open(FindNetworkDialog, { minWidth: '400px' });
    }
    ref.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getDevicesList();
      }
    })
  }

  getSerialPorts() {
    this.detectService.getSerialPorts().subscribe({
      next: (ports: any) => {
        this.errorGettingSerialPorts = false;
        this.serialPorts = ports;
      },
      error: (error) => {
        this.errorGettingSerialPorts = true;
        console.error('Error while getting the list of serial ports', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for the serial ports:` + '\n\n' + error.message;
        this.errorMessage = error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getSerialPorts();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
      complete: () => void 0,
    })
  }

  setTopButtons() {
    this.topButtons = [
      {
        label: $localize`Refresh List`,
        color: 'warm',
        type: 'icon-button',
        id: 'refreshList',
        icon: 'refresh',
        tooltip: $localize`Refresh now`
      },
    ];

    // Set buttons in the top of the screen
    this.topButtonsService.setTopButtons(this.topButtons);

    // And subscribe to their clicks
    this.buttonsClickSubscriber = this.topButtonsService.buttonsClicks.subscribe((buttonParameters: IButtonClick) => {
      switch (buttonParameters.id) {
        case 'refreshList':
          this.getDevicesList();
          break;
      }
    });
  }

  loadSettings() {
    this.isRunningWithoutService = this.settings.getBoolean('runWithoutService', false);
    if (this.isRunningWithoutService) {
      this.router.navigate(['/configure']);
    }
  }

  configureIndividuals(deviceId: string) {
    this.navigateTo(deviceId, 'individuals');
  }

  getServiceSettings() {
    this.detectService.getServiceSettings().subscribe({
      next: (settings: IServiceSettings) => {
        this.IsNetworkEnabled = settings.NetworkEnabled == undefined ? false: settings.NetworkEnabled;
        this.IsSerialEnabled = settings.SerialEnabled == undefined ? false: settings.SerialEnabled;
      },
      error: () => {
        this.snackBar.open($localize`An error occurred while reading service settings.`, $localize`Success`, {
          duration: 3000,
          panelClass: "snackbar-error",
        });
      },
    })
  }

  addBinding(deviceId: string) {
    this.detectService.addBinding(deviceId).subscribe({
      next: () => {
        this.snackBar.open($localize`Binding successfully.`, $localize`Success`, {
          duration: 3000,
          panelClass: "snackbar-information",
        });
        this.getDevicesList();
      },
      error: () => {
        this.snackBar.open($localize`An error occurred while binding.`, $localize`Success`, {
          duration: 3000,
          panelClass: "snackbar-error",
        });
      },
      complete: () => void 0,
    })
  }
  deleteBinding(deviceId: string) {
    this.detectService.deleteBinding(deviceId).subscribe({
      next: () => {
        this.snackBar.open($localize`Unbinding successfully.`, $localize`Success`, {
          duration: 3000,
          panelClass: "snackbar-information",
        });
        this.getDevicesList();
      },
      error: () => {
        this.snackBar.open($localize`An error occurred while unbinding the device.`, $localize`Success`, {
          duration: 3000,
          panelClass: "snackbar-error",
        });
      },
      complete: () => void 0,
    })
  }
  getDevicesList() {
    if (this.isRunningWithoutService) {
      return;
    }
    this.errorWhileDetecting = false;
    this.devicesDetected = false;
    this.errorMessage = '';
    this.detectService.getDevicesList().subscribe({
      next: (devices: Device[]) => {
        const userInfo = getUserInformation();
        this.devices$ = devices;
        if (this.deviceType === "binding")
          this.devices$ = devices.filter((device) => device.Binding === "bound")
        const devicesSeen: IDeviceSeen[] = [];
        this.devices$.forEach((device) => {
          if (device.Name && device.UniqueId) {
            const deviceSeen: IDeviceSeen = {
              Firmware: device.Firmware,
              Hardware: device.Hardware,
              Name: device.Name,
              UniqueId: device.UniqueId,
              Version: device.Version,
              NumericalVersion: device.NumericalVersion,
              Location: device.Location,
              Inventory: device.Inventory,
              Profile: device.Profile,
              Mode: device.Mode,
              MachineName: userInfo.MachineName,
              ComputerName: userInfo.ComputerName,
              UserName: userInfo.UserName,
            };
            if (device.hasOwnProperty('ConfigId')) {
              deviceSeen.ConfigId = device.ConfigId;
            }
            devicesSeen.push(deviceSeen);
          }
        });
        if (devicesSeen.length > 0) {
          this.detectService.sendUserDevicesSeen(devicesSeen).subscribe({
            next: (devicesLastConfiguration: IDevicesSeenConfigurations) => {
              {
                if (!devicesLastConfiguration.configurations) {
                  return;
                }
                const newDevices: Device[] = [];
                for (const device of this.devices$) {
                  for (const deviceLastConfiguration of devicesLastConfiguration.configurations) {
                    if (deviceLastConfiguration.UniqueId === device.UniqueId) {
                      device.lastConfigurationId = deviceLastConfiguration.configurationId;
                    }
                  }
                  newDevices.push(device);
                }
                this.devices$ = newDevices;
              }
            },
            error: () => {
              console.error('Error while sending the list of devices seen');
            },
          });
        }

        this.devicesDetected = true;
      },
      error: (error) => {
        this.errorWhileDetecting = true;
        console.error('Error while getting the list of detected devices', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for the devices list:` + '\n\n' + error.message;
        this.errorMessage = error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getDevicesList();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
      complete: () => void 0, // Voilà comment ne rien faire en JS...
    });
  }

  getDeviceIcon(device: Device, type: Number) {
    let iconName = 'blank';
    IconsList.forEach((deviceIcon) => {
      if ( deviceIcon.title == device.Name ) {
        if ( type == 1 )
          iconName = deviceIcon.icon;
        deviceIcon.mode.forEach((modeItem) => {
          if ( modeItem.value == device.Mode && type == 2 )
            iconName = modeItem.icon;
        })
        deviceIcon.channel.forEach((channelItem) => {
          if ( channelItem.value == device.Channel && type == 3 )
            iconName = channelItem.icon;
        })
      }
    })
    return iconName;
  }

  winkDevice(deviceId: string) {
    this.controlService.winkDevice(deviceId).subscribe(
      (response) => {
        let message = '';
        let title = '';
        if (response.Result === 'success') {
          message = $localize`wink sent successfully`;
          title = $localize`Success`;
        } else {
          message = $localize`wink sent unsuccessfully`;
          title = $localize`Fail`;
        }
        this.snackBar.open(message, title, {
          duration: 4000,
        });
      },
      () => {
        this.dialogsService
          .retryQuit($localize`Error during wink`, $localize`There was an error while asking the reader to wink`)
          .subscribe({
            next: (button) => {
              if (button === 'retry') {
                this.winkDevice(deviceId);
              } else {
                this.app.appQuitOrCancel();
              }
            },
          });
      },
    );
  }

  changeReaderStatus(deviceId: string, status: string) {
    const verb = status === 'start' ? 'started' : 'stopped';
    this.controlService.setReaderStatus(deviceId, status).subscribe(
      (response) => {
        let message = '';
        let title = '';
        if (response.Result === 'success') {
          message = `Device ${verb} successfully`;
          title = `Success`;
        } else {
          message = `Device NOT ${verb} successfully`;
          title = `Fail`;
        }
        this.snackBar.open(message, title, {
          duration: 4000,
        });
      },
      () => {
        this.dialogsService.retryQuit(`Error`, `There was an error while changing the reader's state`).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.changeReaderStatus(deviceId, status);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  beepReader(deviceId: string): void {
    this.controlService.beepDevice(deviceId).subscribe(
      (response) => {
        let message = '';
        let title = '';
        if (response.Result === 'success') {
          message = $localize`Beep sent successfully`;
          title = $localize`Success`;
        } else {
          message = $localize`Beep sent unsuccessfully`;
          title = $localize`Fail`;
        }
        this.snackBar.open(message, title, {
          duration: 4000,
        });
      },
      () => {
        this.dialogsService.retryQuit($localize`Error`, $localize`There was an error while asking the reader to beep`).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.beepReader(deviceId);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  navigateTo(deviceId: string, url: string, readerId?: string) {
    const link = ['/' + url, deviceId];
    if (readerId) {
      link.push(readerId);
    }
    this.router.navigate(link);
  }

  // Navigate to the websocket events screen
  wsevents(deviceId: string, readerId: string) {
    this.navigateTo(deviceId, 'wsevents', readerId);
  }

  flashReader(deviceId: string) {
    this.navigateTo(deviceId, 'flash');
  }

  /**
   * Configure device from an existing configuration
   * Create a new configuration
   */
  configureDevice(device: Device) {
    const deviceUrl = device.getDeviceConfigurationUrl();
    if (!deviceUrl) {
      return;
    }
    const link = ['/configuredevice', device.DeviceId];
    this.router.navigate(link);
  }

  // Analyse de carte(s)
  cardAnalysis(deviceId: string, readerId: string) {
    const link = ['/cardanalysis', deviceId, readerId];
    this.router.navigate(link);
  }

  // Ecoute la liste des changements de périphériques depuis la websocket
  listenDevicesListChanges() {
    if (!doWeUseWebsocket()) {
      return;
    }
    this.devicesListChangeSubscription = this.wsService.listenForDevicesListChanges().subscribe(() => {
      this.getDevicesList();
    });
  }

  scriptor(deviceId: string, readerId: string) {
    const link = ['/scriptor', deviceId, readerId];
    this.router.navigate(link);
  }

  canEnterInventoryData() {
    this.userCanEnterInventoryData = this.authService.getType() === 0 ? false : true;
  }

  inspectDeviceConfiguration(device: Device, configurationId: number) {
    this.router.navigate(['/' + device.getDeviceConfigurationUrl(), device.DeviceId, configurationId, '0']);
  }
}
@Component({
  selector: 'find-serial-dialog',
  templateUrl: './find-serial-dialog.html'
})
export class FindSerialDialog {
  selectedPort: string = ""
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: { serialPorts: any },
    public detectionService: DetectionService,
    public dialogsService: DialogsService,
  ) { }
  onFindClick(): void {
    this.detectionService.getSerialDevices(this.selectedPort).subscribe({
      next: () => {
      },
      error: (error) => {
        console.error('Error while getting the serial devices', error);
      },
      complete: () => void 0,
    });
  }
}
@Component({
  selector: 'find-network-dialog',
  templateUrl: './find-network-dialog.html'
})
export class FindNetworkDialog {
  ipAddress: string = ""
  constructor(public detectionService: DetectionService) { }
  onFindClick(): void {

    this.detectionService.getNetworkDevices(this.ipAddress).subscribe({
      error: (error) => {
        console.error('Error while getting the network devices', error);
      },
      complete: () => void 0,
    });
  }
}