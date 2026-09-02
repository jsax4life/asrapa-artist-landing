// Authentication service for managing tokens and user sessions
export interface AuthToken {
  newAccessToken: string;
  expiresIn?: string;
}

export interface UserData {
  id: string;
  fullName: string;
  stageName: string;
  email: string;
  country: string;
  createdAt: string;
  profilePhotoUrl?: string;
  bannerImageUrl?: string;
  bio?: string;
  /** Ville au Tchad, pour le ciblage marketing local (Moundou, Sarh, Bongor, etc.). */
  city?: string;
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'asra_auth_token';
  private readonly USER_DATA_KEY = 'asra_user_data';
  private readonly TOKEN_EXPIRY_KEY = 'asra_token_expiry';

  private parseTimeString(timeString: string): number {
    const match = timeString.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid time format: ${timeString}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new Error(`Unknown time unit: ${unit}`);
    }
  }

  setAuthData(tokenData: AuthToken, userData: UserData): void {
    try {
      if (tokenData.newAccessToken) {
        sessionStorage.setItem(this.ACCESS_TOKEN_KEY, tokenData.newAccessToken);
      }

      if (tokenData.expiresIn) {
        const durationMs = this.parseTimeString(tokenData.expiresIn);
        const expiryTimestamp = Date.now() + durationMs;
        sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTimestamp.toString());
      }

      sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));

      // Clear legacy localStorage auth keys from older builds
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem('asra_refresh_token');
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);

      window.dispatchEvent(new CustomEvent('auth:login', { detail: { userData } }));
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  getAccessToken(): string | null {
    try {
      return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  }

  getUserData(): UserData | null {
    try {
      const userData =
        sessionStorage.getItem(this.USER_DATA_KEY) ?? localStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getUserData();
  }

  isTokenExpired(): boolean {
    try {
      const expiryTime = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (!expiryTime) return false;

      const expiry = parseInt(expiryTime, 10);
      return Date.now() >= expiry - 5 * 60 * 1000;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  }

  updateAccessToken(newToken: string, expiresIn?: string): void {
    try {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, newToken);

      if (expiresIn) {
        const durationMs = this.parseTimeString(expiresIn);
        const expiryTimestamp = Date.now() + durationMs;
        sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTimestamp.toString());
      }

      window.dispatchEvent(new CustomEvent('auth:token-updated'));
    } catch (error) {
      console.error('Error updating access token:', error);
      throw new Error('Failed to update access token');
    }
  }

  clearAuthData(): void {
    try {
      const userData = this.getUserData();

      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.USER_DATA_KEY);
      sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);

      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem('asra_refresh_token');
      localStorage.removeItem(this.USER_DATA_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);

      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { userData } }));
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  getAuthHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }

  needsTokenRefresh(): boolean {
    try {
      const expiryTime = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (!expiryTime) return false;

      const expiry = parseInt(expiryTime, 10);
      return Date.now() >= expiry - 10 * 60 * 1000;
    } catch (error) {
      console.error('Error checking token refresh need:', error);
      return false;
    }
  }
}

export const authService = new AuthService();

export const getAuthToken = () => authService.getAccessToken();
export const isAuthenticated = () => authService.isAuthenticated();
export const clearAuth = () => authService.clearAuthData();
export const getUserData = () => authService.getUserData();
