// Authentication service for managing tokens and user sessions
export interface AuthToken {
  newAccessToken: string;
  refreshToken?: string;
  expiresIn?: string; // Changed from number to string to match API response
  tokenType?: string;
}

export interface UserData {
  id: string;
  fullName: string;
  stageName: string;
  email: string;
  country: string;
  createdAt: string;
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'asra_auth_token';
  private readonly REFRESH_TOKEN_KEY = 'asra_refresh_token';
  private readonly USER_DATA_KEY = 'asra_user_data';
  private readonly TOKEN_EXPIRY_KEY = 'asra_token_expiry';

  /**
   * Parse time string like "50m", "2h", "1d" to milliseconds
   */
  private parseTimeString(timeString: string): number {
    const match = timeString.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid time format: ${timeString}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value * 1000; // seconds
      case 'm': return value * 60 * 1000; // minutes
      case 'h': return value * 60 * 60 * 1000; // hours
      case 'd': return value * 24 * 60 * 60 * 1000; // days
      default: throw new Error(`Unknown time unit: ${unit}`);
    }
  }

  /**
   * Store authentication data securely
   */
  setAuthData(tokenData: AuthToken, userData: UserData): void {
    try {
      // Store tokens with proper security measures
      if (tokenData.newAccessToken) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, tokenData.newAccessToken);
      }
      
      if (tokenData.refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenData.refreshToken);
      }

      // Store token expiry if provided - parse time string and convert to timestamp
      if (tokenData.expiresIn) {
        const durationMs = this.parseTimeString(tokenData.expiresIn);
        const expiryTimestamp = Date.now() + durationMs;
        localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTimestamp.toString());
      }

      // Store user data
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));

      // Dispatch custom event for other parts of the app
      window.dispatchEvent(new CustomEvent('auth:login', { detail: { userData } }));
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    try {
      const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (!token) return null;

      // Check if token is expired
      if (this.isTokenExpired()) {
        this.clearAuthData();
        return null;
      }

      return token;
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  }

  /**
   * Get the refresh token
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
      return null;
    }
  }

  /**
   * Get stored user data
   */
  getUserData(): UserData | null {
    try {
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const userData = this.getUserData();
    return !!token && !!userData && !this.isTokenExpired();
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(): boolean {
    try {
      const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (!expiryTime) return false;

      const expiry = parseInt(expiryTime, 10);
      const now = Date.now();

      // Add 5 minute buffer before expiry
      return now >= (expiry - 5 * 60 * 1000);
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true; // Assume expired if error
    }
  }

  /**
   * Update access token (for token refresh)
   */
  updateAccessToken(newToken: string, expiresIn?: string): void {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, newToken);
      
      if (expiresIn) {
        // Parse the time string and convert to timestamp
        const durationMs = this.parseTimeString(expiresIn);
        const expiryTimestamp = Date.now() + durationMs;
        localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTimestamp.toString());
      }

      // Dispatch event for token update
      window.dispatchEvent(new CustomEvent('auth:token-updated'));
    } catch (error) {
      console.error('Error updating access token:', error);
      throw new Error('Failed to update access token');
    }
  }

  /**
   * Clear all authentication data
   */
  clearAuthData(): void {
    try {
      const userData = this.getUserData();
      
      // Remove all auth-related items
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);

      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { userData } }));
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Get authorization header for API requests
   */
  getAuthHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }

  /**
   * Check if token needs refresh
   */
  needsTokenRefresh(): boolean {
    try {
      const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (!expiryTime) return false;

      const expiry = parseInt(expiryTime, 10);
      const now = Date.now();

      // Refresh if token expires in next 10 minutes
      return now >= (expiry - 10 * 60 * 1000);
    } catch (error) {
      console.error('Error checking token refresh need:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export utility functions
export const getAuthToken = () => authService.getAccessToken();
export const isAuthenticated = () => authService.isAuthenticated();
export const clearAuth = () => authService.clearAuthData();
export const getUserData = () => authService.getUserData();
