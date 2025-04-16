import { Tables } from "../constants/db.tables";
import { FolderTableRows, GetFolderDataResponse } from "../interfaces";
import db from "../utils/db";

export class FolderDatabaseRepository {
  public getFolderData(name: string): Omit<GetFolderDataResponse, "metadata"> {
    const row =
      (db
        .prepare(`SELECT id, path FROM ${Tables.Folder} WHERE name = ?`)
        .get(`${name}`) as FolderTableRows) || undefined;
    if (!row) {
      throw new Error("Folder does not exists");
    }
    return {
      id: row.id,
      path: row.path,
    };
  }
}
