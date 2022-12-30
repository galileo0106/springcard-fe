import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IConfigurationApplied } from '@shared/models/Configuration/configuration.applied.model';
import { IConfigurationDetails } from '@shared/models/Configuration/configuration.details.models';
import { IConfigurationList } from '@shared/models/Configuration/configuration.list.model';
import { IConfigurationWriteResponse } from '@shared/models/Configuration/configuration.write.response.model';
import { IConfigurationToSaveResponse } from '@shared/models/Configuration/configurations.to.save.response.model';
import { IConfigurationToSave } from '@shared/models/Configuration/configurationto.save.model';
import { IProductsConfigurationList } from '@shared/models/Configuration/IProductsConfigurationList.model';
import { ConfigurationsService } from '@shared/services/configurations.service';
import { EMPTY, Observable } from 'rxjs';
import { getUserInformation } from '@shared/appSettings';
import { Device } from '@shared/classes/Device';

// Voir https://docs.springcard.com/books/Companion/REST_API/Devices/Routes/Configuration/Config_(Put)
export enum IndividualsMethod {
  Discard = 'discard',
  Preserve = 'preserve',
}

/**
 * Retourne le FormGroup à utiliser pour paramétrer la configuration d'un lecteur (nom et description)
 * Enregistre, dans le back office, la configuration du lecteur (au format Angular et au format SC)
 * Enregistre une mise à jour d'une configuration
 * Pousse une configuration vers un lecteur (auquel on est forcément relié)
 * Retourne la liste de toutes les configurations depuis le back office
 * Retourne une configuration spécifique depuis le back office
 * Enregistre auprès du back office le résultat de l'application d'une configuration
 */
@Injectable()
export class ProductConfiguration {
  private _configurationsService: ConfigurationsService;
  private _formBuilder: UntypedFormBuilder;

  // Les champs dont la première lettre est en majuscule proviennent du service
  public title: string; // Titre donné à la configuration (pour l'enregistrement en BDD)
  private _id: number; // Le numéro de la configuration dans le back office et obtenu par le back office après une sauvegarde
  private _DeviceId: string; // L'ID du device qui sert dans les routes du service Rest local
  private _Device: Device;
  private _Firmware: string;
  private _Hardware: string;
  private _Name: string;
  private _UniqueId: string;
  private _ConfigId: string; // Le GUID de la configuration que l'on reçoit du service après lui avoir envoyé une configuration
  private _description = '';
  private _favorites = false;
  private _configuration: object; // La configuration au "format" Angular [{fieldName: Value}]
  private _device_configuration: object; // La configuration au "format" du lecteur [{RegisterId: Value}]
  private _wasWrittenToDeviceWithSuccess = false; // Est-ce que la configuration a été envoyée dans le lecteur avec succès ?
  private form: UntypedFormGroup;
  private _specific: IndividualsMethod = IndividualsMethod.Discard;

  constructor(configurationsService: ConfigurationsService) {
    this._configurationsService = configurationsService;
    this._id = 0;
  }

  get wasSavedWithSuccess(): boolean {
    return this._id === 0 ? false : true;
  }

  set wasWrittenToDeviceWithSuccess(status: boolean) {
    this._wasWrittenToDeviceWithSuccess = status;
  }

  get wasWrittenToDeviceWithSuccess(): boolean {
    return this._wasWrittenToDeviceWithSuccess;
  }

  // Récupère le service, pas le formulaire !
  set formBuilder(formBuilder: UntypedFormBuilder) {
    this._formBuilder = formBuilder;
  }

  get favorites(): boolean {
    return this._favorites;
  }

  set favorites(isFav: boolean) {
    this._favorites = isFav;
  }

  // Met en place le configId retourné du back office
  set id(id: number) {
    this._id = id;
  }

  get id(): number {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
  }

  set firmware(firmware: string) {
    this._Firmware = firmware;
  }

  get firmware(): string {
    return this._Firmware;
  }

  set name(name: string) {
    this._Name = name;
  }

  get name(): string {
    return this._Name;
  }

  set hardware(hardware: string) {
    this._Hardware = hardware;
  }

  get hardware(): string {
    return this._Hardware;
  }

  get configuration(): object {
    return this._configuration;
  }

  get deviceConfiguration(): object {
    return this._device_configuration;
  }

  set uniqueId(uniqueId: string) {
    this._UniqueId = uniqueId;
  }

  set device(device: Device) {
    this._Device = device;
  }

  set configId(configId: string) {
    this._ConfigId = configId;
  }

  set deviceId(deviceId: string) {
    this._DeviceId = deviceId;
  }

  set specificMethod(method: IndividualsMethod) {
    this._specific = method;
  }

  set configuration(configuration: object) {
    this._configuration = configuration;
  }

  set deviceConfiguration(deviceConfiguration: object) {
    this._device_configuration = deviceConfiguration;
  }

  // Retourne à l'appelant, normalement un composant, le FormGroup à utiliser pour le formulaire html permettant de paramétrer la configuration (nom et description de la configuration)
  public getConfigurationFormGroup(defaultDeviceId: string): UntypedFormGroup {
    const today = new Date();
    // favorites: new FormControl(''),
    this.form = this._formBuilder.group({
      title: new UntypedFormControl(
        {
          value:
            $localize`New configuration` + ' ' +
            today.toLocaleDateString() +
            ' ' +
            today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          disabled: false,
        },
        [Validators.required],
      ),
      description: new UntypedFormControl(''),
      devices: new UntypedFormControl({ value: defaultDeviceId, disabled: false }),
      method: new UntypedFormControl({ value: 'ERASE_ALL_KEEP_INDIVIDUAL', disabled: false }),
    });
    return this.form;
  }

  // Utilisé quand on ajoute ou modifie une configuration vers le back office
  private saveedit(): IConfigurationToSave {
    //this.setConfigurationDescriptionFromForm();
    const configuration: IConfigurationToSave = {
      title: this.title,
      description: this._description,
      favorites: this._favorites,
      Firmware: this._Firmware,
      Hardware: this._Hardware,
      Name: this._Name,
      UniqueId: this._UniqueId,
      ConfigId: this._ConfigId,
      configuration: JSON.stringify(this._configuration),
      device_configuration: JSON.stringify(this._device_configuration),
    };
    return configuration;
  }

  // Demande au back office d'enregistrer une nouvelle configuration
  private save(): Observable<IConfigurationToSaveResponse> {
    const configuration = this.saveedit();
    return this._configurationsService.saveConfiguration(configuration);
  }

  // Demande au backoffice d'enregistrer une mise à jour de la configuration
  private update(): Observable<IConfigurationToSaveResponse> {
    if (this._id === 0) {
      return this.save();
    }
    const configuration = this.saveedit();
    return this._configurationsService.updateConfiguration(configuration, this._id);
  }

  public importConfiguration(configurationContent: string | ArrayBuffer | null ) {
    const config = typeof configurationContent === 'string' ? JSON.parse(configurationContent || '{}') : Buffer.from(configurationContent || '{}').toString();
    const configuration: IConfigurationToSave = {
      title: config.title,
      description: config.description,
      favorites: config.favorites,
      Firmware: config.firmware,
      Hardware: config.hardware,
      Name: config.name,
      configuration: JSON.stringify(config.configuration),
      device_configuration: JSON.stringify(config.device_config),
    };
    return this._configurationsService.saveConfiguration(configuration);
  }

  // Façade pour soit ajouter une configuration soit demander sa mise à jour
  public saveConfiguration(): Observable<IConfigurationToSaveResponse> {
    if (this._id === 0) {
      return this.save();
    } else {
      return this.update();
    }
  }

  // Pousse la configuration vers le lecteur
  public writeIntoReader(): Observable<IConfigurationWriteResponse> {
    if (!this._DeviceId) {
      alert('Error, this._DeviceId is not set');
      return EMPTY;
    }
    if (!this._device_configuration) {
      alert('Error, configuration for device is not set');
      return EMPTY;
    }
    // prettier-ignore
    return this._configurationsService.writeConfigurationInDevice(JSON.stringify(this._device_configuration), this._DeviceId, this._specific);
  }

  // Retourne la liste des produits utilisés dans les configurations de l'utilisateur
  public getProductsConfigurationList(): Observable<IProductsConfigurationList[]> {
    return this._configurationsService.getProductsConfigurationList();
  }

  // Retourne la liste de toutes les configurations depuis le back office
  public getAll(filterProductId: number | null, filterFavorites: boolean | null): Observable<IConfigurationList[]> {
    return this._configurationsService.getConfigurations(filterProductId, filterFavorites);
  }

  // Partager une configuration avec quelqu'un
  public shareConfiguration(configurationId: number, recipient: string): Observable<IConfigurationToSaveResponse> {
    return this._configurationsService.shareConfiguration(configurationId, recipient);
  }

  public deleteConfiguration(configurationId: number): Observable<IConfigurationWriteResponse> {
    return this._configurationsService.deleteConfiguration(configurationId);
  }

  public favUnfavConfiguration(configurationId: number, favoriteStatus: boolean): Observable<IConfigurationWriteResponse> {
    return this._configurationsService.favUnfavConfiguration(configurationId, favoriteStatus);
  }

  public duplicateConfiguration(configurationId: number, title: string, description?: string): Observable<IConfigurationToSaveResponse> {
    return this._configurationsService.duplicateConfiguration(configurationId, title, description);
  }

  public isDeviceSet(): boolean {
    return this._Device ? true : false;
  }

  // Retourne une configuration spécifique depuis le back office
  public getFromId(id: number): Observable<IConfigurationDetails> {
    return this._configurationsService.getConfiguration(id);
  }

  // Enregistre auprès du back office le résultat de l'application d'une configuration
  public saveConfigurationApplied() {
    if (!this._id) {
      alert('Error, configuration ID is not set');
      return EMPTY;
    }

    if (!this._Device) {
      alert('Error this._Device is not set !'); // @todohth trouver et corriger le bug
      return EMPTY;
    }

    /*if (!this._Firmware) {
      alert('Error, Firmware is not set');
      return EMPTY;
    }*/
    const userInfo = getUserInformation();

    const configurationApplied: IConfigurationApplied = {
      Firmware: this._Firmware,
      Hardware: this._Hardware,
      Name: this._Name,
      configuration_id: this._id,
      success: this._wasWrittenToDeviceWithSuccess,
      ConfigId: this._ConfigId,
      UniqueId: this._UniqueId,
      Version: this._Device.Version,
      NumericalVersion: this._Device.NumericalVersion,
      Location: this._Device.Location,
      Inventory: this._Device.Inventory,
      Profile: this._Device.Profile,
      Mode: this._Device.Mode,
      MachineName: userInfo.MachineName,
      ComputerName: userInfo.ComputerName,
      UserName: userInfo.UserName,
    };
    return this._configurationsService.saveConfigurationApplied(configurationApplied);
  }
}
