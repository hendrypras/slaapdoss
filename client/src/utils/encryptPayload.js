import { AES } from 'crypto-js';
import toast from 'react-hot-toast';
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
    toast.error('Something went wrong');
  }
};

export default encryptPayload;
