// Voir https://docs.springcard.com/books/Companion/REST_API/PCSC/Objects/PCSC_READER
export interface IPcScReadersList {
  ReaderId: string;
  ParentDeviceId?: string;
  Name: string;
  SerialNumber?: string;
  VendorName?: string;
  ProductName?: string;
  SlotName?: string;
  Status: string;
  ATR?: string;
  Error: boolean;
  Present: boolean;
  InUse: boolean;
  Owner?: boolean;
}
