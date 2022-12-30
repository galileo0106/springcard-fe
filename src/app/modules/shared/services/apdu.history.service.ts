import { Injectable } from '@angular/core';
import { IApduHistory } from '@shared/models/apdu.history.model';

/**
 * Gère l'historique des APDUs saisis par l'utilisateur (ajout, recherche, précédent, suivant, premier, dernier)
 */
@Injectable()
export class ApduHistoryService {
  readonly _maxApdusCount = 30; // Nombre maxi d'APDUs qu'on retient
  readonly lsName = 'sc_apdu_history'; // Le nom à donner dans la localStorage
  private _apdus: IApduHistory[] = []; // Le tableau qui contient les APDUs
  private _index = -1; // Pointeur sur la position *courante*

  get index(): number {
    return this._index;
  }

  constructor() {
    this.loadExistingApdus();
  }

  loadExistingApdus() {
    const existingApdus = localStorage.getItem(this.lsName);
    if (existingApdus === null) {
      this._apdus = [];
      this._index = -1;
    } else {
      this._apdus = JSON.parse(existingApdus);
      this._index = this._apdus.length - 1;
    }
  }

  count(): number {
    return this._apdus.length;
  }

  private persistApdus() {
    localStorage.setItem(this.lsName, JSON.stringify(this._apdus));
  }

  private apduAlreadyExist(apdu: string, mode: string): boolean {
    apdu = apdu.trim().toLowerCase();
    mode = mode.trim().toLowerCase();
    if (this._apdus.length === 0) {
      return false;
    }
    for (const existingApdu of this._apdus) {
      if (existingApdu.apdu.trim().toLowerCase() === apdu && existingApdu.mode.trim().toLowerCase() === mode) {
        return true;
      }
    }
    return false;
  }

  append(apdu: string, mode: string) {
    apdu = apdu.trim();
    if (this.apduAlreadyExist(apdu, mode)) {
      // @todo, est-ce qu'on place le pointeur sur cet index ?
      return;
    }

    this._index++;
    if (this.index >= this._maxApdusCount) {
      this._index = 0;
    }

    const apduObject: IApduHistory = {
      mode: mode,
      apdu: apdu,
    };
    this._apdus[this._index] = apduObject;
    this.persistApdus();
  }

  previous(): IApduHistory | null {
    if (this.count() === 0) {
      return null;
    }
    this._index--;
    if (this._index < 0) {
      this._index = 0;
    }
    return this._apdus[this._index];
  }

  next(): IApduHistory | null {
    if (this.count() === 0) {
      return null;
    }
    this._index++;
    if (this._index >= this._maxApdusCount) {
      this._index = this._maxApdusCount - 1;
    }
    return this._apdus[this._index];
  }

  last(): IApduHistory | null {
    if (this.count() === 0) {
      return null;
    }
    this._index = this.count() - 1;
    return this._apdus[this._index];
  }

  first(): IApduHistory | null {
    if (this.count() === 0) {
      return null;
    }
    this._index = 0;
    return this._apdus[this._index];
  }

  removeAll() {
    this._apdus = [];
    this._index = -1;
    this.persistApdus();
  }

  hasPrevious(): boolean {
    if (this.count() === 0) {
      return false;
    }
    return this._index !== 0 ? true : false;
  }

  hasNext(): boolean {
    if (this.count() === 0) {
      return false;
    }
    return this._index !== this.count() - 1 ? true : false;
  }
}
