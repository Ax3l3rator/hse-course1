import { BrowserView, BrowserWindow, ipcRenderer, net } from 'electron';
import { isAccessData, AccessData } from './AccessData';
import * as jwt from 'jsonwebtoken';

export const config = {
  client_id: '5adda899-e75d-46d9-90d9-38380bdf060a',
  redirect_uri: 'ruz-app-fiddle://auth.hse.ru/adfs/oauth2/callback',
};

export class HSEAuthService {
  public static async requestAccessByCode(code: string) {
    return new Promise<AccessData>((resolve, reject) => {
      const request = net.request({
        url: 'https://auth.hse.ru/adfs/oauth2/token/',
        method: 'POST',
      });
      const params = {
        code: code,
        client_id: '5adda899-e75d-46d9-90d9-38380bdf060a',
        redirect_uri: 'ruz-app-fiddle://auth.hse.ru/adfs/oauth2/callback',
        grant_type: 'authorization_code',
      };

      const urlEncodedParams = new URLSearchParams(params).toString();

      request.on('response', (response) => {
        const data: Buffer[] = [];
        response.on('data', (chunk) => {
          data.push(chunk);
        });

        response.on('end', () => {
          const accessData = JSON.parse(Buffer.concat(data).toString());

          if (isAccessData(accessData)) {
            const decoded = jwt.decode((accessData as AccessData).id_token, {
              complete: true,
            });

            resolve(accessData);
          } else {
            reject(new Error('Response data has wrong format'));
          }
        });
        response.on('error', (error: Error) => {
          console.error(error);
          reject(error);
        });
      });
      request.on('error', (error: Error) => {
        console.error(error);
        reject(error);
      });
      request.write(urlEncodedParams);

      request.end();
    });
  }

  public static saveAccessData(accessData: AccessData) {}
}
