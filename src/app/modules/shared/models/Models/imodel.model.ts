export interface IModel {
  id: number;
  title: string;
  mode: number;
  apdu: string;
  created: Date;
  modified: Date;
  group_id: number | null;
  group: string;
}
