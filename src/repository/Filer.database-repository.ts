import { FilerDatabaseAdapter } from "../adapters/Filer-database.abstract";
import { Tables } from "../constants/db.tables";
import { FolderTableRows, StorageTableFields } from "../interfaces";
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
    const stmt = db.prepare(
      `INSERT OR REPLACE INTO ${Tables.Storage} (${StorageTableFields.path}, ${StorageTableFields.max_size_bytes}) VALUES (?,?)`,
    );
    stmt.run(path, max_size_bytes);
  }
}
