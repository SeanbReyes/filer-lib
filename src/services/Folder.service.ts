import {
  CreateFolderResponse,
  FileType,
  FolderPayload,
  GetFolderDataResponse,
} from "../interfaces";
import { FolderDatabaseRepository } from "../repository/Folder.database-repository";
import { FolderWriterOs } from "../repository/Folder.writer-os";

export class FolderService {
  private readonly writer: FolderWriterOs;
  private readonly repository: FolderDatabaseRepository;
  constructor() {
    this.writer = new FolderWriterOs();
    this.repository = new FolderDatabaseRepository();
  }
  public getFolderData(name: string): GetFolderDataResponse {
    const folderData = this.repository.getFolderData(name);
    const folderMetadata = this.writer.statFolder(folderData.path);
    return {
      id: folderData.id,
      path: folderData.path,
      metadata: folderMetadata,
    };
  }
  public newFolder(
    payload: FolderPayload & { path: string },
  ): CreateFolderResponse {
    const exists = this.repository.checkExistence(payload.config.name);
    if (exists) {
      const folder = this.repository.getFolder(payload.config.name);
      if (folder) {
        return {
          id: folder?.config.id,
          config: {
            ...folder?.config,
            allowed_types: folder.config.allowed_types as FileType,
          },
          metadata: folder?.metadata,
        };
      }
    }
    const folder_created = this.writer.createFolder(
      payload.path,
      payload.config.name,
    );
    const data = {
      config: payload.config,
      metadata: folder_created,
    };
    const folder = this.repository.create_folder(data);
    return folder;
  }
}
