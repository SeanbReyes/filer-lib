import { FolderType } from "./Folder.types";

export enum CertificationTableFields {
  id = `id`,
  certificate_path = `certificate_path`,
}

export interface CertificationTableRows {
  id: string;
  certificate_path: string;
}

export interface FolderTableRows {
  id: string;
  name: string;
  type: FolderType;
  path: string;
  password?: string | null;
  max_file_size?: number | null;
  allowed_types?: string | null; // or a parsed structure if you store JSON
  default_quota?: number | null;
}
