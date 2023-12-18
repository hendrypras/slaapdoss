import { AES } from 'crypto-js';
import config from '@config/index';

const encryptPayload = (data) => {
  try {
    if (typeof data === 'object') {
      return AES.encrypt(JSON.stringify(data), config.auth.tokenPayload).toString();
    }
    if (typeof data === 'string') {
      return AES.encrypt(data, config.auth.tokenPayload).toString();
    }
  } catch (error) {
    Promise.reject(error);
  }
};

export default encryptPayload;
