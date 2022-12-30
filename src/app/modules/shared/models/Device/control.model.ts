/**
 * Enable the end user to act on a device, i.e restart it or stop it or ask it to wink
 */
export interface IControl {
  Id: string;
  Channel: string;
  wink?: boolean;
  restart?: boolean;
  stop?: boolean;
}
