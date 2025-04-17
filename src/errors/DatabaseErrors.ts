class DatabaseError extends Error {
  public code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class StoragePathNotFoundError extends DatabaseError {
  constructor(code: string) {
    super(
      `The path of the storage could not be found,
        this could be due to changes in system disk.
      Please try to restart the storage and consider using our backup system.`,
      code,
    );
  }
}

export class UnknownDatabaseError extends DatabaseError {
  constructor(table: string, code: string) {
    super(`Unknown database error at: ${table} (code: ${code})`, code);
  }
}

export class DatabaseErrorManager {
  public static handle(e: any, table: string): DatabaseError {
    switch (e.code) {
      case "PATH_NOT_FOUND":
        return new StoragePathNotFoundError(e.code);
      default:
        return new UnknownDatabaseError(table, e.code);
    }
  }
}
