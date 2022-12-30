export interface IUserHistory {
  id: number;
  user_id: number;
  created: Date;
  user_name: string;
  action: string;
  device_name?: string;
  serial_number?: string;
}
