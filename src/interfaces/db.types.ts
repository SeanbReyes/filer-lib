import { FolderType } from "./Folder.types";

export enum CertificationTableFields {
  id = `id`,
  certificate_path = `certificate_path`,
}

export interface CertificationTableRows {
  id: string;
  certificate_path: string;
}

export enum StorageTableFields {
  path = `path`,
  max_size_bytes = `max_size_bytes`,
}

export interface StorageTableRows {
  path: string;
  max_size_bytes: number;
}

export interface FolderTableRows {
  id: number;
  name: string;
  type: FolderType;
  path: string;
  password?: string | null;
  max_file_size?: number | null;
  allowed_types?: string | null; // TODO: Must be offtype FileType.
  default_quota?: number | null;
}

export interface FolderMetadataRows {
  id: number;
  folder_id: number;
  isDirectory: boolean;
  isFile: boolean;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  path: string;
}
