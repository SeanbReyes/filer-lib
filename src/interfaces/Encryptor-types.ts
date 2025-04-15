export interface GenerateKeysResponse {
  publicKey: string;
  privateKey: string;
}

export interface GenerateKeysPayload {
  root_path: string;
}

export interface CheckAccessPayload {
  publicKey: string;
  root_path: string;
}

export interface CreateSignaturePayload {
  privateKey: string;
  date: string;
  root_path: string;
}
