import { jwtDecode } from 'jwt-decode';

const decryptToken = (token) => (token ? jwtDecode(token) : null);
export default decryptToken;
