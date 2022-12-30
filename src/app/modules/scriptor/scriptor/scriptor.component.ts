import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { doWeUseWebsocket, getFieldValue } from '@shared/appSettings';
import { Device } from '@shared/classes/Device';
import { Devices } from '@shared/classes/Devices';
import { IDeviceList } from '@shared/models/Device/device.list.model';
import { IDeviceResponse } from '@shared/models/Device/device.response.model';
import { IModel } from '@shared/models/Models/imodel.model';
import { IModelDialog } from '@shared/models/Models/imodeldialog.answer.interface';
import { IPcScErrorResponse } from '@shared/models/Pcsc/ipcscerrorresponse.model';
import { IPcScReadersList } from '@shared/models/Pcsc/ipcscreaderslist.model';
import { IPcScScardConnect } from '@shared/models/Pcsc/ipcscscardconnect.model';
import { IPcScScardDisconnectResponse } from '@shared/models/Pcsc/ipcscscarddisconnectresponse.model';
import { IPcScScardTransmitResponse } from '@shared/models/Pcsc/ipcscscardtransmitresponse.model';
import { IReadersList } from '@shared/models/Reader/ireaderslist.model';
import { ISelectReader } from '@shared/models/Reader/iselectedreader.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApduHistoryService } from '@shared/services/apdu.history.service';
import { ApduParserService } from '@shared/services/apduparserservice.service';
import { ApplicationService } from '@shared/services/application.service';
import { DeviceInformationsButtonsService } from '@shared/services/device-informations-buttons.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { ModelsService } from '@shared/services/models.service';
import { PcScService } from '@shared/services/pcscservice.service';
import { SettingsService } from '@shared/services/settings.service';
import { WsService } from '@shared/services/ws.service';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { Subscription } from 'rxjs';

/**
 * Equivalent de PC/SC Scriptor
 *
 * Paramètre(s) attendu(s) sur la route :
 *  - deviceId
 */
@Component({
  selector: 'app-scriptor',
  templateUrl: './scriptor.component.html',
  styleUrls: ['./scriptor.component.scss'],
})
export class ScriptorComponent implements OnInit, OnDestroy, AfterViewInit {
  deviceId = '';
  readerId = '';
  readersCount = 0;
  readerName = '';
  ATR = '';
  Protocol = '';
  token = '';
  cardPresent = false;

  shortcuts: ShortcutInput[] = [];

  public buttonsSubscription: Subscription; // Sert à détecter les clics sur les boutons d'entête
  public topButtons = Array<ITopButton>();
  public currentDevice: IDeviceResponse; // Le périphérique sur lequel on se trouve
  public componentName = 'Scriptor'; // Nom du composant qui correspondant au lecteur en cours
  public deviceDefinition: IDeviceList; // Contient la signature (définition) du périphérique, telle que décrite dans devicesList.ts
  public valueForClipboard = '';

  // Les 2 formulaires (capdu et options)
  capduRapduForm: UntypedFormGroup;
  optionsForm: UntypedFormGroup;
  // Les options
  stopOnError = false;
  stopOnSWnot9000 = false;
  outputFormat = 'hexAscii';
  runningMode = 'transmit';
  isWaitingPcScAnswer = false;
  private wsSubscription: Subscription;

  constructor(
    private dialogsService: DialogsService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private pcscService: PcScService,
    private modelsService: ModelsService,
    private deviceInformationsButtonsService: DeviceInformationsButtonsService,
    private app: ApplicationService,
    private settings: SettingsService,
    private apduParserService: ApduParserService,
    public apduHistoryService: ApduHistoryService,
    private wsService: WsService,
  ) {}

  ngOnInit(): void {
    this.loadSettings();
    this.createForms();
    this.getRouteParameters();
    this.getReaderData();
    this.setTopButtons();
    this.manageDeviceButtonsClicks();
    this.getDeviceEvents();
  }

  ngAfterViewInit() {
    // Mise en place des raccourcis clavier
    this.shortcuts.push(
      {
        key: ['ctrl + enter'],
        label: `Execution`,
        description: $localize`Run APDU`,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => this.sendApdu(),
        preventDefault: true,
      },
      {
        key: ['ctrl + shift + left'],
        label: `Navigation`,
        description: $localize`Previous APDU`,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => this.previousCommand(),
        preventDefault: true,
      },
      {
        key: ['ctrl + shift + right'],
        label: 'Navigation',
        description: $localize`Next APDU`,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => this.nextCommand(),
        preventDefault: true,
      },
      {
        key: ['ctrl + del'],
        label: 'Output',
        description: $localize`Clean output`,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => this.cleanOutput(),
        preventDefault: true,
      },
    );
  }

  ngOnDestroy() {
    this.scardDisconnect();
    if (this.buttonsSubscription) {
      this.buttonsSubscription.unsubscribe();
    }
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }

  // Chargement initial des préférences utilisateur depuis la localStorage
  loadSettings(): void {
    this.stopOnError = this.settings.getBoolean('scriptor_stopOnError', false);
    this.stopOnSWnot9000 = this.settings.getBoolean('scriptor_stopOnSWnot9000', false);
    this.outputFormat = this.settings.get('scriptor_outputFormat', 'hexAscii') as string;
    this.runningMode = this.settings.get('scriptor_runningMode', 'transmit') as string;
  }

  // Sauvegarde des préférences après changement
  saveSettings(): void {
    this.settings.set('scriptor_stopOnError', this.stopOnError.toString());
    this.settings.set('scriptor_stopOnSWnot9000', this.stopOnSWnot9000.toString());
    this.settings.set('scriptor_outputFormat', this.outputFormat);
    this.settings.set('scriptor_runningMode', this.runningMode);
  }

  // Mise en place des préférences lorsque l'utilisateur les change
  setSettings(): void {
    this.stopOnError = this.optionsForm.get('stopOnError')?.value;
    this.stopOnSWnot9000 = this.optionsForm.get('stopOnSWnot9000')?.value;
    this.outputFormat = getFieldValue(this.optionsForm, 'outputFormat');
    this.runningMode = getFieldValue(this.optionsForm, 'runningMode');
    this.saveSettings(); // @todo, enchâiner sur un refreshUi() ?
  }

  // Création des formulaires utilisés dans l'écran
  createForms(): void {
    this.optionsForm = new UntypedFormGroup({
      stopOnError: new UntypedFormControl(this.stopOnError, [Validators.required]),
      stopOnSWnot9000: new UntypedFormControl(this.stopOnSWnot9000, [Validators.required]),
      outputFormat: new UntypedFormControl(this.outputFormat, [Validators.required]),
      runningMode: new UntypedFormControl(this.runningMode, [Validators.required]),
    });

    this.capduRapduForm = new UntypedFormGroup({
      capdu: new UntypedFormControl('', [Validators.required]),
      rapdu: new UntypedFormControl('', [Validators.required]),
    });
  }

  // Recherche des paramètres dans la route
  getRouteParameters(): void {
    this.deviceId = this.route.snapshot.paramMap.get('deviceId') != null ? (this.route.snapshot.paramMap.get('deviceId') as string) : '0';
    this.readerId = this.route.snapshot.paramMap.get('readerId') != null ? (this.route.snapshot.paramMap.get('readerId') as string) : '0';
    if (this.deviceId === '0' || this.readerId === '0') {
      this.dialogsService.showOkMessage($localize`Error`, `The expected deviceId or readerId was not found, we can't go on!`).subscribe({
        next: () => {},
      });
      this.goHome();
    }
  }

  // On recherche dans la liste des périphériques connus le DeviceId qu'on reçu dans l'URL
  searchCurrentDeviceInDevicesList(): void {
    const devices = new Devices();
    const firmare = this.currentDevice.Firmware ? this.currentDevice.Firmware : '';
    const deviceItem: IDeviceList | null = devices.getDeviceFromFirmwareAndTitle(firmare, this.currentDevice.Name);
    if (deviceItem !== null) {
      this.deviceDefinition = deviceItem;
      this.componentName = this.deviceDefinition.component;
      return;
    }
  }

  // Retour à l'écran d'accueil de l'application, probablement en cas de problème grave
  goHome(): void {
    this.router.navigate(['/']);
  }

  // Mise en place des boutons du haut de l'écran ainsi que leur gestion
  setTopButtons(): void {
    this.topButtons = [];
    this.topButtons.push(
      {
        label: $localize`Run`,
        type: 'raised-icon-with-text',
        icon: 'trending_up',
        color: 'primary', // warn accent
        id: 'btnRun',
        tooltip: 'Ctrl + Enter',
        disabled: false,
      },
      {
        label: $localize`Connect`,
        type: 'raised-icon-with-text',
        icon: 'power',
        color: 'warn',
        id: 'btnIccPowerOn',
        disabled: false,
      },
      {
        label: $localize`Disconnect`,
        type: 'raised-icon-with-text',
        icon: 'power_off',
        color: 'accent',
        id: 'btnIccPowerOff',
        disabled: false,
      },
    );
  }

  /**
   * Permet de récupérer un objet Device depuis DeviceInformationsComponent
   * qui est en charge de récupérer les périphériques passés dans les routes.
   * Cette méthode est appelée par ce composant via la création d'un évènement.
   */
  getDeviceFromComponent(device: Device): void {
    this.currentDevice = device;
    this.searchCurrentDeviceInDevicesList();

    // Mise en place du nom du lecteur dans le template, si on le trouve
    let index = -1;
    this.readersCount = 0;
    // @ts-ignore
    if (this.currentDevice.Pcsc && this.currentDevice.Pcsc['ReaderIds']) {
      // @ts-ignore
      this.readersCount = this.currentDevice.Pcsc['ReaderIds'].length;
      // @ts-ignore
      for (const readerId of this.currentDevice.Pcsc['ReaderIds']) {
        index++;
        if (readerId.trim().toLowerCase() === this.readerId.trim().toLocaleLowerCase()) {
          break;
        }
      }
      if (index !== -1) {
        // @ts-ignore
        this.readerName = this.currentDevice.Pcsc['Names'][index];
      }
    }
  }

  /**
   * Méthode appelée par DeviceInformationsComponent (en charge de récupérer
   * les devices passés dans les routes), lorsque le téléchargement du
   * périphérique à échoué.
   */
  deviceLoadFailed(): void {
    this.snackBar.open($localize`It was not possible to get the selected device`, $localize`Error`, {
      duration: 5000,
    });
    this.goHome();
  }

  private changeButtonState(btnId: string, disabled: boolean): void {
    const newButtons = Array<ITopButton>();
    for (const button of this.topButtons) {
      if (button.id === btnId) {
        button.disabled = disabled;
      }
      newButtons.push(button);
    }
    this.topButtons = newButtons;
  }

  // Gère les clics sur les boutons du haut de page
  manageDeviceButtonsClicks(): void {
    this.buttonsSubscription = this.deviceInformationsButtonsService.subscriber$.subscribe((buttonId) => {
      switch (buttonId) {
        case 'btnIccPowerOn':
          this.scardConnect();
          break;

        case 'btnIccPowerOff':
          this.scardDisconnect();
          break;

        case 'btnRun':
          this.sendApdu();
          break;
      }
    });
  }

  // Changement du mode (transmit ou control) au niveau de l'interface et du témoin interne + enregistrement des prefs.
  private setRunningMode(mode: string): void {
    this.runningMode = mode;
    const runningModeField = this.optionsForm.get('runningMode');
    if (runningModeField) {
      runningModeField.patchValue(mode);
    }
    this.saveSettings();
  }

  // Permet à l'utilisateur de choisir un modèle d'APDU préféfini
  private selectModel(): void {
    this.dialogsService.selectApduModel().subscribe({
      next: (answer: IModelDialog) => {
        if (answer.okClicked) {
          const modelId = answer.modelId;
          if (modelId === 0) {
            return;
          }
          this.modelsService.getModel(modelId).subscribe(
            (model: IModel) => {
              this.setCpadu(model.apdu);
              const runningMode = model.mode === 0 ? 'transmit' : 'control';
              this.setRunningMode(runningMode);
            },
            (error: HttpErrorResponse) => {
              const errorMessage = $localize`Error while loading a model`;
              console.error(errorMessage);
              console.error(error);
              this.snackBar.open(errorMessage + ' ' + error.message, $localize`Error`, {
                duration: 5000,
              });
            },
          );
        }
      },
    });
  }

  // Gère les actions disponibles au clic sur le menu burger
  doAction(action: string): void {
    switch (action) {
      case 'changeReader': // Changement de slot
        this.changeSlot();
        break;

      case 'models': // Chargement d'un modèle
        this.selectModel();
        break;
    }
  }

  // Changement de slot
  changeSlot(): void {
    // Préparation de la liste des slots disponibles
    const readersList: IReadersList[] = [];
    let index = 0;
    // @ts-ignore
    if (this.currentDevice.Pcsc && this.currentDevice.Pcsc['ReaderIds']) {
      // @ts-ignore
      this.readersCount = this.currentDevice.Pcsc['ReaderIds'].length;
      // @ts-ignore
      for (const readerId of this.currentDevice.Pcsc['ReaderIds']) {
        readersList.push({
          readerId: readerId,
          // @ts-ignore
          readerName: this.currentDevice.Pcsc['Names'][index],
        });
        index++;
      }
    }

    if (readersList.length === 1) {
      // Il n'y a qu'un seul lecteur, pas la peine de continuer
      return;
    }

    // Ouverture de la boîte de dialogue
    this.dialogsService.selectReader(readersList, this.readerId).subscribe({
      next: (answer: ISelectReader) => {
        if (answer.okClicked) {
          const readerId = answer.readerId;
          if (readerId === '') {
            return;
          }
          if (readerId === this.readerId) {
            return; // On ne touche à rien
          }
          this.ATR = '';
          this.Protocol = '';
          this.token = '';
          this.readerId = readerId;
          this.readerName = answer.readerName;
        }
      },
    });
  }

  // APDU précédent dans l'historique
  previousCommand(): void {
    const previousApdu = this.apduHistoryService.previous();
    if (previousApdu === null) {
      return;
    }
    this.runningMode = previousApdu.mode;
    this.setCpadu(previousApdu.apdu);
  }

  // APDU suivant dans l'historique, s'il existe
  nextCommand(): void {
    const nextApdu = this.apduHistoryService.next();
    if (nextApdu === null) {
      return;
    }
    this.runningMode = nextApdu.mode;
    this.setCpadu(nextApdu.apdu);
  }

  // Suppression du contenu de la sortie
  cleanOutput(): void {
    const output = this.capduRapduForm.get('rapdu');
    if (output) {
      output.patchValue('');
    }
  }

  // Est-ce qu'on est sur un slot ?
  isReaderKnown(): boolean {
    if (this.readerId.trim() === '') {
      this.snackBar.open($localize`The reader is unknown`, $localize`Error`, {
        duration: 5000,
      });
      return false;
    }
    return true;
  }

  // Est-ce qu'on attend une réponse ?
  isWaitingPcScResponse(): boolean {
    if (this.isWaitingPcScAnswer) {
      this.snackBar.open($localize`We are waiting for an answer from a previous command`, $localize`Error`, {
        duration: 4500,
      });
      return true;
    }
    return false;
  }

  // Mise en place de l'état d'attente d'une réponse de la carte ou du lecteur
  setWaitingPcScAnswer(isWaiting: boolean) {
    this.isWaitingPcScAnswer = isWaiting;
  }

  // Est-ce qu'on a un handler vers la carte ?
  hasToken(): boolean {
    if (this.token.trim() === '') {
      this.snackBar.open($localize`Please use IccPowerOn`, $localize`Error`, {
        duration: 5000,
      });
      return false;
    }
    return true;
  }

  scardConnect() {
    if (!this.isReaderKnown()) {
      return;
    }
    if (this.isWaitingPcScResponse()) {
      return;
    }
    this.token = '';
    this.ATR = '';
    this.Protocol = '';

    this.setWaitingPcScAnswer(true);
    this.pcscService.scardConnect(this.readerId).subscribe(
      (response: IPcScScardConnect | IPcScErrorResponse) => {
        this.setWaitingPcScAnswer(false);
        if (this.pcscService.isSuccessResponse(response)) {
          const response2 = response as IPcScScardConnect;
          this.ATR = response2.ATR;
          this.Protocol = response2.Protocol;
          this.token = response2.Token;
          this.snackBar.open($localize`Connected to the card with success`, $localize`Success`, {
            duration: 4500,
          });
          this.changeButtonState('btnIccPowerOn', true);
          this.changeButtonState('btnIccPowerOff', false);
        } else {
          let errorMessage = this.pcscService.getErrorsFromResponse($localize`Error while connecting to the card`, response);
          console.error(errorMessage);
          console.error(response);
          this.snackBar.open(errorMessage, 'Error', {
            duration: 5000,
          });
        }
      },
      (error: HttpErrorResponse) => {
        this.setWaitingPcScAnswer(false);
        const title = $localize`Error during a network request`;
        console.error(title);
        console.error(error);
        const message = $localize`There was an error while connecting to the card:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.scardConnect();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  scardDisconnect() {
    if (!this.isReaderKnown()) {
      return;
    }
    if (this.isWaitingPcScResponse()) {
      return;
    }

    this.setWaitingPcScAnswer(true);
    this.ATR = '';
    this.Protocol = '';

    this.pcscService.scardDisconnect(this.readerId, this.token).subscribe(
      (response: IPcScScardDisconnectResponse | IPcScErrorResponse) => {
        this.token = '';
        this.setWaitingPcScAnswer(false);
        if (this.pcscService.isSuccessResponse(response)) {
          this.snackBar.open($localize`Disconnected with success`, $localize`Success`, {
            duration: 4500,
          });
          this.changeButtonState('btnIccPowerOn', false);
          this.changeButtonState('btnIccPowerOff', true);
        } else {
          let errorMessage = this.pcscService.getErrorsFromResponse($localize`Error while disconnecting from the card`, response);
          console.error(errorMessage);
          console.error(response);
          this.snackBar.open(errorMessage, $localize`Error`, {
            duration: 5000,
          });
        }
      },
      (error: HttpErrorResponse) => {
        this.token = '';
        this.setWaitingPcScAnswer(false);
        const title = $localize`Error during a network request`;
        console.error(title);
        console.error(error);
        const message = $localize`There was an error while disconnecting from the card:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.scardDisconnect();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  // Retourne le contenu de la zone capdu saisie par l'utilisateur
  private getCapdu(): string {
    const capdu = this.capduRapduForm.get('capdu');
    if (!capdu) {
      return '';
    }
    return capdu.value as string;
  }

  // Mise en place du contenu de CAPDU (la commande)
  private setCpadu(content: string) {
    const capdu = this.capduRapduForm.get('capdu');
    if (capdu) {
      capdu.patchValue(content);
    }
  }

  // Ajoute les commandes de l'utilisateur à l'historique
  addApduToHistory(apdu: string) {
    this.apduHistoryService.append(apdu, this.runningMode);
  }

  // ScardControl ou ScardTransmit()
  sendApdu() {
    if (!this.isReaderKnown()) {
      return;
    }
    if (this.isWaitingPcScResponse()) {
      return;
    }
    if (this.runningMode === 'transmit' && !this.hasToken()) {
      this.snackBar.open($localize`Please power on the card`, $localize`Error`, {
        duration: 5000,
      });

      return;
    }

    if (!this.apduParserService.setContent(this.getCapdu())) {
      this.snackBar.open($localize`The content of your commands is invalid`, $localize`Error`, {
        duration: 5000,
      });
      return;
    }

    if (!this.apduParserService.hasContent()) {
      this.snackBar.open($localize`There's nothing to send to the card or the reader`, $localize`Error`, {
        duration: 5000,
      });
      return;
    }
    const parsedContent = this.apduParserService.getParsedContent();
    this.valueForClipboard = 'Command(s):\n' + parsedContent + '\n\nOutput:\n';
    this.addApduToHistory(parsedContent);
    this.sendCommands();
  }

  // Ajoute un résultat à la sortie en tenant compte des prefs d'affichage (hex, ASCII, hex + ascii). Le résultat DOIT être en hexa.
  private addToRapdu(content: string) {
    const rapdu = this.capduRapduForm.get('rapdu');
    if (!rapdu) {
      console.error(`Can't get an objet pointing to the rapdu field!`);
      return;
    }
    let result = '';
    switch (this.outputFormat) {
      case 'ascii':
        result = this.apduParserService.hexStringToAscii(content);
        break;

      case 'hex':
        result = this.apduParserService.spacedHexString(content);
        break;

      case 'hexAscii': // Hex ET ASCII
        result = this.apduParserService.spacedHexString(content) + ' | ' + this.apduParserService.hexStringToAscii(content);
        break;

      default:
        break;
    }
    this.valueForClipboard += result + '\n';
    rapdu.patchValue(rapdu.value.trim() + '\n' + result);
  }

  // Envoi, en boucle, des commandes
  private sendCommands(capdu = '') {
    let apdu: string | boolean = '';
    if (capdu.trim() === '') {
      apdu = this.apduParserService.getNextLine();
      if (apdu === false) {
        return;
      }
    } else {
      apdu = capdu;
    }

    this.setWaitingPcScAnswer(true);
    this.pcscService.sendApdu(this.runningMode, this.readerId, this.token, apdu as string).subscribe(
      (response: IPcScScardTransmitResponse | IPcScErrorResponse) => {
        this.setWaitingPcScAnswer(false);
        if (this.pcscService.isSuccessResponse(response)) {
          const response2 = response as IPcScScardTransmitResponse;
          this.addToRapdu(response2.Response as string);
        } else {
          let errorMessage = this.pcscService.getErrorsFromResponse($localize`Error with a command`, response);
          console.error(errorMessage);
          console.error(response);
          this.snackBar.open(errorMessage, $localize`Error`, {
            duration: 5000,
          });
        }
        this.sendCommands();
      },
      (error: HttpErrorResponse) => {
        this.setWaitingPcScAnswer(false);
        console.error($localize`Error while sending your command`);
        console.error(error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while sending a command:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.sendCommands(apdu as string);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  // Ecoute des événements de la WS pour ce lecteur
  getDeviceEvents() {
    if (!doWeUseWebsocket()) {
      return;
    }
    this.wsSubscription = this.wsService.filterDeviceAndSlotMessages(this.readerId).subscribe(
      (message: IPcScReadersList) => {
        switch (message.Status) {
          case 'present': // There is a card in the reader
            this.cardPresent = true;
            if (this.token.trim() === '') {
              this.scardConnect();
            }
            break;

          case 'empty': // No card in the reader
            this.changeButtonState('btnIccPowerOn', true);
            this.changeButtonState('btnIccPowerOff', true);
            this.token = '';
            this.ATR = '';
            this.Protocol = '';
            this.cardPresent = false;
            break;

          case 'error': // Le lecteur n'est pas disponible
            this.ATR = '';
            this.Protocol = '';
            this.token = '';
            this.readerName = '';
            this.cardPresent = false;
            this.snackBar.open($localize`The reader is not available`, $localize`Error`, {
              duration: 4500,
            });
            this.goHome();
            break;

          case 'present,mute': // There is a card, but it has failed to return an ATR
            this.changeButtonState('btnIccPowerOn', true);
            this.changeButtonState('btnIccPowerOff', true);
            this.cardPresent = true;
            this.ATR = '';
            this.Protocol = '';
            break;

          case 'present,in_use': // The card has been connected by an application and could be shared
            this.cardPresent = true;
            break;

          case 'present,in_use,exclusive': // The card has been connected by an application and can't be shared
            this.cardPresent = true;
            break;
        }
      },
      (error) => {
        console.error(error);
      },
    );
  }

  // Au démarrage on cherche à voir s'il y a une carte
  getReaderData() {
    this.pcscService.getReaderData(this.readerId, this.token).subscribe((response: IPcScReadersList | IPcScErrorResponse) => {
      const response2 = response as IPcScReadersList;
      this.cardPresent = response2.Present;
      if (this.cardPresent) {
        this.scardConnect();
      }
    });
  }
}
