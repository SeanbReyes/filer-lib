import os from "os";
import path from "path";
import { sep } from "path";
import { Folder } from "./Folder";
import db from "../utils/db";
import { Tables } from "../constants/db.tables";
import { FolderTableRows } from "../interfaces/db.types";
import { FileType } from "../interfaces/Folder.types";

export class Filer {
  public readonly path: string;
  declare public folders: Folder[];
  constructor(payload: any) {
    this.path = this.sanitizePath(this.getPlatformSecurePath(payload.name));
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
        },
      });
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
}
