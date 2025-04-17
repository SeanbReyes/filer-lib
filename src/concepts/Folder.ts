import {
  DEFAULT_FOLDER_FILE_TYPE,
  DEFAULT_FOLDER_MAX_FILE_SIZE,
  DEFAULT_FOLDER_QUOTA,
} from "../constants/folder.constants";
import {
  FolderConfig,
  FolderPayload,
  FolderStatResponse,
  GetFolderDataResponse,
} from "../interfaces/Folder.types";
import { FolderService } from "../services/Folder.service";
import { File } from "./File";

export class Folder {
  public id: number;
  public config: Required<FolderConfig>;
  declare private files: File[];
  declare private folders: Folder[];
  declare public metadata?: FolderStatResponse | null;
  private readonly service: FolderService;
  constructor(payload: FolderPayload) {
    this.service = new FolderService();
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
    const { id, path } = this.service.getFolderData(name);
    const data = {
      id,
      path,
    };
    return data;
  }
}
