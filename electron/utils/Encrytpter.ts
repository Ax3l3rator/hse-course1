import * as crypto from 'crypto';

export class Encrypter {
  private static secret = 'HseAppDummySecret';
  private static algorithm = 'sha256';
  private static iv = crypto.randomBytes(16);

  public static async encrypt(data: string) {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.secret),
      this.iv
    );
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      iv: this.iv.toString('hex'),
      encryptedData: encrypted.toString('hex'),
    };
  }

  public static async decrypt(data: { iv: string; encryptedData: string }) {
    const iv = Buffer.from(data.iv, 'hex');
    const encryptedText = Buffer.from(data.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.secret),
      iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
