import axiosInstance from '../utils/axiosInstance';

const BACKEND_URL = 'http://localhost:8086';

const authService = {
  /**
   * Returns the Google OAuth2 authorization URL.
   * Redirecting to this URL initiates the Google login flow.
   */
  getGoogleLoginUrl() {
    return `${BACKEND_URL}/oauth2/authorization/google`;
  },

  /**
   * Fetches the currently authenticated user's info.
   * Used to validate the JWT token on app load.
   */
  async getCurrentUser() {
    const response = await axiosInstance.get('/api/auth/me');
    return response.data;
  },

  /**
   * Logs out the current user on the server side.
   * Frontend must also clear the token from localStorage.
   */
  async logout() {
    await axiosInstance.post('/api/auth/logout');
  },
};

export default authService;
