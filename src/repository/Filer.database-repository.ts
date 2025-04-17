import { FilerDatabaseAdapter } from "../adapters/Filer-database.abstract";
import { Tables } from "../constants/db.tables";
import { DatabaseErrorManager } from "../errors";
import {
  FolderTableRows,
  GetPathResponse,
  PathCheckResponse,
  StorageTableFields,
} from "../interfaces";
import db from "../utils/db";

export class FilerDatabaseRepository implements FilerDatabaseAdapter {
  public getAllFolders(): FolderTableRows[] {
    const rows = db
      .prepare(`SELECT * FROM ${Tables.Folder}`)
      .all() as FolderTableRows[];
    if (rows.length == 0) {
      return [];
    } else return rows;
  }
  public storeStoragePath(path: string, max_size_bytes: number): void {
    const check_stmt = db.prepare(`
      SELECT COUNT(*) as count from ${Tables.Storage} WHERE ${StorageTableFields.path} = ?
    `);
    const check_result = check_stmt.get(path) as PathCheckResponse;
    if (check_result.count > 0) return;
    const stmt = db.prepare(
      `INSERT OR REPLACE INTO ${Tables.Storage} (${StorageTableFields.path}, ${StorageTableFields.max_size_bytes}) VALUES (?,?)`,
    );
    stmt.run(path, max_size_bytes);
  }
  public getStoragePath(): string {
    const stmt = db.prepare(`
      SELECT ${StorageTableFields.path}
      FROM ${Tables.Storage}
      LIMIT 1
    `);
    const result = stmt.get() as GetPathResponse;
    if (!result.path)
      throw DatabaseErrorManager.handle(
        { code: "PATH_NOT_FOUND" },
        Tables.Storage,
      );
    return result.path;
  }
}
