import { UUID } from '@shared/appSettings';
import { IProjectComponentConfiguration } from '@shared/models/Configuration/IProjectComponentConfiguration.models';
import { IProject } from '@shared/models/iproject.model';
import { environment } from './../../../../environments/environment';

/**
 * Gère le stockage intermédiaire des projets dans la localStorage pour les passer de composant en composant
 */
export class Project {
  private readonly _maxNfcTemplates = environment.nfcTemplatesCount;
  private readonly _maxBleTemplates = environment.bleTemplatesCount;
  private readonly _localStoragePrefix = 'sc_'; // Le préfixe à donner aux données dans la localStorage
  private _persistName = ''; // Le nom du "projet" dans la localStorage `sc_Project_0eb80cea-dc9c-4874-983d-df805fce89f7`
  private _uuid = ''; // L'identifiant unique du projet (pour le trouver dans la localStorage)
  private _project: IProject = {
    id: 0, // ID de la configuration sauvegardée dans le back office (ID Mysql)
    ConfigId: '', // L'identifiant de configuration renvoyé par le service après lui avoir donné une configuration
    created: new Date(), // Servira, peut être, à faire le ménage dans la localStorage
    component: '', // Le nom du composant du périphérique
    nfcTemplates: [], // Nom des composants des templates NFC
    bleTemplates: [], // Nom des composants des templates BLE
    configurations: [], // La configuration de chaque composant (configuration au format Angular et celle au format "registres")
    deviceId: '',
    configurationName: 'no name',
    configurationDescription: '',
    configurationIsFavorite: false,
  };

  constructor(uuid: string, componentName = '') {
    this._uuid = uuid;
    this._project.bleTemplates = [];
    this._project.nfcTemplates = [];
    this._project.configurations = [];
    this._persistName = this._localStoragePrefix + 'Project_' + this._uuid;
    if (componentName.trim() !== '') {
      this._project.component = componentName;
    }
    this.cleanOldProjects();
    this.createSlots();
  }

  // Permet d'obtenir un UUID. Permet aussi d'éviter de se traîner l'import de UUID dans tous les composants
  static getUuid(): string {
    return UUID();
  }

  // Vérifie si un projet existe déjà dans la localStorage  @odo, vérifier si c'est utilisé
  static projectExist(uuid: string): boolean {
    const projectName = 'sc_Project_' + uuid;
    return localStorage.getItem(projectName) === null ? false : true;
  }

  // Ménage dans la localStorage pour ne garder que le projet en cours
  private cleanOldProjects() {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(this._localStoragePrefix + 'Project_')) {
        if (key !== this.projectName) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  // Création des slots des templates NFC et BLE
  private createSlots() {
    for (let i = 0; i < this._maxNfcTemplates; i++) {
      this._project.nfcTemplates.push('');
    }
    for (let i = 0; i < this._maxBleTemplates; i++) {
      this._project.bleTemplates.push('');
    }
  }

  // Retourne le numéro de la configuration tel qu'il a été retourné par le back office après sauvegarde
  get id(): number {
    return this._project.id;
  }

  // Mise en place de l'ID de sauvegarde dans le back office
  set id(id: number) {
    this._project.id = id;
  }

  // Retourne le nom de la configuration
  get configurationName(): string {
    return this._project.configurationName;
  }

  // Mise en place du nom de la configuration
  set configurationName(name: string) {
    this._project.configurationName = name.trim();
  }

  // Retourne la description de la configuration
  get configurationDescription(): string {
    return this._project.configurationDescription;
  }

  // Mise en place du nom de la configuration
  set configurationDescription(description: string) {
    this._project.configurationDescription = description.trim();
  }

  // Retourne la description de la configuration
  get configurationIsFavorite(): boolean {
    return this._project.configurationIsFavorite;
  }

  // Mise en place du nom de la configuration
  set configurationIsFavorite(isFavorite: boolean) {
    this._project.configurationIsFavorite = isFavorite;
  }

  get ConfigId(): string | undefined {
    return this._project.ConfigId;
  }

  set ConfigId(configId: string | undefined) {
    this._project.ConfigId = configId;
  }

  // Retourne le nom du projet qui va être utilisé dans la localStorage
  get projectName(): string {
    return this._persistName;
  }

  // Retourne l'UUID du projet courant
  get uuid(): string {
    return this._uuid;
  }

  // Mise en place du deviceId auquel le projet est lié
  set deviceId(deviceId: string) {
    this._project.deviceId = deviceId;
  }

  // Retourne le deviceId auquel le projet est lié
  get deviceId(): string {
    return this._project.deviceId;
  }

  // Dump de la structure du projet dans la console
  dump() {
    console.info('*****************************');
    console.info("* Dump of project's content *");
    console.info('*****************************');
    console.info('uuid', this._uuid);
    console.info('Full Objet');
    console.dir(this._project);
  }

  // Retourne le nom du composant, celui du périphérique
  get componentName(): string {
    return this._project.component;
  }

  // Mise en place du nom du composant du périphérique
  set componentName(name: string) {
    this._project.component = name;
  }

  // Met en place d'un template NFC dans la liste
  setNfcTemplate(componentName: string, slot: number): boolean {
    if (slot < 0 || slot >= this._maxNfcTemplates) {
      return false;
    }
    // Est-ce qu'il y est déjà ?
    let slotNumber = 0;
    for (const component of this._project.nfcTemplates) {
      if (component.trim().toLowerCase() === componentName.trim().toLowerCase() && slot === slotNumber) {
        return true;
      }
      slotNumber++;
    }
    this._project.nfcTemplates[slot] = componentName;
    return true;
  }

  // Met en place un template BLE dans la liste
  setBleTemplate(componentName: string, slot: number): boolean {
    if (slot < 0 || slot >= this._maxBleTemplates) {
      return false;
    }
    // Est-ce qu'il y est déjà ?
    let slotNumber = 0;
    for (const component of this._project.bleTemplates) {
      if (component.trim().toLowerCase() === componentName.trim().toLowerCase() && slot === slotNumber) {
        return true;
      }
      slotNumber++;
    }
    this._project.bleTemplates[slot] = componentName;
    return true;
  }

  // Mise en place (ajout) d'un template d'un certaine type à un slot donné
  setTemplateFromSlotAndType(componentName: string, slot: number, type: string): boolean {
    if (type.trim().toLowerCase() === 'nfc') {
      return this.setNfcTemplate(componentName, slot);
    } else {
      return this.setBleTemplate(componentName, slot);
    }
  }

  // Quand on demande la suppression d'un template (NFC ou BLE) on supprime la configuration associée
  private removeComponentConfiguration(component: string, slot: number) {
    const output: IProjectComponentConfiguration[] = [];
    for (const configuration of this._project.configurations) {
      if (configuration.component.trim().toLowerCase() === component.trim().toLowerCase() && configuration.slot === slot) {
        //console.info("Removing", configuration);
      } else {
        output.push(configuration);
      }
    }
    this._project.configurations = output;
  }

  // Supprime un template NFC à partir du nom de son composant  @todo, voir si ce sera toujours utile
  removeNfcTemplateFromComponentName(component: string, slot: number) {
    for (let i = 0; i < this._project.nfcTemplates.length; i++) {
      if (this._project.nfcTemplates[i].trim().toLowerCase() !== component.trim().toLowerCase()) {
        this._project.nfcTemplates[i] = '';
      }
    }
    this.removeComponentConfiguration(component, slot);
  }

  // Supprime un template Nfc à partir de son slot
  removeNfcTemplateFromSlot(slot: number) {
    if (slot < 0 || slot >= this._maxNfcTemplates) {
      return;
    }
    const component = this._project.nfcTemplates[slot];
    this._project.nfcTemplates[slot] = '';
    this.removeComponentConfiguration(component, slot);
  }

  // Supprime un template BLE à partir du nom du composant  @todo, voir si ce sera toujours utile
  removeBleTemplateFromComponentName(component: string, slot: number) {
    for (let i = 0; i < this._project.bleTemplates.length; i++) {
      if (this._project.bleTemplates[i].trim().toLowerCase() !== component.trim().toLowerCase()) {
        this._project.bleTemplates[i] = '';
      }
    }
    this.removeComponentConfiguration(component, slot);
  }

  // Supprime un template BLE à partir de son slot
  removeBleTemplateFromSlot(slot: number) {
    if (slot < 0 || slot >= this._maxBleTemplates) {
      return;
    }
    const component = this._project.bleTemplates[slot];
    this._project.bleTemplates[slot] = '';
    this.removeComponentConfiguration(component, slot);
  }

  // Retourne le nom du composant pour un slot de template NFC
  getNfcTemplateComponent(slot: number): string | null {
    if (slot < 0 || slot > this._maxNfcTemplates) {
      return null;
    }
    return typeof this._project.nfcTemplates[slot] === 'undefined' ? null : this._project.nfcTemplates[slot];
  }

  // Retourne le nom du composant pour un slot de template BLE
  getBleTemplateComponent(slot: number): string | null {
    if (slot < 0 || slot > this._maxBleTemplates) {
      return null;
    }
    return typeof this._project.bleTemplates[slot] === 'undefined' ? null : this._project.bleTemplates[slot];
  }

  // Façade pour retrouver le nom d'un composant à partir de son type (ble/nfc) et son slot
  getTemplateComponentNameFromSlotAndType(slot: number, type: string): string | null {
    if (type.trim().toLowerCase() === 'nfc') {
      return this.getNfcTemplateComponent(slot);
    } else {
      return this.getBleTemplateComponent(slot);
    }
  }

  // Retourne le nombre max de templates BLE qu'on peut avoir
  getMaxBleTemplatesCount(): number {
    return this._maxBleTemplates;
  }

  // Retourne le nombre max de templates NFC qu'on peut avoir
  getMaxNfcTemplatesCount(): number {
    return this._maxNfcTemplates;
  }

  // Retourne le nombre de templates BLE du projet
  getBleTemplatesCount(): number {
    return this._project.bleTemplates.length;
  }

  // Retourne le nombre de templates NFC du projet
  getNfcTemplatesCount(): number {
    return this._project.nfcTemplates.length;
  }

  // Est-ce qu'il est encore possible d'ajouter un template NFC ?
  canAddNfcTemplate(): boolean {
    return this._project.nfcTemplates.length < this._maxNfcTemplates ? true : false;
  }

  // Est-ce qu'il est encore possible d'ajouter un template BLE ?
  canAddBleTemplate(): boolean {
    return this._project.bleTemplates.length < this._maxBleTemplates ? true : false;
  }

  // Enregistre le projet dans la localStorage
  save() {
    if (this._uuid.trim() === '') {
      throw new Error("It's not possible to persist the project because its UUID is not set");
    }

    try {
      localStorage.setItem(this._persistName, JSON.stringify(this._project));
    } catch (error) {
      console.error("Can't write the project in the local storage");
    }
  }

  // Charge le projet depuis la localStorage, s'il existe
  load(): boolean {
    if (this._uuid.trim() === '') {
      console.error("It's not possible to search for the project because its UUID is not set");
      return false;
    }
    const projectContent = localStorage.getItem(this._persistName);
    if (!projectContent || projectContent === null) {
      console.error("The project's content after being loaded is not valid or does not exist in the local storage");
      return false;
    }

    Object.assign(this._project, JSON.parse(projectContent));
    return true;
  }

  // Est-ce que le nom de composant passé en paramètre est celui du périphérique ou celui d'un des templates (NFC et/ou BLE) ?
  private componentNameExists(component: string): boolean {
    if (this._project.component.trim().toLowerCase() === component.trim().toLowerCase()) {
      return true;
    }
    for (const bleTemplateComponent of this._project.bleTemplates) {
      if (bleTemplateComponent.trim().toLowerCase() === component.trim().toLowerCase()) {
        return true;
      }
    }
    for (const nfcTemplateComponent of this._project.nfcTemplates) {
      if (nfcTemplateComponent.trim().toLowerCase() === component.trim().toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Met en place la configuration (format Angular et registres) d'un composant (Device ou Template)
   *
   * @param componentName Le nom du composant Angular (composant de périphérique ou de template)
   * @param slotNumber Le slot, de 0 à N pour les templates et -1 pour la configuration du périphérique
   * @param angularConfiguration La configuration du périphérique au format FormGroup d'Angular
   * @param registersConfiguration La configuration des registres
   */
  setComponentConfiguration(
    componentName: string,
    slotNumber: number,
    angularConfiguration: string,
    registersConfiguration: string,
  ): boolean {
    if (slotNumber !== -2) {
      // Si on n'est pas sur un "slot" de configuration de la sauvegarde
      if (!this.componentNameExists(componentName)) {
        return false;
      }
    }

    let componentFound = false;
    const configurations: IProjectComponentConfiguration[] = [];
    for (const componentConfiguration of this._project.configurations) {
      if (componentConfiguration.component.trim().toLowerCase() === componentName.trim().toLowerCase()) {
        componentFound = true;
        const newConfiguration = {
          component: componentName,
          form: angularConfiguration,
          registers: registersConfiguration,
          slot: slotNumber,
        };
        configurations.push(newConfiguration);
      } else {
        configurations.push(componentConfiguration);
      }
    }

    if (!componentFound) {
      const newConfiguration = {
        component: componentName,
        form: angularConfiguration,
        registers: registersConfiguration,
        slot: slotNumber,
      };
      configurations.push(newConfiguration);
    }
    this._project.configurations = configurations;
    return true;
  }

  /**
   * Récupère la configuration d'un composant, si elle existe
   *
   * @param componentName Le nom du composant dont on veut récupérer la configuration
   * @param slot Le numéro de slot, de 0 à N pour les Templates, -1 pour le composant du périphérique et -2 pour SaveWrite
   */
  getComponentConfiguration(componentName: string, slot: number): IProjectComponentConfiguration | null {
    for (const componentConfiguration of this._project.configurations) {
      if (
        componentConfiguration.component.trim().toLowerCase() === componentName.trim().toLowerCase() &&
        componentConfiguration.slot === slot
      ) {
        return componentConfiguration;
      }
    }
    return null;
  }

  // Est-ce qu'on a un template BLE dans le slot N ?
  hasBleTemplateInSlot(slot: number): boolean {
    if (slot < 0 || slot >= this._maxBleTemplates) {
      return false;
    }
    return this._project.bleTemplates[slot].trim() === '' ? false : true;
  }

  // Est-ce qu'on a un template NFC dans le slot N ?
  hasNfcTemplateInSlot(slot: number): boolean {
    if (slot < 0 || slot >= this._maxNfcTemplates) {
      return false;
    }
    return this._project.nfcTemplates[slot].trim() === '' ? false : true;
  }

  // Est-ce qu'on a un template d'un certain type dans le slot N ?
  hasTemplateOfTypeInSlot(type: string, slot: number): boolean {
    if (type.trim().toLowerCase() === 'nfc') {
      return this.hasNfcTemplateInSlot(slot);
    } else {
      return this.hasBleTemplateInSlot(slot);
    }
  }

  // Retourne, pour tous les composants de type périphérique ou template, la configuration des registres
  getRegistersConfigurationForDeviceAndTemplates(): string {
    let output = {};
    for (const configuration of this._project.configurations) {
      if (configuration.slot !== -2 && configuration.registers.trim() !== '') {
        output = { ...output, ...JSON.parse(configuration.registers) };
      }
    }
    return JSON.stringify(output);
  }

  // Retourne le contenu complet du projet pour le persister dans le back office via l'API Rest
  get project(): IProject {
    return this._project;
  }

  hasTemplateOfAnyType(): boolean {
    for (let i = 0; i < this._maxNfcTemplates; i++) {
      if (this._project.nfcTemplates[i].trim() !== '') {
        return true;
      }
    }
    for (let i = 0; i < this._maxBleTemplates; i++) {
      if (this.project.bleTemplates[i].trim() !== '') {
        return true;
      }
    }
    return false;
  }

  // Met en place les données de configuration récupérées depuis le back office
  createProjectFromLoadedConfiguration(project: IProject) {
    this._project = project;
    this._project.loaded = new Date();
  }
}
