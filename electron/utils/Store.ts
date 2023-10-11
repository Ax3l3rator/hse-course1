import electronStore from 'electron-store';
import { AccessData } from './AccessData';

export class EncryptedStorage {
  protected static store = new electronStore({
    encryptionKey: process.env.scrtk,
  });

  public static saveAccessData(data: AccessData) {
    const {
      access_token,
      refresh_token,
      refresh_token_expires_in,
      expires_in,
      id_token,
    } = data;

    this.store.set('access_token', access_token);
    this.store.set('refresh_token', refresh_token);
    this.store.set('id_token', id_token);
    this.store.set('access_expires', expires_in);
    this.store.set('refresh_expires', refresh_token_expires_in);
    this.store.set('access_retrieved', new Date().getTime());
    this.store.set('refresh_retrieved', new Date().getTime());
  }

  public static getToken(tokenType: 'access' | 'refresh'): Token {
    const token = this.store.get(`${tokenType}_token`) as string;
    if (!token) {
      throw new Error(`token is not set for ${tokenType}`);
    }

    const expires_in = Number(this.store.get(`${tokenType}_expires`) as string);
    if (!expires_in) {
      throw new Error(`expires_in is not set for ${tokenType}`);
    }

    const retrieved_at = new Date(
      this.store.get(`${tokenType}_retrieved`) as number
    );
    if (!retrieved_at) {
      throw new Error(`retrieved_at is not set for ${tokenType}`);
    }

    return { token, expires_in, retrieved_at };
  }
}
