import { Encryptor } from "../concepts/Encryptor";
import { Filer } from "../concepts/Filer";
import { CheckAccessPayload } from "../interfaces";
import { FilerManagerPort } from "../adapters/Filer.abstract";
import { FilerPayload } from "../interfaces/Filer.types";

export class FilerManager extends Filer implements FilerManagerPort {
  private Encryptor: Encryptor;
  constructor(payload: FilerPayload) {
    super(payload);
    this.Encryptor = new Encryptor();
  }
  public encrypt(): void {
    this.Encryptor.generateKeys({ root_path: this._path });
  }
  public checkStorageAccess(payload: CheckAccessPayload): boolean {
    return this.Encryptor.checkAccess(payload);
  }
}
