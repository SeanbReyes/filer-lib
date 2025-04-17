import {
  CreateFolderResponse,
  FolderDatabaseResponse,
  FolderPayload,
  FolderStatResponse,
  GetFolderDataResponse,
} from "../interfaces";

export abstract class FolderDatabaseAdapter {
  abstract getFolderData(name: string): Omit<GetFolderDataResponse, "metadata">;
  abstract checkExistence(name: string): boolean;
  abstract create_folder(
    payload: FolderPayload & { metadata: FolderStatResponse },
  ): CreateFolderResponse;
  abstract getFolder(name: string): FolderDatabaseResponse | null;
}
