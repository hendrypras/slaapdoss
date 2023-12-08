import development from '@config/development';
import production from '@config/production';

const nodeENV = process.env.NODE_ENV || 'development';

const env = { production, development }[nodeENV];

const config = {
  api: {
    host: env.API_HOST,
    openStreetMap: env.API_OPEN_STREET_MAP,
  },
  auth: {
    tokenPayload: env.TOKEN_PAYLOAD,
  },
  firebase: {
    api_key: env.FIREBASE_API_KEY,
    auth_domain: env.FIREBASE_AUTH_DOMAIN,
    project_id: env.FIREBASE_PROJECT_ID,
    storage_bucket: env.FIREBASE_STORAGE_BUCKET,
    message_id: env.FIREBASE_MESSAGE_ID,
    app_id: env.FIREBASE_APP_ID,
  },
};

export default config;
