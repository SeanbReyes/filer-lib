import { FolderWriterAdapter } from "../adapters/Folder.writer-abstract";
import { FileSystemErrorManager } from "../errors";
import { FolderStatResponse } from "../interfaces";
import fs from "fs";
import { resolve as resolve_path, join as join_path } from "path";

export class FolderWriterOs implements FolderWriterAdapter {
  public statFolder(path: string): FolderStatResponse {
    try {
      const folder = fs.statSync(path);
      return {
        isDirectory: folder.isDirectory(),
        createdAt: folder.birthtime.toISOString(),
        isFile: folder.isFile(),
        modifiedAt: folder.mtime.toISOString(),
        path: resolve_path(path),
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
  private deleteFolder(path: string): void {
    fs.rmdirSync(path);
  }
  public createFolder(path: string, name: string): FolderStatResponse {
    const full_path = join_path(path, name);
    const exists = this.checkExistence(full_path);
    if (exists) {
      this.deleteFolder(path);
    }
    fs.mkdirSync(full_path);
    const stat_result = this.statFolder(full_path);
    return stat_result;
  }
}
