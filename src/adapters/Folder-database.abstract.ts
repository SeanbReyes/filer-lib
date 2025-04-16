import { GetFolderDataResponse } from "../interfaces";

export abstract class FolderDatabaseAdapter {
  abstract getFolderData(name: string): Omit<GetFolderDataResponse, "metadata">;
  abstract checkExistence(name: string): boolean;
}
