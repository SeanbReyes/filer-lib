import {
  FileType,
  FolderPayload,
  FolderType,
} from "../interfaces/Folder.types";
import { File } from "./File";

export class Folder {
  public name: string;
  public default_quota?: string;
  public allowed_types?: FileType;
  public max_file_size?: number;
  private password?: string;
  public type: FolderType;
  public path?: string;
  public files: File[];
  constructor(payload: FolderPayload) {
    this.name = payload.name;
    this.default_quota = payload.default_quota;
    this.allowed_types = payload.allowed_types;
    this.max_file_size = payload.max_file_size;
    this.password = payload.password;
    this.type = payload.type;
  }
}
