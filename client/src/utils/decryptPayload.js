import CryptoJS from 'crypto-js';
import config from '@config/index';

export const decryptObjectPayload = (token) => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, config.auth.tokenPayload);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return null;
  }
};
export const decryptTextPayload = (token) => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, config.auth.tokenPayload);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
};
