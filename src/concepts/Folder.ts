import { Tables } from "../constants/db.tables";
import {
  DEFAULT_FOLDER_FILE_TYPE,
  DEFAULT_FOLDER_MAX_FILE_SIZE,
  DEFAULT_FOLDER_QUOTA,
} from "../constants/folder.constants";
import { FolderTableRows } from "../interfaces/db.types";
import {
  FolderConfig,
  FolderPayload,
  GetFolderDataResponse,
} from "../interfaces/Folder.types";
import db from "../utils/db";
import { File } from "./File";

export class Folder {
  public id: string;
  public config: Required<FolderConfig>;
  declare private files: File[];
  constructor(payload: FolderPayload) {
    const folder_data: GetFolderDataResponse = this.getFolderData(
      payload.config.name,
    );
    this.config = {
      allowed_types: payload.config.allowed_types || DEFAULT_FOLDER_FILE_TYPE,
      default_quota: payload.config.default_quota || DEFAULT_FOLDER_QUOTA,
      max_file_size:
        payload.config.max_file_size || DEFAULT_FOLDER_MAX_FILE_SIZE,
      name: payload.config.name,
      password: payload.config.password || null,
      path: folder_data.path,
      type: payload.config.type,
    };
    this.id = folder_data.id;
  }
  private getFolderData(name: string): GetFolderDataResponse {
    const row =
      (db
        .prepare(`SELECT id, path FROM ${Tables.Folder} WHERE name = ?`)
        .get(`${name}`) as FolderTableRows) || undefined;
    if (!row) {
      throw new Error("Folder does not exists");
    }
    return {
      id: row.id,
      path: row.path,
    };
  }
}
