import { Injectable } from '@angular/core';

/**
 * Parse les APDUs saisis par l'utilisateur et les retourne ligne par ligne
 */
@Injectable()
export class ApduParserService {
  private _parsedLines: string[] = [];
  private _linesCount = 0;
  private _isParsing = false; // Est-ce qu'on est en train de parser le contenu à envoyer (lecteur ou carte) ?
  private _currentPosition = -1;

  constructor() {}

  // Set initial content and parse it
  setContent(content: string): boolean {
    this._isParsing = false;
    this._linesCount = 0;
    this._currentPosition = -1;
    content = content.trim();
    if (content.length === 0) {
      return false;
    }
    const lines = content.split('\n');
    if (lines.length === 0) {
      return false;
    }
    this._parsedLines = [];
    let linesCount = lines.length;
    for (let i = 0; i < linesCount; i++) {
      const line = lines[i];
      if (line.trim() !== '') {
        this._parsedLines.push(line);
        this._linesCount++;
      }
    }
    return true;
  }

  // Retourne le contenu qui a été parsé pour l'ajouter dans l'historique
  getParsedContent(): string {
    return this._parsedLines.join('\n');
  }

  // Returns the count of lines, after the content has been parsed
  getLinesCount(): number {
    return this._linesCount;
  }

  // Returns the first parsed line or an empty string if there's not one
  getFirstLine() {
    this._currentPosition = 0;
    this._isParsing = true;
    return this._parsedLines.length === 0 ? '' : this._parsedLines[0];
  }

  private isEven(n: number): boolean {
    return n % 2 === 0;
  }

  // Ne conserve, d'un APDU, que tout ce qui est de l'hexa
  private normalyseApdu(line: string): string | boolean {
    if (!line) {
      return false;
    }
    line = line.trim();
    const regex = RegExp('[A-Ha-h0-9]{1}');
    let output = '';
    for (let i = 0; i < line.length; i++) {
      const char = line.charAt(i);
      if (regex.test(char)) {
        output += char;
      }
    }
    if (!this.isEven(output.length)) {
      return false;
    }
    return output;
  }

  // Returns the next line of null if we are at the end
  getNextLine(): string | boolean {
    this._currentPosition++;
    if (this._currentPosition > this._linesCount) {
      this._currentPosition = -1;
      this._linesCount = -1;
      this._isParsing = false;
      return false;
    } else {
      this._isParsing = true;
      return this.normalyseApdu(this._parsedLines[this._currentPosition]);
    }
  }

  // Do we have content to send?
  hasContent(): boolean {
    return this._linesCount > 0 ? true : false;
  }

  // Are we currently reading and sending lines?
  isParsing(): boolean {
    return this._isParsing;
  }

  stopParsing() {
    this._isParsing = false;
    this._currentPosition = this._linesCount + 1;
  }

  // Convertion d'une chaîne en hexa vers un Uint8Array (par exmeple "0D0A" en [0x0D, 0x0A])
  private hexStringToUint8Array(hexString: string): Uint8Array {
    // Remove any useless character
    hexString = hexString.trim();
    hexString = hexString.replace('0x', '');
    hexString = hexString.replace('\n', '');
    var length2 = hexString.length;
    var hexString2 = '';
    for (let j = 0; j < length2; j++) {
      const car = hexString.substring(j, j + 1);
      if (car !== ' ' && car != ':' && car != ';') {
        hexString2 += car;
      }
    }
    hexString = hexString2;

    if (hexString === '' || hexString.length % 2 !== 0) {
      return new Uint8Array();
    }

    const result = new Uint8Array(hexString.length / 2);
    const length = hexString.length;
    let cpt = 0;
    for (let i = 0; i < length; i += 2) {
      result[cpt] = parseInt(hexString.substring(i, i + 2), 16);
      cpt++;
    }
    return result;
  }

  // Est-ce que l'octet passé en paramètre est "imprimable" ?
  private isASCIIChar(b: number): boolean {
    return b < 0x20 || b >= 0x7f ? false : true;
  }

  // Conversion d'un octet en sa représentation en ASCII
  private getASCIIChar(b: number): string {
    return String.fromCharCode(b);
  }

  // Conversion d'une chaîne ASCII contenant de l'hexa vers une représentation en ASCII
  public hexStringToAscii(content: string): string {
    if (!content) {
      return '';
    }
    content = content.trim();
    if (content === '') {
      return '';
    }
    const lines = content.split('\n');
    const linesCount = lines.length;
    if (linesCount === 0) {
      return '';
    }
    let out = '';
    for (let i = 0; i < linesCount; i++) {
      const lineAsBytes = this.hexStringToUint8Array(lines[i]);
      let s = '';
      for (let j = 0; j < lineAsBytes.length; j++) {
        if (this.isASCIIChar(lineAsBytes[j])) {
          s += this.getASCIIChar(lineAsBytes[j]);
        } else {
          s += ' ';
        }
      }
      out += s + '\n';
    }
    return out;
  }

  // Prends une chaîne en hexa et insère un espace entre chaque octet
  public spacedHexString(content: string): string {
    if (!content) {
      return '';
    }
    content = content.trim();
    if (content === '') {
      return '';
    }
    let result = '';
    const length = content.length;
    for (let i = 0; i < length; i += 2) {
      result += content.substring(i, i + 2) + ' ';
    }
    return result.trim();
  }
}
