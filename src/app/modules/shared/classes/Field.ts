import { AbstractControl } from '@angular/forms';
import { IFieldAndRegisterDefinition } from '@shared/models/ifieldandregisterdefinition.model';
import { BinUtils } from './BinUtils';
import { Misc } from './Misc';

/**
 * Représente un champ de saisie au sens large et permet soit de définir sa valeur soit de récupérer sa valeur
 */
export class Field {
  private field: AbstractControl;
  private fieldSettings: IFieldAndRegisterDefinition;

  constructor(field: AbstractControl, fieldSettings: IFieldAndRegisterDefinition) {
    this.field = field;
    this.fieldSettings = fieldSettings;
  }

  private isString(value: any) {
    return typeof value === 'string' || value instanceof String;
  }

  // private isNumber(value) {
  //   return typeof value === 'number' && isFinite(value);
  // }

  // private isArray(value) {
  //   return value && typeof value === 'object' && value.constructor === Array;
  // }

  // private isFunction(value) {
  //   return typeof value === 'function';
  // }

  // private isObject(value) {
  //   return value && typeof value === 'object' && value.constructor === Object;
  // }

  // private isNull(value) {
  //   return value === null;
  // }

  // private isBoolean(value) {
  //   return typeof value === 'boolean';
  // }

  // private isRegExp(value) {
  //   return value && typeof value === 'object' && value.constructor === RegExp;
  // }

  // private isError(value) {
  //   return value instanceof Error && typeof value.message !== 'undefined';
  // }

  // private isDate(value) {
  //   return value instanceof Date;
  // }

  // private isSymbol(value) {
  //   return typeof value === 'symbol';
  // }

  private getFieldValue(): any {
    if (this.isString(this.field.value)) {
      return this.field.value.trim();
    } else {
      return this.field.value;
    }
  }

  // Is the value of the field, that is represented as an hex value valid?
  private isHexValueValid(): boolean {
    const regex = RegExp('[a-fA-F0-9]*');
    const value = this.getFieldValue();
    if (!value) {
      return true;
    }
    if (!regex.test(value)) {
      return false;
    }
    return value.length % 2 === 0 ? true : false;
  }

  // Is the value of the field, that is represented as an IPv4 value valid?
  private isIpV4ValueValid(): boolean {
    const value = this.getFieldValue();
    if (value === '') {
      return true;
    }
    // count dots
    if (Misc.substr_count(value, '.') !== 3) {
      return false;
    }
    const parts = value.split('.');
    if (parts.length !== 4) {
      return false;
    }
    for (let i = 0; i < 4; i++) {
      if (isNaN(parts[i])) {
        return false;
      }
      if (parts[i] < 0 || parts[i] > 255) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns the value of the current field, that is represented as an IPv4 field as an Uint8Array
   * Note, the format of the field must have been validated !
   */
  private getIpV4ValueAsUint8Array(): Uint8Array {
    const result = new Uint8Array(4);
    const value = this.getFieldValue();
    const parts = value.split('.');
    for (let i = 0; i < 4; i++) {
      result[i] = parseInt(parts[i], 10);
    }
    return result;
  }

  // Returns a color value as an UInt8Array
  private getColorValueAsUint8Array(): Uint8Array {
    let value = this.getFieldValue();
    if (value.substring(0, 1) === '#') {
      value = value.substring(1);
    }
    return BinUtils.hexStringToUint8Array(value);
  }

  // "Convert" an integer value into an Uint8Array
  private getNumericalValueAsUint8Array(): Uint8Array {
    const value = parseInt(this.getFieldValue(), 10);
    return BinUtils.longToByteArray(value, 4);
  }

  /**
   * Retourne la valeur d'un champ, en tenant compte de son type, sous la forme d'un tableau d'octets.
   * La valeur retournée n'est pas celle à mettre directement dans le registre, c'est la valeur décrite dans le xml.
   * C'est à l'appelant de prendre en compte le bitmap pour mettre la bonne valeur dans le registre.
   */
  public fieldValueAsBytes(): Uint8Array {
    let value = new Uint8Array();
    switch (this.fieldSettings.fieldType) {
      case 'hex':
        if (!this.isHexValueValid()) {
          return value;
        }
        if (this.getFieldValue()) {
          value = BinUtils.hexStringToUint8Array(this.getFieldValue());
        }
        break;

      case 'text':
      case 'password':
      case 'hidden':
        if (this.getFieldValue()) {
          value = BinUtils.stringToUint8Array(this.getFieldValue());
          if (value.byteLength > 0) {
            // Si tout le contenu est 0x00 alors on ne retourne rien
            if (BinUtils.isOnlyComposedOfZeros(value)) {
              value = new Uint8Array();
            }
          }
        }
        break;

      case 'ip':
        if (!this.isIpV4ValueValid()) {
          return value;
        }
        value = this.getIpV4ValueAsUint8Array();
        break;

      case 'updown':
        value = this.getNumericalValueAsUint8Array();
        break;

      case 'radios':
        if (this.getFieldValue()) {
          value = BinUtils.hexStringToUint8Array(this.getFieldValue());
        }
        break;

      case 'checkbox':
        if (this.field.value === true || this.field.value === 1) {
          // Coché
          const defaultValue = this.fieldSettings.initialValue as number; //  || '1'
          value = BinUtils.longToByteArray(defaultValue, BinUtils.byteSize(defaultValue));
        } else {
          // Pas coché
          value = new Uint8Array();
        }
        break;

      case 'checkboxes':
        if (this.field.value === true || this.field.value === 1) {
          value = new Uint8Array([0x01]);
        } else {
          value = new Uint8Array([0x00]);
        }
        break;

      case 'color':
        value = this.getColorValueAsUint8Array();
        break;

      case 'list':
        value = BinUtils.hexStringToUint8Array(this.getFieldValue());
        break;
    }
    // if (this.fieldSettings.fieldName === 'id3666_Field') {
    //   console.info('Valeur de id3666_Field:', value);
    // }
    return value;
  }

  /**
   * A partir de la valeur (complète) d'un registre retourne la valeur à mettre en place dans le champ
   * Exemple, pour le registre "0201"
   *  j'ai la valeur              "00000000000000000000000000000031"
   * et le bitmap du champ est    "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
   *
   * registre : "0231"   valeur : "3FF7" bitmap: "2",
   */
  public fieldValueFromBytes(registerValue: string, registerBitmap?: string): any {
    let bitmap = this.fieldSettings.bitmap;
    if (registerBitmap) {
      bitmap = registerBitmap;
    }
    bitmap = bitmap.trim();
    if (bitmap.length === 0) {
      // S'il n'y a pas de bitmap on utilise la valeur du registre en supposant qu'il faut prendre toute la taille du registre
      bitmap = 'FF';
      let repeatTimes = registerValue.length;
      if (this.fieldSettings.registerMaxSize) {
        if (this.fieldSettings.registerMaxSize > registerValue.length) {
          repeatTimes = this.fieldSettings.registerMaxSize; // FFFFFFFFFFFFFFFF
        }
      }
      bitmap = bitmap.repeat(repeatTimes);
    }
    let fieldBitmapAsBytes = BinUtils.hexStringToUint8Array(bitmap);
    let registerValueAsBytes = BinUtils.hexStringToUint8Array(registerValue);

    const fieldBitmapAsBytesLength = fieldBitmapAsBytes.byteLength;
    const registerValueAsBytesLength = registerValueAsBytes.byteLength;
    if (fieldBitmapAsBytesLength > registerValueAsBytesLength) {
      registerValueAsBytes = BinUtils.resizeUint8Array(registerValueAsBytes, fieldBitmapAsBytesLength);
    }

    if (registerValueAsBytesLength > fieldBitmapAsBytesLength) {
      fieldBitmapAsBytes = BinUtils.resizeUint8Array(fieldBitmapAsBytes, registerValueAsBytesLength);
    }

    registerValueAsBytes = BinUtils.AND(registerValueAsBytes, fieldBitmapAsBytes, true);
    const bitLength = BinUtils.countConsecutiveOnes(fieldBitmapAsBytes);
    const bitPosition = BinUtils.getOnePositionRight(fieldBitmapAsBytes);
    const fieldValueAsBytes = BinUtils.extractBitsRight(registerValueAsBytes, bitPosition, bitLength);

    let value: any;
    // La valeur du champ est un tableau de Uint8Array
    switch (this.fieldSettings.fieldType) {
      case 'text':
      case 'password':
      case 'hidden':
        value = BinUtils.fromByteArrayToString(fieldValueAsBytes);
        break;

      case 'hex':
        value = BinUtils.byteArrayToHexString(fieldValueAsBytes);
        break;

      case 'list':
        if (fieldValueAsBytes.byteLength > 0) {
          value = fieldValueAsBytes[0].toString(16);
        } else {
          value = null;
        }
        break;

      case 'ip':
        value = BinUtils.fromByteArrayToString(fieldValueAsBytes);
        break;

      case 'updown':
        value = BinUtils.Uint8ArrayArrayToLong(fieldValueAsBytes.reverse());
        break;

      case 'radios':
        if (fieldValueAsBytes.byteLength > 0) {
          value = fieldValueAsBytes[0].toString(16);
        } else {
          value = null;
        }
        break;

      case 'checkbox':
        if (fieldValueAsBytes.byteLength > 0) {
          value = fieldValueAsBytes[0] === 0x00 ? false : true;
        } else {
          value = null;
        }
        break;

      case 'checkboxes':
        if (fieldValueAsBytes.byteLength > 0) {
          value = fieldValueAsBytes[0] === 0x00 ? false : true;
        } else {
          value = null;
        }
        break;

      case 'color':
        value = '#' + BinUtils.byteArrayToHexString(fieldValueAsBytes);
        break;
    }

    return value;
  }
}
