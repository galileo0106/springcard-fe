import { IDevicePcsc } from '../Pcsc/device.Pcsc.model';

/**
 * Représente un objet Device retourné par le service de SC (voir https://docs.springcard.com/books/Companion/REST_API/Devices/Objects/DEVICE/index)
 */
export interface IDeviceResponse {
  DeviceId: string;
  Name: string;
  FriendlyName?: string;
  Channel: string;
  Profile: string;
  Status: string;
  PnpId: string;
  Mode: string;
  VendorId: number;
  ProductId: number;
  VendorName?: string;
  ProductName?: string;
  ProductVariant?: string;
  SerialNumber?: string;
  Version: string;
  Firmware?: string;
  UniqueId: string;
  ConfigId?: string;
  Hardware?: string;
  Characteristics?: string;
  Pcsc?: IDevicePcsc[];
  HidInstance?: string;
  CommPort?: string[];
  PhysAddress?: string;
  IpAddress?: string;
  IpAddress6?: string;
  SealSubject?: string;
  SealSignature?: string;
  Genuine?: boolean;
  Inventory?: string;
  Location?: string;
  Application?: string;
  LicenseKey?: string;
  LicenseCryptogram?: string;
  Binding?: string;
}
