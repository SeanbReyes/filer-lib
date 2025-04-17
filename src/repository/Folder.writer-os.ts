import { FolderWriterAdapter } from "../adapters/Folder.writer-abstract";
import { FileSystemErrorManager } from "../errors";
import { FolderStatResponse } from "../interfaces";
import fs from "fs";
import { resolve } from "path";

export class FolderWriterOs implements FolderWriterAdapter {
  public statFolder(path: string): FolderStatResponse {
    try {
      const folder = fs.statSync(path);
      return {
        isDirectory: folder.isDirectory(),
        createdAt: folder.birthtime,
        isFile: folder.isFile(),
        modifiedAt: folder.mtime,
        path: resolve(path),
        size: folder.size,
      };
    } catch (e) {
      throw FileSystemErrorManager.handle(e, path);
    }
  }
  public checkExistence(path: string): boolean {
    try {
      return fs.existsSync(path);
    } catch (e) {
      throw FileSystemErrorManager.handle(e, path);
    }
  }
}
