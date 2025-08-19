/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse, AxiosError } from 'axios';
import { authService } from './auth';

// API service for AsraMusic backend
// For production, set VITE_API_BASE_URL in your environment to 'https://api.asramusic.com/api/v1'
// For local development, it defaults to 'http://localhost:4000/api/v1'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

console.log(API_BASE_URL)

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging and adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available using the auth service
    const authHeader = authService.getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', config.method?.toUpperCase(), config.url, config.data || config.params);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface ArtistSignupData {
  fullName: string;
  stageName: string;
  email: string;
  password: string;
  country: string;
  agreeToTerms: boolean;
}

export interface ApiResponse<T> {
  expiresIn: number;
  newAccessToken: any;
  success: boolean;
  data?: T & { artist?: any };
  message?: string;
  error?: string;
}

export interface ArtistSignupResponse {
  id: string;
  fullName: string;
  stageName: string;
  email: string;
  country: string;
  createdAt: string;
  token?: string;
  expiresAt?: number;
  likes?: any[];
  followers?: any[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
     
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Axios response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('API Response:', response.status, response.config.url, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    }
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data as Record<string, unknown>;
      
      // Handle authentication errors
      if (status === 401) {
        // Token is invalid or expired
        authService.clearAuthData();
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/';
        }
        
        throw new ApiError(
          'Your session has expired. Please log in again.',
          status,
          errorData
        );
      }
      
      // Handle forbidden errors
      if (status === 403) {
        throw new ApiError(
          'You do not have permission to perform this action.',
          status,
          errorData
        );
      }
      
      // Handle other server errors
      throw new ApiError(
        (errorData?.message as string) || `HTTP error! status: ${status}`,
        status,
        errorData
      );
    } else if (error.request) {
      // Network error
      throw new ApiError(
        'Network error occurred. Please check your connection.',
        0
      );
    } else {
      // Other error
      throw new ApiError(
        'An unexpected error occurred.',
        0
      );
    }
  }
);

export const api = {
  async signupArtist(data: ArtistSignupData): Promise<ApiResponse<ArtistSignupResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<ArtistSignupResponse>> = await apiClient.post('/artist/auth/signup', data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Network error occurred. Please check your connection.',
        0
      );
    }
  },

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    try {
      const response: AxiosResponse<{ available: boolean }> = await apiClient.post('/artist/auth/check-email', { email });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Network error occurred. Please check your connection.',
        0
      );
    }
  },

  async checkStageNameAvailability(stageName: string): Promise<{ available: boolean }> {
    try {
      const response: AxiosResponse<{ available: boolean }> = await apiClient.post('/artist/auth/check-stage-name', {
        stageName
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Network error occurred. Please check your connection.',
        0
      );
    }
  },

  async loginArtist(credentials: { emailOrStageName: string; password: string }): Promise<ApiResponse<{ artist: any }>> {
    console.log(credentials);

    try {
      const response: AxiosResponse<ApiResponse<{ artist: any }>> = await apiClient.post('/artist/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Network error occurred. Please check your connection.',
        0
      );
    }
  },
};

