export class BinUtils {
  /**
   * Debug a jsonErrorObject (from the BLE plugin)
   *
   * @param  object jsonObject 	Object to dump
   * @return void
   */
  static _do(jsonObject: any) {
    if (jsonObject !== null && typeof jsonObject === 'object') {
      console.info(jsonObject);
    }
  }

  /**
   * Format a time's part on two or 3 digits
   */
  static checkTime(i: number, timeLength: number): string {
    if (i >= 100) {
      return i.toString();
    }
    if (timeLength === 3) {
      if (i < 10) {
        return '00' + i;
      } else if (i >= 10 && i < 100) {
        return '0' + i;
      }
    }
    return i < 10 ? '0' + i.toString() : i.toString();
  }

  /**
   * Returns the time on the form hh:mm:ss-ms
   */
  static getTime(): string {
    const now = new Date();
    const h = BinUtils.checkTime(now.getHours(), 2);
    const m = BinUtils.checkTime(now.getMinutes(), 2);
    const s = BinUtils.checkTime(now.getSeconds(), 2);
    const ms = BinUtils.checkTime(now.getMilliseconds(), 3);
    return h.toString() + ':' + m.toString() + ':' + s.toString() + '.' + ms.toString();
  }

  /**
   * Converts an hexadecimal string to an Uint8Array array (i.e "0D0A" => [0x0D, 0x0A])
   * @param hexString the hexadecimal string to convert
   */
  static hexStringToUint8Array(hexString: string): Uint8Array {
    if (hexString === null) {
      return new Uint8Array(0);
    }
    if (hexString !== '' && hexString.length % 2 !== 0) {
      hexString = '0' + hexString;
    }

    if (hexString === '' || hexString.length % 2 !== 0) {
      return new Uint8Array(0);
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

  /**
   * Converts a byte array to its hexadecimal representation
   * Example [0x0D, 0x0A] => "0D0A"
   */
  static byteArrayToHexString(arr: Uint8Array): string {
    let result = '';
    if (arr.length !== 0) {
      arr.forEach((element) => {
        let str = element.toString(16);
        str = str.length === 0 ? '00' : str.length === 1 ? '0' + str : str.length === 2 ? str : str.substring(str.length - 2, str.length);
        result += str;
      });
    }
    return result.toUpperCase();
  }

  /**
   * Converts an Uint8Array array into its ASCII representation
   * Example [0x65, 0x66] => "AB"
   */
  /*static Uint8ArrayToString(content: Uint8Array): string {
    return String.fromCharCode.apply(null, content);
  }*/

  /**
   * Converts a byte array to a string (ie [0x30, 0x31] to "01"). The function do not converts 0x00
   */

  static byteToString(bytes: Uint8Array, start: number, length: number, totlen: number): string {
    let result = '';
    let res;
    for ( var i = 0 ; i < length &&  start + length <= totlen ; i ++ ) {
      const byte = bytes[i + start];
      let text = byte.toString(16);
      let convtext = (byte < 16 ? '%0' : '%') + text;
      result += convtext;
    }
    try {
      res = decodeURIComponent(result);
      return res;
    }
    catch {
      return '?';
    }
  }

   static toString(bytes: Uint8Array): string {
  	var result = '';
    const arrayLength: number = bytes.byteLength;
    for (var i = 0; i < arrayLength; ++i) {
      let res1 = this.byteToString(bytes, i, 1, arrayLength);
      let res2 = this.byteToString(bytes, i, 2, arrayLength);
      let res3 = this.byteToString(bytes, i, 3, arrayLength);
      if ( res1 != '?' )
        result += res1;
      else {
        if ( res2 != '?' ) {
          result += res2;
          i ++;
        }
        else {
          if ( res3 != '?' ) {
            result += res3;
            i += 2;
          }
          // else result += '?';
        }
      }
    }
    return result;
};

  static fromByteArrayToString(byteArray: Uint8Array): string {
    return this.toString(byteArray);
  }

  /**
   * Compare two Uint8Arrays to verify if they are equals
   */
  static areUint8ArrayEquals(first: Uint8Array, second: Uint8Array): boolean {
    if (first.byteLength !== second.byteLength) {
      return false;
    }
    for (let i = 0; i !== first.byteLength; i++) {
      if (first[i] !== second[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Set some bytes of an array from another array
   *
   * @param Uint8Array destination  	The destination array
   * @param Uint8Array source       	The source array
   * @param integer sourceIndex  		Index in the source array
   * @param integer sourceLength 		Length from the source array
   */
  static setArrayBytesFromArray(
    destination: Uint8Array,
    destinationStartIndex: number,
    source: Uint8Array,
    sourceIndex: number,
    sourceLength: number,
  ): Uint8Array {
    for (let i = sourceIndex; i <= sourceIndex + sourceLength - 1; i++) {
      destination[destinationStartIndex] = source[i];
      destinationStartIndex++;
    }
    return destination;
  }

  /**
   * Copy a portion of an array to another one
   * (a "port" of the C# "Array.Copy" method)
   */
  static ArrayCopy(
    sourceArray: Uint8Array,
    sourceIndex: number,
    destinationArray: Uint8Array,
    destinationIndex: number,
    length: number,
  ): Uint8Array {
    let cpt = 0;
    for (let i = sourceIndex; i < sourceIndex + length; i++) {
      destinationArray[destinationIndex + cpt] = sourceArray[i];
      cpt++;
    }
    return destinationArray;
  }

  /**
   * A "port" of the C# "Array.CopyTo" method
   * Copy all the content of the source array to the destinationArray from destinationIndex
   */
  static CopyTo(destinationArray: Uint8Array, sourceArray: Uint8Array, destinationIndex: number): Uint8Array {
    const sourceLength = sourceArray.byteLength;
    for (let i = 0; i < sourceLength; i++) {
      destinationArray[i + destinationIndex] = sourceArray[i];
    }
    return destinationArray;
  }

  /**
   * Copy some elements from an Uint8Array and return a new array
   *
   * @param  Uint8Array src   		Source array
   * @param  integer srcOffset     	Starting index
   * @param  Uint8Array dstOffset    	Ending index
   * @return Uint8Array
   */
  static blockCopy(src: Uint8Array, srcOffset: number, dstOffset: number): Uint8Array {
    switch (arguments.length) {
      case 0: // no parameters
        throw new Error('illegal arguments count');

      case 1: // We just have src
        srcOffset = 0;
        dstOffset = src.length;
        break;

      case 2: // We have src and srcOffset
        dstOffset = src.length;
        break;
    }

    if (srcOffset > dstOffset) {
      const exchange = dstOffset;
      dstOffset = srcOffset;
      srcOffset = exchange;
    }
    const dest = new Uint8Array(dstOffset - srcOffset);
    let i = 0;
    let cpt = 0;
    for (cpt = srcOffset; cpt <= dstOffset; cpt++) {
      dest[i] = src[cpt];
      i++;
    }
    return dest;
  }

  /**
   * Merge two Uint8Array arrays
   *
   * @param Uint8Array a First array
   * @param Uint8Array b Second array
   * @return Uint8Array 	a new Uint8Array
   */
  static mergeUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
    const result = new Uint8Array(a.length + b.length);
    result.set(a);
    result.set(b, a.length);
    return result;
  }

  /**
   * Converts (split) a long to a byte array
   *
   * @param  long value     The value to convert
   * @param  int arraySize Size of the array we want
   * @return array
   */
  static longToByteArray(value: number, arraySize: number): Uint8Array {
    const byteArray = new Uint8Array(arraySize);
    for (let index = 0; index < byteArray.length; index++) {
      // tslint:disable-next-line:no-bitwise
      const byte = value & 0xff;
      byteArray[index] = byte;
      value = (value - byte) / 256;
    }
    return byteArray.reverse();
  }

  /**
   * Computes the number of bytes required to represent an integer
   * @param x the number
   * @return number
   */
  static byteSize(x: number): number {
    if (x < 0) {
      return 0;
    }
    let s = 1;
    // tslint:disable-next-line:no-bitwise
    while (s < 8 && x >= 1 << (s * 8)) {
      s++;
    }
    return s;
  }

  /**
   * Converts an hex array containing a string representation to an Uint8Array (i.e [66, 55..] to [0xB7])
   *
   * @param  string hexString 	The hex string to convert from
   * @return Uint8Array         The converted value
   */
  static hexArrayToUint8Array(hexArray: number[]): Uint8Array {
    if (hexArray.length === 0 || hexArray.length % 2 !== 0) {
      return new Uint8Array(0);
    }
    const result = new Uint8Array(hexArray.length / 2);
    const length = hexArray.length;
    let cpt = 0;
    for (let i = 0; i < length; i += 2) {
      result[cpt] = parseInt(String.fromCharCode(hexArray[i]) + String.fromCharCode(hexArray[i + 1]), 16);
      cpt++;
    }
    return result;
  }

  /**
   * Converts a string to an Uint8Array
   * 
   * @param  string stringValue String to convert
   * @return Uint8Array
   */

  static byteSizeOfString(str:string): number {
    return new Blob([str]).size;;
  }

  static stringToUint8Array(stringValue: string): Uint8Array {
    let len = this.byteSizeOfString(stringValue);
    stringValue = encodeURIComponent(stringValue);
    const strLen = stringValue.length;
    let buf = new Uint8Array(len);
    let j = 0;
    for (let i = 0; i < strLen; i++) {
      if ( stringValue[i] == '%' )  {
        buf[j ++] = parseInt(stringValue.substring(i + 1, i + 3), 16);
        i += 2;
      }
      else
        buf[j ++] = stringValue.charCodeAt(i);
    }
    return buf;
  }

  /**
   * Validate that a byte is a printable ASCII char
   *
   * @param  byte   		The byte to validate
   * @return Boolean
   */
  static isASCIIChar(byte: number): boolean {
    return byte < 0x20 || byte >= 0x7f ? false : true;
  }

  /**
   * Converts a byte to its ASCII representation
   *
   * @param  byte  The byte we want the ASCII representation
   * @return char
   */
  static getASCIIChar(byte: number): string {
    return String.fromCharCode(byte);
  }

  /**
   * Converts some texts formated as Hexadecimal to its ASCII representation
   * All non printable characters are replaced with a space
   *
   * @param  string content The array to convert
   * @return string       The ASCII representation
   */
  static HexStringToAscii(content: string): string {
    content = content.trim();
    if (content === '') {
      return '';
    }
    const lines: string[] = content.split('\n');
    const linesCount = lines.length;
    if (linesCount === 0) {
      return '';
    }

    let out = '';
    for (let i = 0; i < linesCount; i++) {
      const lineAsBytes = BinUtils.hexStringToUint8Array(lines[i]);
      let s = '';
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < lineAsBytes.length; j++) {
        if (BinUtils.isASCIIChar(lineAsBytes[j])) {
          s += BinUtils.getASCIIChar(lineAsBytes[j]);
        } else {
          s += ' ';
        }
      }
      out += s + '\n';
    }
    return out;
  }

  /**
   * Converts an Uint8Array containing a string to it's textual representation
   * From:
   * 	Uint8Array([0x31, 0x2e, 0x33, 0x37, 0x2d, 0x30, 0x2d, 0x67, 0x30, 0x31, 0x38, 0x38, 0x36, 0x38, 0x34, 0x38, 0x00, 0x00, 0x00, 0x00])
   * To:
   * 	1.37-0-g01886848
   *
   * @param  Uint8Array 	Content Byte array containing the string
   * @return string       Textual representation
   */
  /*static stringFromByteArray(content): string {
    if (content.length === 0) {
      return '';
    }
    const contentLength = content.length;
    let out = '';
    for (let i = 0; i < contentLength; i++) {
      if (BinUtils.isASCIIChar(content[i])) {
        out += BinUtils.getASCIIChar(content[i]);
      } else {
        out += ' ';
      }
    }
    return out;
  }*/

  /**
   * Convert a size in bytes to a more "human" readable value
   *
   * @param number bytes  The size to convert
   * @return string
   */
  static bytesToSize(bytes: number): string {
    const sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];
    if (bytes === 0) {
      return '0 Byte';
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }

  /**
   * Portable version of Uint8Array.slice()
   * function that is not available in iOs 9
   *
   * @param sourceArray Uint8Array  Source array
   * @param startIndex number       Starting position
   * @param stopIndex number        Ending position
   */
  static portableUint8ArraySlice(sourceArray: Uint8Array, startIndex: number, stopIndex: number = sourceArray.byteLength): Uint8Array {
    if (stopIndex > sourceArray.byteLength) {
      stopIndex = sourceArray.byteLength;
    }
    const dest = new Uint8Array(stopIndex - startIndex);
    let index = 0;
    for (let i = startIndex; i < stopIndex; i++) {
      dest[index] = sourceArray[i];
      index++;
    }
    return dest;
  }

  /**
   * For a given (string) bitmap/bitmask, returns the position of the first significative byte (from the right) and the position of the last significative byte (from the right)
   * For example : "00FF000000" returns {startingPosition: 3, endingPosition: 3}
   * For "08", returns {startingPosition: 0, endingPosition: 0}
   * For "8000", returns startingPosition: 1, endingPosition: 1}
   * @param bitmap The bitmap to use
   */
  static getBitmapFirstAndLastBytePosition(bitmap: string): object {
    bitmap = bitmap.trim();
    if (bitmap.length === 0) {
      return {};
    }
    if (bitmap.length % 2 !== 0) {
      return {};
    }
    const bitmapInformation = {
      startingPosition: 0,
      endingPosition: -1,
    };
    let position = 0;
    let isStartingPositionSet = false;
    for (let i = bitmap.length - 2; i >= 0; i -= 2) {
      const byte = bitmap.substr(i, 2);
      if (byte !== '00') {
        if (!isStartingPositionSet) {
          isStartingPositionSet = true;
          bitmapInformation.startingPosition = position;
        } else {
          bitmapInformation.endingPosition = position;
        }
      }
      position++;
    }
    if (bitmapInformation.endingPosition === -1) {
      bitmapInformation.endingPosition = bitmapInformation.startingPosition;
    }
    return bitmapInformation;
  }

  // Extract the significative mask from a bitmap
  static getTrimedBitmapSizeFromMask(bitmap: string): object {
    bitmap = bitmap.trim();
    if (bitmap.length === 0) {
      return {};
    }
    if (bitmap.length % 2 !== 0) {
      return {};
    }
    const bitmapInformation = {
      size: 0,
      trimedBitmap: '',
    };

    let startingPosition = 0;
    // Remove 0x00s on the left side
    for (let i = 0; i <= bitmap.length; i += 2) {
      if (bitmap.substring(i, i + 2) === '00') {
        startingPosition += 2;
      } else {
        break;
      }
    }

    if (startingPosition !== bitmap.length) {
      bitmap = bitmap.substring(startingPosition);
    }

    // Remove 0x00s on the right side
    let endingPosition = bitmap.length;
    for (let i = bitmap.length - 2; i >= 0; i -= 2) {
      if (bitmap.substr(i, 2) === '00') {
        endingPosition = i;
      } else {
        break;
      }
    }

    if (endingPosition > 0) {
      bitmap = bitmap.substring(0, endingPosition);
    }
    bitmapInformation.trimedBitmap = bitmap;
    bitmapInformation.size = bitmap.length / 2;
    return bitmapInformation;
  }

  // Returns a binary representation of a decimal value
  /*static dec2bin(dec): string {
    // tslint:disable-next-line:no-bitwise
    return (dec >>> 0).toString(2);
  }*/

  // Returns the position of the first significative bit of a bitmap (permet de faire des décalages vers la gauche << pour les mask)
  static getFirstSignificativeBitPosition(bitmap: number): number {
    let position = 0;
    for (let i = 0; i < 8; i++) {
      const andValue = Math.pow(2, i);
      // tslint:disable-next-line:no-bitwise
      if ((bitmap & andValue) !== 0) {
        return position;
      }
      position++;
    }
    return 0;
  }

  /**
   * Set a byte value to a new value by using a bitmap and a value to set
   *
   * @param value Byte initial value
   * @param newValue New value to give to the byte according to the bitmap
   * @param bitmap The bitmap to be applyed as an hexadecimal value
   */
  static setByteNewValueFromMask(value: number, newValue: number, bitmap: string): number {
    const mask = parseInt(bitmap, 16);
    const bitPosition = this.getFirstSignificativeBitPosition(mask);
    // tslint:disable-next-line:no-bitwise
    newValue = newValue << bitPosition;
    // tslint:disable-next-line:no-bitwise
    return (value & ~mask) | (newValue & mask);
  }

  // Retourne la position (depuis la droite), du premier octet significatif et le bitmap épuré des octets non significatifs
  static getFirstSignificativeByte(bitmap: string): object | null {
    bitmap = bitmap.trim();
    if (bitmap.length === 0) {
      return null;
    }
    if (bitmap.length % 2 !== 0) {
      return null;
    }
    let position = 0;
    for (let i = bitmap.length - 2; i >= 0; i -= 2) {
      const byte = bitmap.substr(i, 2);
      if (byte !== '00') {
        break;
      }
      position++;
    }

    return {
      bitmap: bitmap.substr(0, bitmap.length - position * 2),
      bytePosition: position,
    };
  }

  // Resize an Uint8Array to a new (greater) size than its original size and pad new bytes on the left with a given value
  static resizeUint8Array(sourceArray: Uint8Array, newSize: number, fillWith: number = 0x00): Uint8Array {
    if (sourceArray.byteLength > newSize) {
      return sourceArray;
    }
    const newByteArray = new Uint8Array(newSize);
    if (fillWith !== 0) {
      for (let i = 0; i < newSize; i++) {
        newByteArray[i] = fillWith;
      }
    }
    let position = newSize - 1;
    for (let i = sourceArray.byteLength - 1; i >= 0; i--) {
      newByteArray[position] = sourceArray[i];
      position--;
    }
    return newByteArray;
  }

  static ensureSize(buffer: Uint8Array, minSize: number, maxSize: number): Uint8Array {
    let resultSize = 0;
    resultSize = buffer.byteLength;
    if (resultSize < minSize) {
      resultSize = minSize;
    }
    if (maxSize >= minSize && resultSize > maxSize) {
      resultSize = maxSize;
    }
    if (resultSize === buffer.byteLength) {
      return buffer;
    }
    let result = new Uint8Array(resultSize);
    let copySize = buffer.byteLength;
    if (copySize > resultSize) {
      copySize = resultSize;
    }
    result = BinUtils.ArrayCopy(buffer, 0, result, 0, copySize);
    return result;
  }

  static countConsecutiveOnes(buffer: Uint8Array): number {
    let result = 0;
    let one_seen = false;
    let zero_after_one_seen = false;

    if (buffer.byteLength === 0) {
      return 0;
    }
    for (let i = 0; i < buffer.byteLength; i++) {
      for (let j = 7; j >= 0; j--) {
        // tslint:disable-next-line:no-bitwise
        if ((buffer[i] & (1 << j)) !== 0) {
          if (zero_after_one_seen) {
            return 0;
          }
          one_seen = true;
          result++;
        } else {
          if (one_seen) {
            zero_after_one_seen = true;
          }
        }
      }
    }
    return result;
  }

  static getOnePositionRight(buffer: Uint8Array): number {
    if (buffer === null || buffer.byteLength === 0) {
      return -1;
    }
    let result = 0;
    for (let i = buffer.byteLength - 1; i >= 0; i--) {
      for (let j = 0; j < 8; j++) {
        // tslint:disable-next-line:no-bitwise
        if ((buffer[i] & (1 << j)) !== 0) {
          return result;
        }
        result++;
      }
    }
    return -1;
  }

  static setBitAt(buffer: Uint8Array, offset: number, value: boolean): Uint8Array {
    const byte_offset = Math.trunc(offset / 8);
    const bit_offset = 7 - (offset % 8);

    // tslint:disable-next-line:no-bitwise
    let bit_mask = 1 << bit_offset; // >>> 0

    if (value) {
      // tslint:disable-next-line:no-bitwise
      buffer[byte_offset] |= bit_mask;
    } else {
      // tslint:disable-next-line:no-bitwise
      bit_mask = bit_mask ^ 0x0ff;
      // tslint:disable-next-line:no-bitwise
      buffer[byte_offset] &= bit_mask;
    }
    return buffer;
  }

  static getBitAt(buffer: Uint8Array, offset: number): boolean {
    if (buffer === null || offset < 0) {
      return false;
    }

    const byte_offset = Math.trunc(offset / 8);
    if (byte_offset >= buffer.byteLength) {
      return false;
    }

    const bit_offset = 7 - (offset % 8);

    // tslint:disable-next-line:no-bitwise
    if ((buffer[byte_offset] & (1 << bit_offset)) !== 0) {
      return true;
    }
    return false;
  }

  static replaceFromRight(buffer: Uint8Array, replace: Uint8Array, offset_from_right: number, length_bits: number): Uint8Array {
    if (buffer == null || replace == null) {
      throw new Error('A parameter is null');
    }
    let result = new Uint8Array(buffer.byteLength);

    for (let i = 0; i < buffer.byteLength; i++) {
      result[i] = buffer[i];
    }

    let offset_replace = 8 * replace.byteLength - 1;
    let offset_buffer = 8 * buffer.byteLength - offset_from_right - 1;

    for (let i = 0; i < length_bits; i++) {
      result = BinUtils.setBitAt(result, offset_buffer--, BinUtils.getBitAt(replace, offset_replace--));
    }
    return result;
  }

  static HexStringToUint8Array(hexString: string): Uint8Array {
    if (hexString.trim().length === 0) {
      return new Uint8Array();
    }
    if (hexString.length % 2 !== 0) {
      hexString = '0' + hexString;
    }
    const result = new Uint8Array(hexString.length / 2);
    let cpt = 0;
    for (let i = 0; i <= hexString.length - 2; i += 2) {
      result[cpt] = parseInt(hexString.substr(i, 2), 16);
      cpt++;
    }
    return result;
  }

  static bufferOperation(buffer1: Uint8Array, buffer2: Uint8Array, expand_instead_of_truncate: boolean, operation: string): Uint8Array {
    if (buffer1.byteLength === 0 && buffer2.byteLength === 0) {
      return new Uint8Array();
    }

    let length1 = 0;
    if (buffer1.byteLength !== 0) {
      length1 = buffer1.byteLength;
    }

    let length2 = 0;
    if (buffer2.byteLength !== 0) {
      length2 = buffer2.byteLength;
    }

    let length = 0;
    if (length1 === length2) {
      length = length1;
    } else if (length1 > length2) {
      if (expand_instead_of_truncate) {
        length = length1;
      } else {
        length = length2;
      }
    } else if (length2 > length1) {
      if (expand_instead_of_truncate) {
        length = length2;
      } else {
        length = length1;
      }
    }
    const result = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      let b1 = 0;
      let b2 = 0;
      if (i < length1) {
        b1 = buffer1[i];
      }
      if (i < length2) {
        b2 = buffer2[i];
      }
      switch (operation.trim().toUpperCase()) {
        case 'AND':
          // tslint:disable-next-line:no-bitwise
          result[i] = b1 & b2;
          break;

        case 'OR':
          // tslint:disable-next-line:no-bitwise
          result[i] = b1 | b2;
          break;

        case 'XOR':
          // tslint:disable-next-line:no-bitwise
          result[i] = b1 ^ b2;
          break;
      }
    }
    return result;
  }

  static AND(buffer1: Uint8Array, buffer2: Uint8Array, expand: boolean): Uint8Array {
    return BinUtils.bufferOperation(buffer1, buffer2, expand, 'AND');
  }

  static extractBitsRight(buffer: Uint8Array, offset_from_right: number, length_bits: number): Uint8Array {
    if (buffer.byteLength === 0) {
      return new Uint8Array();
    }
    const byte_length = Math.trunc((length_bits + 7) / 8);
    let result = new Uint8Array(byte_length);
    let offset_dst = 8 * byte_length - 1;
    let offset_src = 8 * buffer.byteLength - offset_from_right - 1;

    for (let i = 0; i < length_bits; i++) {
      result = BinUtils.setBitAt(result, offset_dst--, BinUtils.getBitAt(buffer, offset_src--));
    }
    return result;
  }

  static Uint8ArrayArrayToLong(byteArray: Uint8Array): number {
    let value = 0;
    for (let i = byteArray.byteLength - 1; i >= 0; i--) {
      value = value * 256 + byteArray[i];
    }
    return value;
  }

  /**
   * Permet de passer de 0000000000000000000000000000000000000000000000000000000074657374 à 74657374
   * @param buffer Le buffer dont on veut supprimer les 0x00
   */
  static removeLeadingZeros(buffer: Uint8Array): Uint8Array {
    if (buffer.byteLength === 0) {
      return new Uint8Array();
    }

    let startingPosition = -1;
    for (let i = 0; i < buffer.byteLength; i++) {
      if (buffer[i] !== 0x00) {
        startingPosition = i;
        break;
      }
    }
    if (startingPosition === -1) {
      return new Uint8Array();
    }
    const newBufferSize = buffer.byteLength - startingPosition;
    let outputBufferPointer = 0;
    const newBuffer = new Uint8Array(newBufferSize);
    for (let i = 0; i < buffer.byteLength; i++) {
      if (buffer[i] !== 0x00) {
        newBuffer[outputBufferPointer] = buffer[i];
        outputBufferPointer++;
      }
    }
    return newBuffer;
  }

  // Est-ce que le buffer d'entrée n'est composé que de 0x00 ?
  static isOnlyComposedOfZeros(buffer: Uint8Array): boolean {
    if (buffer.byteLength === 0) {
      return false;
    }
    for (let i = 0; i < buffer.byteLength; i++) {
      if (buffer[i] != 0x00) {
        return false;
      }
    }
    return true;
  }
}
