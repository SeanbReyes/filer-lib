import { Encryptor } from "../concepts/Encryptor";
import { Filer } from "../concepts/Filer";
import { FilerManagerPort } from "../interfaces/Filer.abstract";

export class FilerManager implements FilerManagerPort {
  private Filer: Filer;
  private Encryptor: Encryptor;
  constructor(payload: any) {
    this.Filer = payload.Filer;
    this.Encryptor = payload.Encryptor;
  }
  async initialize(Filer: Filer): Promise<void> {}
  async encrypt(): Promise<void> {}
}
