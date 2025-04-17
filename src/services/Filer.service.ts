import path from "path";
import os from "os";
import { FilerWriterOs } from "../repository/Filer.writer-os";
import { FilerDatabaseRepository } from "../repository/Filer.database-repository";
import { FolderTableRows } from "../interfaces";

export class FilerService {
  private readonly writer: FilerWriterOs;
  private readonly repository: FilerDatabaseRepository;
  constructor() {
    this.writer = new FilerWriterOs();
    this.repository = new FilerDatabaseRepository();
  }
  public sanitizePath(input: string) {
    const containsTraversal = input
      .split(path.sep)
      .some((segment) => segment === "..");
    if (containsTraversal) {
      throw new Error("Invalid path containing traversal");
    }
    return input.replace(/[^a-zA-Z0-9-_./]/g, "");
  }
  public checkAccess(): void {
    this.writer.checkAccess();
  }
  public getAllFolders(): FolderTableRows[] {
    return this.repository.getAllFolders();
  }
  public initialize_root(path: string, max_size_bytes?: number | null): void {
    try {
      this.writer.initialize_storage(path);
      this.repository.storeStoragePath(path, max_size_bytes || Infinity);
    } catch (e) {
      console.error(e);
      throw new Error(
        `Something went wrong when initializing the FilerManager. Error:${e}`,
      );
    }
  }
  public getPlatformSecurePath(name?: string): string {
    switch (process.platform) {
      case "win32":
        return path.join(
          process.env.APPDATA || path.join(os.homedir(), "AppData", "Local"),
          `${name ? `.${name}-filer-storage` : ".filer-storage"}`,
        );
      case "darwin":
        return path.join(
          os.homedir(),
          "Library",
          "Application Support",
          `${name ? `.${name}-filer-storage` : ".filer-storage"}`,
        );
      default:
        return path.join(
          os.homedir(),
          `${name ? `.${name}-filer-storage` : ".filer-storage"}`,
        );
    }
  }
}
