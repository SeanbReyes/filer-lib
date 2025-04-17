import fs from "fs";
import { FilerWriterOsAdapter } from "../adapters/Filer.writer-abstract";
import os from "os";

export class FilerWriterOs implements FilerWriterOsAdapter {
  public checkAccess(): void {
    try {
      fs.accessSync(os.homedir(), fs.constants.W_OK | fs.constants.R_OK);
    } catch (e) {
      throw new Error(
        `Permission denied. Please check u have write access to ${os.homedir()}`,
      );
    }
  }
  public initialize_storage(path: string): void {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {
        recursive: true,
      });
    }
  }
}
