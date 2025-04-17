export interface FilerPayload {
  name: string;
  max_size_bytes?: number | null;
}
export interface PathCheckResponse {
  count: number;
}
export interface GetPathResponse {
  path: string;
}
