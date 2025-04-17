import { FilerErrorCode } from "../constants/errors";

class FilerError extends Error {
  public code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class FolderExistsError extends FilerError {
  constructor(folder: string, code: string) {
    super(`Folder already exists: ${folder} (code: ${code})`, code);
  }
}

export class UnknownFilerError extends FilerError {
  constructor(code: string) {
    super(`Unknown error at:(code: ${code})`, code);
  }
}

export class FilerErrorManager {
  public static handle(e: FilerErrorCode, end: string): FilerError {
    switch (e) {
      case FilerErrorCode.FOLDER_EE:
        return new FolderExistsError(end, e);
      default:
        return new UnknownFilerError(e);
    }
  }
}
