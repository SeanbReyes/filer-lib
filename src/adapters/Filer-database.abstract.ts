import { FolderTableRows } from "../interfaces";

export abstract class FilerDatabaseAdapter {
  abstract getAllFolders(): FolderTableRows[];
  abstract storeStoragePath(path: string, max_size_bytes: number): void;
  abstract getStoragePath(): string;
}
