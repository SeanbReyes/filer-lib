import { FolderStatResponse } from "../interfaces";

export abstract class FolderWriterAdapter {
  abstract statFolder(path: string): FolderStatResponse;
  abstract checkExistence(path: string): boolean;
  abstract createFolder(path: string, name: string): FolderStatResponse;
}
