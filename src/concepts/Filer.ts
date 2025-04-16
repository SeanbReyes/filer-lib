import os from "os";
import path from "path";
import { sep } from "path";
import { Folder } from "./Folder";
import db from "../utils/db";
import { Tables } from "../constants/db.tables";
import { FolderTableRows, StorageTableFields } from "../interfaces/db.types";
import { FileType, FolderPayload } from "../interfaces/Folder.types";
import { FilerPayload } from "../interfaces/Filer.types";
import fs, { accessSync, constants } from "fs";

export class Filer {
  declare private path: string;
  declare private folders: Folder[];
  declare private max_size_bytes: number;
  constructor(payload: FilerPayload) {
    this.init(payload);
  }
  get _path(): typeof this.path {
    return this.path;
  }
  protected init(payload: FilerPayload): void {
    this.checkAccess();
    const path = this.sanitizePath(this.getPlatformSecurePath(payload.name));
    const max_size_bytes = payload.max_size_bytes || Infinity;
    this.initialize_root(path, max_size_bytes);
    this.initializeFolders();
  }
  private checkAccess(): void {
    try {
      accessSync(os.homedir(), constants.W_OK | constants.R_OK);
    } catch (e) {
      throw new Error(
        `Permission denied. Please check u have write access to ${os.homedir()}`,
      );
    }
  }
  private initialize_root(path: string, max_size_bytes?: number | null): void {
    try {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {
          recursive: true,
        });
      }
      const stmt = db.prepare(
        `INSERT OR REPLACE INTO ${Tables.Storage} (${StorageTableFields.path}, ${StorageTableFields.max_size_bytes}) VALUES (?,?)`,
      );
      stmt.run(path, max_size_bytes);
    } catch (e) {
      console.error(e);
      throw new Error(
        `Something went wrong when initializing the FilerManager. Error:${e}`,
      );
    }
  }
  private initializeFolders(): void {
    const rows = db
      .prepare(`SELECT * FROM ${Tables.Folder}`)
      .all() as FolderTableRows[];
    for (let x = 0; x < rows.length; x++) {
      const folder = new Folder({
        config: {
          name: rows[x].name,
          type: rows[x].type,
          allowed_types: rows[x].allowed_types as FileType,
          default_quota: rows[x].default_quota || undefined,
          max_file_size: rows[x].max_file_size || undefined,
          password: rows[x].password,
        },
      });
      this.folders.push(folder);
    }
  }
  private sanitizePath(input: string) {
    const containsTraversal = input
      .split(sep)
      .some((segment) => segment === "..");
    if (containsTraversal) {
      throw new Error("Invalid path containing traversal");
    }
    return input.replace(/[^a-zA-Z0-9-_./]/g, "");
  }

  private getPlatformSecurePath(name?: string): string {
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
  protected createFolder(payload: FolderPayload): void {}
}
