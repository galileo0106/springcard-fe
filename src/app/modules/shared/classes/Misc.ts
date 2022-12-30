export class Misc {
  /**
   * Equivalent of Php substr_count() function
   *
   * @param haystack  The string to search in
   * @param needle    The substring to search for
   */
  static substr_count(haystack: string, needle: string): number {
    if (!haystack || !needle) {
      return -1;
    }
    return haystack.split(needle).length - 1;
  }

  /**
   * Retourne un nom de fichier utilisable sur macOS, Linux et Windows
   *
   * @param filename Le nom de fichier à nettoyer
   * @return string Le nom du fichier nettoyé et
   */
  static sanitizeFilename(filename: string): string {
    if (typeof filename !== 'string') {
      throw new Error('Input must be string');
    }
    const replacement = '-';
    const illegalRe = /[\/\?<>\\:\*\|"]/g;
    const controlRe = /[\x00-\x1f\x80-\x9f]/g;
    const reservedRe = /^\.+$/;
    const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
    const windowsTrailingRe = /[\. ]+$/;

    return filename
      .replace(illegalRe, replacement)
      .replace(controlRe, replacement)
      .replace(reservedRe, replacement)
      .replace(windowsReservedRe, replacement)
      .replace(windowsTrailingRe, replacement)
      .substring(0, 255)
      .trim();
  }
}
