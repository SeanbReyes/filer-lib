import { GetFolderDataResponse } from "../interfaces";
import { FolderDatabaseRepository } from "../repository/Folder.database-repository";
import { FolderWriterOs } from "../repository/Folder.writer-os";

export class FolderService {
  constructor(
    private readonly writer: FolderWriterOs,
    private readonly repository: FolderDatabaseRepository,
  ) {
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
}
