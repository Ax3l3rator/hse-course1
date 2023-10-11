import * as jwt from 'jsonwebtoken';
import * as os from 'os';
import { AccessData } from './AccessData';
import * as keytar from 'keytar';
import { Compressor } from './Compressor';

export class KeyTarVault {
  public static serviceName = `${os.userInfo().username}-HseAppX321`;

  public static async storeAccessData(data: AccessData) {
    console.log(data);
    console.log('Anime', data.access_token, data.access_token.length);
    const compressed_acc = await Compressor.compressString(data.access_token);
    console.log(compressed_acc.length);
    await keytar.setPassword(this.serviceName, 'access_token', compressed_acc);

    const compressed_token = await Compressor.compressString(
      data.refresh_token
    );

    await keytar.setPassword(
      this.serviceName,
      'access_expires_in',
      data.expires_in.toString()
    );
    await keytar.setPassword(
      this.serviceName,
      'refresh_expires_in',
      data.refresh_token_expires_in.toString()
    );
    await keytar.setPassword(
      this.serviceName,
      'access_retrieved_at',
      new Date().getTime().toString()
    );
    console.log(compressed_token.length);
    console.log(compressed_token);
    console.log(data.refresh_token);
    console.log(jwt.decode(data.refresh_token));
    await keytar
      .setPassword(
        this.serviceName,
        'refresh_token',
        '11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
      )
      .catch((err) => {
        console.log(err);
      });
    console.log('Anime', data.expires_in, data.expires_in);

    await keytar.setPassword(
      this.serviceName,
      'refresh_retrieved_at',
      new Date().getTime().toString()
    );
    await keytar.setPassword(this.serviceName, 'id_token', data.id_token);
  }

  public static async retrieveToken(
    token_type: 'access' | 'refresh'
  ): Promise<Token> {
    const token = await keytar.getPassword(
      this.serviceName,
      `${token_type}_token`
    );
    const expires_in = Number(
      await keytar.getPassword(this.serviceName, `${token_type}_expires_in`)
    );
    const expires_inStr = await keytar.getPassword(
      this.serviceName,
      `${token_type}_expires_in`
    );
    const retrieved_at = new Date(
      Number(
        await keytar.getPassword(this.serviceName, `${token_type}_retrieved_at`)
      )
    );
    console.log(token, expires_in, retrieved_at, expires_inStr);
    if (!token || !expires_in || !retrieved_at) {
      throw new Error('Some of token information is not obtainable');
    } else {
      return { token, expires_in, retrieved_at };
    }
  }

  public static async retrieveIdToken(): Promise<string> {
    const id_token = await keytar.getPassword(this.serviceName, 'id_token');
    if (!id_token) {
      throw new Error('id_token is not set');
    } else {
      return id_token;
    }
  }

  public static async removeTokenData() {
    await keytar.deletePassword(this.serviceName, 'access_token');
    await keytar.deletePassword(this.serviceName, 'access_expires_in');
    await keytar.deletePassword(this.serviceName, 'access_retrieved_at');
    await keytar.deletePassword(this.serviceName, 'refresh_token');
    await keytar.deletePassword(this.serviceName, 'refresh_expires_in');
    await keytar.deletePassword(this.serviceName, 'refresh_retrieved_at');
    await keytar.deletePassword(this.serviceName, 'id_token');
  }
}
