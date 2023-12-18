import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import config from '@config/index';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: config.firebase.api_key,
  authDomain: config.firebase.auth_domain,
  projectId: config.firebase.project_id,
  storageBucket: config.firebase.storage_bucket,
  messagingSenderId: config.firebase.message_id,
  appId: config.firebase.app_id,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
