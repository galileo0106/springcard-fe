import { UntypedFormGroup } from '@angular/forms';
import { getFieldValue, hasCheatCode } from '@shared/appSettings';
import { IDeviceList } from '@shared/models/Device/device.list.model';
import { IFieldAndRegisterDefinition } from '@shared/models/ifieldandregisterdefinition.model';
import { BinUtils } from './BinUtils';
import { Field } from './Field';

//#region Interfaces utilisées dans la classe
export interface IRegisterDefaultConfiguration {
  defaultValue: string;
  size: number;
  minSize?: number;
  maxSize?: number;
}

// Définit la manière dont la configuration des registres est enregistrée dans cette classe, c'est un tableau associatif dont la clé est une chaine (le numéro du registre), et la valeur, un tableau d'octets
export interface IRegistersValues {
  [key: string]: Uint8Array;
}

// "numero_registre": "valeur_registre_en_hexa", "numero_registre": "valeur_registre_en_hexa"
export interface IRegistersValuesAsString {
  [key: string]: string;
}

export interface IFormFieldValue {
  [key: string]: any;
}

export type SetFieldsCallback = (formFields: UntypedFormGroup) => string[];
//#endregion

/**
 * Classe mal nommée
 * "Calcule" la valeur des registres d'un lecteur à partir d'un formulaire de configuration (format Angular), c'est la fonction principale de cette classe
 * Retourne le contenu d'un formulaire de configuration (au format Angular) pour sauvegarde dans le back office
 * Mise en pace du contenu d'un formulaire de configuration (à partir d'une sauvegarde au "format" Angular)
 */
export class Registers {
  private formFieldsList: string[] = []; // Liste des champs (nom du champ) à utiliser en tenant compte des conditions
  private formFields: UntypedFormGroup; // L'objet contenant tous les champs au "format" Angular
  private readonly FAKE_NULL_VALUE = '§|'; // Valeur improbable pour les champs qu'on ne trouve pas dans this.formFields
  public registers: IRegistersValues = {}; // Stockage du résultat de la configuration, clé = ID registre en hexa, Valeur = configuration sous la forme d'un Uint8Array()
  private fieldsDefinition: Record<string, IFieldAndRegisterDefinition>; // La définition de tous les champs du formulaire
  private setFieldsCallback: SetFieldsCallback;
  private slot = 0;
  private _lkl = 0x00;
  private templateType = 0; // 0 = Pas template, 2 = NFC, 3 = BLE

  // Variables dédiées au rechargement des configurations dans les formulaire depuis la configuration des registres
  private notRegisterFields: Array<string> = []; // Liste des champs (juste le nom) qui ne sont pas liés à un registre (et dont il faut faire la sauvegarde)
  private registerFields: Array<string> = []; // Liste des champs (juste le nom) qui SONT liés à un registre (et dont il NE faut PAS faire la sauvegarde)
  private registersFields: Record<string, IFieldAndRegisterDefinition[]> = {}; // Contient, par registre (la clé), la liste (tableau) des champs qui le constitue

  /**
   * On reçoit le formulaire qui contient la configuration parce que la classe a besoin d'itérer sur les champs
   * pour calculer la valeur des registres
   *
   * @param formFields Le formgroup du formulaire de configuration du périphérique ou du template
   * @param fieldsDefinition La définition des registres
   * @param templateType Le type de template, 0 = pas un template, 2 = NFC, 3 = BLE
   * @param slot Si on est sur un template, le numéro du slot (de 1 à N)
   */
  constructor(formFields: UntypedFormGroup, fieldsDefinition: Record<string, IFieldAndRegisterDefinition>, templateType = 0, slot = 0) {
    this.formFields = formFields;
    this.fieldsDefinition = fieldsDefinition;
    this.templateType = templateType;
    this.slot = slot;
    this.setFields();
    this.searchFieldsNotLinkedToRegisters();
  }

  // Recherche de la liste des champs qui ne sont pas liés à un registre et ceux qui sont liés à un registre
  private searchFieldsNotLinkedToRegisters() {
    this.notRegisterFields = [];
    this.registerFields = [];
    // TOUS les champs du formulaire
    const allFormFieldsNames = Object.keys(this.formFields.controls);
    // Tous les champs qui sont liés à un registre
    const registersFieldsNames = Object.keys(this.fieldsDefinition);

    // On recherche les champs de allFormFieldsNames qui ne sont pas dans registersFieldsNames
    allFormFieldsNames.forEach((searchedFieldName) => {
      if (registersFieldsNames.indexOf(searchedFieldName) === -1) {
        this.notRegisterFields.push(searchedFieldName);
      } else {
        this.registerFields.push(searchedFieldName);
      }
    });
    this.createRegistersDefinition();
  }

  // Récupère, par registre, la liste des champs qui le constitue
  private createRegistersDefinition() {
    this.registersFields = {};
    const registersFieldsNames = Object.keys(this.fieldsDefinition); // id3419_Field, id3421_Field, id3423_Field etc
    registersFieldsNames.forEach((fieldName: string) => {
      const fieldDefinition = this.fieldsDefinition[fieldName]; // id3419_Field: { fieldType: 'hex', register: '0200', initialValue: '00000000000000000000000000000000', bitmap: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', registerDefaultValue: '0', registerSize: 16},
      fieldDefinition['fieldName'] = fieldName;
      const registerName = fieldDefinition.register;
      if (this.registersFields.hasOwnProperty(registerName)) {
        const actualValues = this.registersFields[registerName];
        actualValues.push(fieldDefinition);
        this.registersFields[registerName] = actualValues;
      } else {
        this.registersFields[registerName] = [fieldDefinition];
      }
    });
  }

  // Récupération de la fonction qui permet de filtrer les champs du formulaire à utiliser en fonction des conditions
  public setFormFieldsListCallback(callback: (formFields: UntypedFormGroup) => string[]) {
    this.setFieldsCallback = callback;
  }

  // Mise en place de la liste des champs à utiliser, en fonction des conditions
  private setFields() {
    if (this.setFieldsCallback) {
      this.formFieldsList = this.setFieldsCallback(this.formFields);
    }
  }

  // Indique si on est sur la configuration d'un template
  private isTemplateConfiguration(): boolean {
    return this.templateType === 0 ? false : true;
  }

  // Met en place le LKL dans le bon registre en fonction du slot et du type de template (NFC / BLE)
  private setLklValue() {
    const lklAsStringFromForm = getFieldValue(this.formFields, 'lookups');
    if (lklAsStringFromForm === '' || lklAsStringFromForm === null) {
      console.error("Can't get LKL because it is empty or null");
      return;
    }
    const lkl = new Uint8Array(1);
    this._lkl = parseInt(lklAsStringFromForm, 16);
    lkl[0] = this._lkl;
    const index = this.getStartingOffset();
    this.registers[index] = lkl;
  }

  private getRegisterIndex(registerId: string): string {
    let registerInReturned = '';
    if (this.templateType === 0) {
      // Ce n'est pas un template
      registerInReturned = registerId;
    } else {
      // On va recevoir, par exemple, 05 qu'il faut passer en 0305 ou 0315
      const offset = this.getStartingOffset(); // 0300, 0310, 0320, 0330 ou 0340
      let registerIndex = parseInt(offset, 16) + parseInt(registerId, 16);
      let hexRegisterIndex = registerIndex.toString(16);
      if (hexRegisterIndex.length % 2 !== 0) {
        hexRegisterIndex = '0' + hexRegisterIndex;
      }
      registerInReturned = hexRegisterIndex.toUpperCase();
    }
    return registerInReturned;
  }

  // Mise en place de la valeur d'un registre en tant compate du fait que c'est un template ou pas
  private setRegisterValue(registerId: string, registerValue: Uint8Array) {
    const index = this.getRegisterIndex(registerId);
    this.registers[index] = registerValue;
  }

  private getStartingOffset(): string {
    let index = '';
    if (this.templateType === 2) {
      // NFC
      index = '03' + (this.slot * 10).toString(); // 0310
    } else if (this.templateType === 3) {
      // BLE
      index = '0300';
    }
    return index;
  }

  // Recherche du paramétrage d'un registre en parcourant tous les champs qui lui sont liés
  private searchRegisterConfiguration(registerId: string): IRegisterDefaultConfiguration {
    const registerConfiguration: IRegisterDefaultConfiguration = {
      defaultValue: '',
      size: 1,
    };

    if (!this.registersFields[registerId]) {
      return registerConfiguration;
    }

    let registerDefaultValue = '';
    let registerMaxSize = 0;
    let registerMinSize = 0;
    let registerSize = 0;

    // Boucle sur toutes les définitions de champs
    const fieldsDefinitions = this.registersFields[registerId];
    for (const fieldDefinition of fieldsDefinitions) {
      if (fieldDefinition['registerDefaultValue']) {
        registerDefaultValue = fieldDefinition['registerDefaultValue'];
      }
      if (fieldDefinition['registerSize']) {
        if (fieldDefinition['registerSize'] > registerSize) {
          registerSize = fieldDefinition['registerSize'];
        }
      }
      if (fieldDefinition['registerMinSize']) {
        if (fieldDefinition['registerMinSize'] > registerMinSize) {
          registerMinSize = fieldDefinition['registerMinSize'];
        }
      }

      if (fieldDefinition['registerMaxSize']) {
        if (fieldDefinition['registerMaxSize'] > registerMaxSize) {
          registerMaxSize = fieldDefinition['registerMaxSize'];
        }
      }
    }

    registerConfiguration.defaultValue = registerDefaultValue; // La valeur est en HEXA (maintenant 25/11/2020)
    registerConfiguration.size = registerSize;
    registerConfiguration.minSize = registerMinSize;
    registerConfiguration.maxSize = registerMaxSize;

    if (registerConfiguration.defaultValue !== '') {
      // Si on a trouvé une valeur par défaut
      // Si le registre à une valeur par défaut dont la taille est plus grande que la taille déclarée alors on prend la taille de la valeur par défaut
      const defaultValueLength = registerConfiguration.defaultValue.trim().length / 2;
      if (registerConfiguration.size < defaultValueLength) {
        registerConfiguration.size = defaultValueLength;
      }
    }
    if (registerConfiguration.minSize > registerConfiguration.size) {
      registerConfiguration.size = registerConfiguration.minSize;
    }
    if (registerConfiguration.maxSize < registerConfiguration.size) {
      registerConfiguration.maxSize = registerConfiguration.size;
    }
    return registerConfiguration;
  }

  // Création d'un nouveau registre dans le tableau interne
  private createNewRegister(registerId: string) {
    const registerConfiguration = this.searchRegisterConfiguration(registerId);
    //this.registers[registerId] = new Uint8Array(registerConfiguration.size);
    this.setRegisterValue(registerId, new Uint8Array(registerConfiguration.size));
  }

  // Mise en place de la valeur saisie dans la valeur d'un registre à partir d'un champ de saisie et d'un mask
  private getRegisterValueFromField(registerId: string, fieldName: string): boolean | Uint8Array {
    const fieldValue = getFieldValue(this.formFields, fieldName); // Valeur saisie par l'utilisateur dans le formulaire
    const fieldDefinition = this.fieldsDefinition[fieldName]; // La définition du champ avec, entre autre, son bitmap

    if (fieldValue === this.FAKE_NULL_VALUE) {
      throw new Error("Can't get the value of the field: " + fieldName);
    }

    let registerValue: Uint8Array = this.registers[this.getRegisterIndex(registerId)]; // La valeur actuelle du registre
    const fieldBitmap = fieldDefinition.bitmap.trim(); // Le bitmap du champ (en chaîne de caractères et en hexa)
    const fieldForm = this.formFields.get(fieldName); // Le champ de formulaire
    if (!fieldForm) {
      console.error("Error, can't get a field from form");
      return false;
    }

    const field = new Field(fieldForm, fieldDefinition);

    const fieldValueAsBytes: Uint8Array = field.fieldValueAsBytes(); // Valeur du champ à mettre en place dans le registre sous la forme d'un tableau d'octets
    // if (registerId === '0202') {
    //   console.info('fieldName: ', fieldName);
    //   console.info("fieldValueAsBytes", fieldValueAsBytes);
    // }
    if (fieldValueAsBytes.byteLength === 0) {
      return false;
    }

    // prettier-ignore
    let minSize = fieldDefinition.hasOwnProperty('registerMinSize') ? fieldDefinition.registerMinSize : fieldValueAsBytes.byteLength;
    if (!minSize) {
      minSize = 0;
    }
    // prettier-ignore
    let maxSize = fieldDefinition.hasOwnProperty('registerMaxSize') ? fieldDefinition.registerMaxSize : fieldValueAsBytes.byteLength;
    if (!maxSize) {
      maxSize = 0;
    }
    const maskAsBytes: Uint8Array = BinUtils.HexStringToUint8Array(fieldBitmap);

    if (minSize === 0) {
      minSize = fieldValueAsBytes.byteLength;
    }
    if (minSize > maxSize) {
      maxSize = minSize;
    }
    let bitLength = 8 * minSize;
    let bitPosition = 0;

    if (registerValue.byteLength < minSize) {
      registerValue = BinUtils.resizeUint8Array(registerValue, minSize);
      //registerValue = BinUtils.ensureSize(registerValue, minSize, maxSize);   // Valeur courante du registre
    }

    if (registerValue.byteLength < maskAsBytes.byteLength) {
      registerValue = BinUtils.resizeUint8Array(registerValue, maskAsBytes.byteLength);
    }

    if (fieldBitmap !== '') {
      bitLength = BinUtils.countConsecutiveOnes(maskAsBytes);
      bitPosition = BinUtils.getOnePositionRight(maskAsBytes);
    }
    
    registerValue = BinUtils.replaceFromRight(registerValue, fieldValueAsBytes, bitPosition, bitLength);
    if (fieldDefinition.fieldType === 'text' || fieldDefinition.fieldType === 'password' || fieldDefinition.fieldType === 'hidden') {
      registerValue = BinUtils.removeLeadingZeros(registerValue);
    }
    return registerValue;
  }

  /**
   * Retourne la liste des registres avec la valeur de chacun en utilisant les valeurs du formulaire
   * Valeur de retour:
   * [
   *    registerId: UInt8Array(...),
   *    registerId: UInt8Array(...),
   * ]
   *
   *    JSON auquel on doit arriver :
   *    {
   *        "02C0": "02",
   *        "0310": "12345678",
   *        "0310": "12345678",
   *        "0311": "AB",
   *        "0327": "00CAFE01FECA02",
   *        "034C": "48656C6C6F2C20776F726C64"
   *    }
   */
  public getRegisters(): IRegistersValues {
    this.setFields();
    this.registers = {};
    // Boucle sur tous les champs du formulaire
    this.formFieldsList.forEach((fieldName) => {
      const fieldDefinition: IFieldAndRegisterDefinition = this.fieldsDefinition[fieldName];
      if (fieldDefinition) {
        if (fieldDefinition.hasOwnProperty('register')) {
          const registerId = fieldDefinition['register'];
          if (registerId.trim() !== '') {
            if (!this.registers.hasOwnProperty(this.getRegisterIndex(registerId))) {
              // Si le registre n'existe pas encore dans la liste des registres, on recherche ses propriétés et on le crée
              this.createNewRegister(registerId);
            }
            const registerValue = this.getRegisterValueFromField(registerId, fieldName);
            if (registerValue !== false) {
              if ((registerValue as Uint8Array).byteLength > 0) {
                //this.registers[registerId] = registerValue as Uint8Array;
                this.setRegisterValue(registerId, registerValue as Uint8Array);
              }
            } else {
              if (fieldDefinition.fieldType === 'text' || fieldDefinition.fieldType === 'password') {
                //console.info("Removing this register because its content is empty", registerId)
                delete this.registers[registerId];
              }
            }
          }
        }
      }
    });

    // Si on est sur la configuration d'un template, on met en place la valeur du LKL
    if (this.isTemplateConfiguration()) {
      this.setLklValue();
    }
    if (hasCheatCode('sc_show_registers')) {
      console.info(this.registers);
    }
    return this.registers;
  }

  // Retourne les registres du lecteur dans un format textuel
  public getRegistersAsJsonArray(): object {
    const deviceRegisters = this.getRegisters();
    const result: IRegistersValuesAsString = {};
    Object.keys(deviceRegisters).forEach((registerId) => {
      result[registerId] = BinUtils.byteArrayToHexString(deviceRegisters[registerId]);
    });
    return result;
  }

  //#region Chargement et sauvegarde des données
  // Retourne le contenu complet du formulaire (pour sauvegarde dans le back office)
  public getFormContent(): IFormFieldValue {
    /*if (!isDevMode()) {
      return this.formFields.value;
    }*/

    // On ne retourne, comme champs, que ceux qui ne sont pas liés à un registre
    const retvalue: IFormFieldValue = {}; // "nom_du_champ": "valeur",
    if (this.notRegisterFields.length === 0) {
      return retvalue;
    }
    this.notRegisterFields.forEach((fieldName) => {
      retvalue[fieldName] = getFieldValue(this.formFields, fieldName);
    });
    return retvalue;
  }

  // Mise en place du contenu du formulaire à partir d'une sauvegarde (brute du formulaire)
  public setFormContent(content: IFormFieldValue, registers: IRegistersValuesAsString): UntypedFormGroup {
    /*if (!isDevMode()) {
      this.formFields.reset();
      this.formFields.patchValue(content);
      this.setFields();
      this.formFields.updateValueAndValidity();
      return this.formFields;
    }*/

    this.formFields.reset();
    // Mise en place des champs qui ne sont pas directement liés à un registre (cas des champs de conditions)
    if (content) {
      this.formFields.patchValue(content);
      this.setFields();
      this.formFields.updateValueAndValidity();
    }

    // Mise en place de la liste des champs à utiliser en fonction des conditions
    this.setFields();

    const registersKeys = Object.keys(registers);
    const formPatchValues: IRegistersValuesAsString = {};
    registersKeys.forEach((registerName) => {
      const registerValueAsHex = registers[registerName];
      const registerFields = this.registersFields[registerName]; // Tous les champs liés au registre
      if (!registerFields) {
        return;
      }
      registerFields.forEach((registerField: IFieldAndRegisterDefinition) => {
        const fieldName = registerField.fieldName ?? '';
        if (this.formFieldsList.indexOf(fieldName) === -1) {
          // Le champ n'est pas marqué comme à utiliser
          return;
        }
        const fieldForm = this.formFields.get(fieldName); // Le champ de formulaire
        if (!fieldForm) {
          console.error("Error, can't get a field from form");
          return;
        }
        const fieldDefinition = this.fieldsDefinition[fieldName];
        const field = new Field(fieldForm, fieldDefinition);
        const fieldValue = field.fieldValueFromBytes(registerValueAsHex);
        formPatchValues[fieldName] = fieldValue;
      });
    });
    this.formFields.patchValue(formPatchValues);
    this.setFields();
    this.formFields.updateValueAndValidity();
    return this.formFields;
  }
  //#endregion

  // Un périphérique est en mode reader si le registre 02C0 == 0x00 || 0x03 || 0x04
  public isDeviceInReaderMode(device: IDeviceList): boolean {
    const registers = this.getRegisters();
    const registersKeys = Object.keys(registers);
    if (registersKeys.length === 0) {
      // Pour l'instant il n'y a rien de configuré donc on va aller voir dans la définition du lecteur
      return device.templatesNfc ? true : false;
    }

    let registerFound = false;
    let isInReaderMode = true;
    for (const registerKey of registersKeys) {
      if (registerKey === '02C0') {
        registerFound = true;
        const registerValue = registers[registerKey];
        if (registerValue.byteLength >= 1) {
          if (registerValue[0] !== 0x00 && registerValue[0] !== 0x03 && registerValue[0] !== 0x04) {
            isInReaderMode = false;
          }
        }
      }
    }
    if (!registerFound) {
      if (device) {
        return device.templatesNfc ? true : false;
      }
      return false;
    }
    return isInReaderMode;
  }

  // Est-ce que le périphérique a du BLE ?
  public deviceHasBle(device: IDeviceList): boolean {
    const registers = this.getRegisters();
    const registersKeys = Object.keys(registers);
    if (registersKeys.length === 0) {
      // Pour l'instant il n'y a rien de configuré donc on va aller voir dans la définition du lecteur
      return device.templatesBle ? true : false;
    }

    let registerFound = false;
    let hasBle = false;
    for (const registerKey of registersKeys) {
      if (registerKey === '02C2') {
        registerFound = true;
        const registerValue = registers[registerKey];
        if (registerValue.byteLength === 1) {
          // tslint:disable-next-line:no-bitwise
          if ((registerValue[0] & 1) === 0x01) {
            hasBle = false;
          }
        }
      }
    }
    if (!registerFound) {
      // On se rabat encore sur la définition du lecteur
      if (device) {
        return device.templatesBle ? true : false;
      }
      return false;
    }
    return hasBle;
  }
}
