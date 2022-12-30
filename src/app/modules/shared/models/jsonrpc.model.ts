export interface IJsonRpc {
  jsonrpc: string;
  timestamp: string;
  event: string;
  params: object;
}
