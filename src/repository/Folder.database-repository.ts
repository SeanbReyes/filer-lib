import { FolderDatabaseAdapter } from "../adapters/Folder-database.abstract";
import { Tables } from "../constants/db.tables";
import {
  CheckExistenceQueryResponse,
  CreateFolderResponse,
  FolderConfigPayload,
  FolderDatabaseResponse,
  FolderMetadata,
  FolderPayload,
  FolderStatResponse,
  FolderTableFields,
  FolderTableRows,
  GetFolderDataResponse,
} from "../interfaces";
import db from "../utils/db";

export class FolderDatabaseRepository implements FolderDatabaseAdapter {
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
  public checkExistence(name: string): boolean {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM ${Tables.Folder} WHERE ${FolderTableFields.name} = ?
    `);
    const stmt_result = stmt.get(name) as CheckExistenceQueryResponse;
    if (stmt_result.count == 1) return true;
    else return false;
  }
  public getFolder(name: string): FolderDatabaseResponse | null {
    const exists = this.checkExistence(name);
    if (!exists) return null;
    const stmt_config = db.prepare(`
      SELECT * FROM ${Tables.Folder} WHERE name = ?
    `);
    const stmt_result_config = stmt_config.get(name) as FolderConfigPayload;
    const stmt_metadata = db.prepare(`
      SELECT * from ${Tables.FolderMetadata} WHERE folder_id = ?
    `);
    const stmt_metadata_result = stmt_metadata.get(
      stmt_result_config.id,
    ) as FolderMetadata;
    const response: FolderDatabaseResponse = {
      metadata: stmt_metadata_result,
      config: stmt_result_config,
    };
    return response;
  }
  public create_folder(
    payload: FolderPayload & { metadata: FolderStatResponse },
  ): CreateFolderResponse {
    db.exec("BEGIN TRANSACTION");
    try {
      const config_stmt = db.prepare(`
        INSERT INTO ${Tables.Folder} (
          name, type, path, password, max_file_size, allowed_types, default_quota
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const { lastInsertRowid } = config_stmt.run(
        payload.config.name,
        payload.config.type,
        payload.metadata.path,
        payload.config.password,
        payload.config.max_file_size,
        payload.config.allowed_types,
        payload.config.default_quota,
      );
      const stmt_metadata = db.prepare(`
      INSERT INTO ${Tables.FolderMetadata} (
        folder_id, isDirectory, isFile, size, createdAt, modifiedAt, path
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt_metadata.run(
        lastInsertRowid,
        payload.metadata.isDirectory ? 1 : 0,
        payload.metadata.isFile ? 1 : 0,
        payload.metadata.size,
        payload.metadata.createdAt,
        payload.metadata.modifiedAt,
        payload.metadata.path,
      );
      db.exec("COMMIT");
      return {
        config: {
          ...payload.config,
          path: payload.metadata.path,
        },
        id: Number(lastInsertRowid),
        metadata: payload.metadata,
      };
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
}
