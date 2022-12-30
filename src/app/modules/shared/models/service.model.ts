/**
 * Interface to the JSON answer giving information about the SC Service
 */
export interface Service {
  Name: string;
  Version: string;
  API: string;
  Platform: string;
  Mode: string;
  WebSocketPort: number;
  WebSocketClients: number;
}
