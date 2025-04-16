import { Encryptor } from "../concepts/Encryptor";
import { Filer } from "../concepts/Filer";
import { FilerManagerPort } from "../interfaces/Filer.abstract";
import { FilerPayload } from "../interfaces/Filer.types";

export class FilerManager extends Filer implements FilerManagerPort {
  private Encryptor: Encryptor;
  constructor(payload: FilerPayload) {
    super(payload);
    this.Encryptor = new Encryptor();
  }
  async initialize(): Promise<void> {}
  async encrypt(): Promise<void> {
    this.Encryptor.generateKeys({ root_path: this._path });
  }
}
