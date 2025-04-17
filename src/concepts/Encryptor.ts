import { createSign, createVerify, generateKeyPairSync } from "node:crypto";
import {
  CheckAccessPayload,
  CreateSignaturePayload,
  GenerateKeysPayload,
  GenerateKeysResponse,
} from "../interfaces/Encryptor-types";
import { readFileSync, writeFileSync } from "node:fs";
import fs from "fs";
import path from "node:path/posix";
import db from "../utils/db";
import {
  CertificationTableFields,
  CertificationTableRows,
} from "../interfaces/db.types";
import { Tables } from "../constants/db.tables";

export class Encryptor {
  private certificate_path_name: string = ".signature";
  private payload_path: string = "auth.json";
  public generateKeys(payload: GenerateKeysPayload): GenerateKeysResponse {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
    this.createSignature({
      date: new Date(Date.now()).toISOString(),
      privateKey,
      root_path: payload.root_path,
    });
    return {
      privateKey,
      publicKey,
    };
  }
  public checkAccess(payload: CheckAccessPayload): boolean {
    const verifier = createVerify("SHA256");
    const row =
      (db
        .prepare(`SELECT * FROM ${Tables.Certification} WHERE id = ?`)
        .get("1") as CertificationTableRows) || undefined;
    if (!row) {
      throw new Error(
        "Could not find a valid certification, please check storage paths have not been edited",
      );
    }
    const { date, signature } = JSON.parse(
      readFileSync(row.certificate_path, "utf8"),
    );
    verifier.update(date);
    verifier.end();
    const isValid = verifier.verify(payload.publicKey, signature);
    return isValid;
  }
  private createSignature(payload: CreateSignaturePayload): void {
    const sign = createSign("SHA256");
    sign.update(payload.date);
    sign.end();
    const signature = sign.sign(payload.privateKey, "base64");
    const certificate_path = path.join(
      payload.root_path,
      this.certificate_path_name,
    );
    fs.mkdir(
      certificate_path,
      {
        recursive: true,
      },
      () => {
        try {
          const final_path = path.join(certificate_path, this.payload_path);
          writeFileSync(
            final_path,
            JSON.stringify({ date: payload.date, signature }, null, 2),
          );
          const stmt = db.prepare(
            `INSERT OR REPLACE INTO ${Tables.Certification} (${(CertificationTableFields.id, CertificationTableFields.certificate_path)}) VALUES (?,?)`,
          );
          stmt.run("1", final_path);
        } catch (e) {
          throw new Error(
            `Operation failed, could not create the ceritificates.
            This error could be due to invalid name when creating the storage.
            Please check and retry.`,
          );
        }
      },
    );
  }
}
