/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse, AxiosError } from 'axios';
import { authService } from './auth';

// API service for AsraMusic backen
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
  timeout: 60000, // 60 second timeout for file uploads
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
  status: string;
  message: string;
  data?: T;
  expiresIn?: number;
  newAccessToken?: any;
  success?: boolean;
  error?: string | {
    statusCode: number;
    status: string;
    isOperational: boolean;
  };
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

export interface SongUploadResponse {
  song: {
    _id: string;
    title: string;
    duration: number;
    album?: string;
    artist: string;
    genre: string;
    songUrl: string;
    coverPhotoUrl: string;
    collaborators?: string[];
    isExplicit: boolean;
    createdAt: string;
  };
}

export interface AlbumUploadResponse {
  album: {
    _id: string;
    title: string;
    releaseDate: string;
    explicit: boolean;
    genre: string;
    caption: string;
    coverPhotoUrl: string;
    artist: string;
    status: string;
    songs: string[];
    createdAt: string;
  };
}

export interface UploadedSong {
  id: string;
  title: string;
  duration: number;
  album?: {
    title: string;
  };
  genre: {
    name: string;
  };
  songUrl: string;
  coverPhotoUrl: string;
  downloads: number;
  streams: number;
  explicit: boolean;
  createdAt: string;
}

export interface UploadedSongsResponse {
  status: string;
  results: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSongs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
  data: {
    songs: UploadedSong[];
  };
}

export interface UploadedAlbum {
  _id: string;
  title: string;
  releaseDate: string;
  coverPhotoUrl: string;
  genre: {
    name: string;
  };
  caption: string;
  status: string;
  scheduling: {
    releaseStatus: string;
  };
  isDeleted: boolean;
  moderation: {
    moderationStatus: string;
  };
  likesCount: number;
  songsCount: number;
  createdAt: string;
}

export interface UploadedAlbumsResponse {
  status: string;
  results: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalAlbums: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
  data: {
    albums: UploadedAlbum[];
  };
}

export interface Artist {
  _id: string;
  stageName: string;
  fullName: string;
  bio: string;
  genre: string;
  followers: Array<{
    _id: string;
    username: string;
  }>;
  likes: Array<{
    _id: string;
    username: string;
  }>;
  createdAt: string;
  __v: number;
}

export interface Genre {
  _id: string;
  name: string;
  __v: number;
}

export interface ArtistsResponse {
  status: string;
  results: number;
  data: {
    artists: Artist[];
  };
}

export interface GenresResponse {
  status: string;
  results: number;
  data: {
    genres: Genre[];
  };
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
        // Check if this is a login attempt (incorrect credentials)
        const isLoginAttempt = error.config?.url?.includes('/auth/login');
        
        if (isLoginAttempt) {
          // For login attempts, return the actual error message from backend
          throw new ApiError(
            (errorData?.message as string) || 'Incorrect email/stage name or password',
            status,
            errorData
          );
        } else {
          // For other 401 errors, treat as session expired
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
      console.error('Network error:', error.request);
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

  async uploadSingleSong(formData: FormData): Promise<ApiResponse<SongUploadResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<SongUploadResponse>> = await apiClient.post('/artist/upload-songs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Network error occurred during song upload. Please check your connection.',
        0
      );
    }
  },

  async getAllArtists(): Promise<ArtistsResponse> {
    try {
      const response: AxiosResponse<ArtistsResponse> = await apiClient.get('/artist');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Network error occurred while fetching artists. Please check your connection.',
        0
      );
    }
  },

  async getAllGenres(): Promise<GenresResponse> {
    try {
      const response: AxiosResponse<GenresResponse> = await apiClient.get('/genres');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Network error occurred while fetching genres. Please check your connection.',
        0
      );
    }
  },

  async uploadAlbum(formData: FormData): Promise<ApiResponse<AlbumUploadResponse>> {
    try {
      console.log('Uploading album with FormData:', formData);
      console.log('FormData entries:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response: AxiosResponse<ApiResponse<AlbumUploadResponse>> = await apiClient.post('/artist/create-album', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Album upload response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Album upload error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      if (error.response) {
        console.error('Response error:', error.response.data);
        throw new ApiError(
          error.response.data?.message || 'Album upload failed',
          error.response.status
        );
      } else if (error.request) {
        console.error('Network error:', error.request);
        throw new ApiError(
          'Network error occurred during album upload. Please check your connection.',
          0
        );
      } else if (error.code === 'ECONNABORTED') {
        console.error('Request timeout:', error.message);
        throw new ApiError(
          'Album upload timed out. Please try again with smaller files or check your connection.',
          0
        );
      } else {
        console.error('Unexpected error:', error.message);
        throw new ApiError(
          'An unexpected error occurred during album upload.',
          0
        );
      }
    }
  },

  async getUploadedSongs(page: number = 1, limit: number = 20, sort: string = 'createdAt', order: string = 'desc'): Promise<UploadedSongsResponse> {
    try {
      const response: AxiosResponse<UploadedSongsResponse> = await apiClient.get('/artist/uploaded-songs', {
        params: { page, limit, sort, order }
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Network error occurred while fetching uploaded songs. Please check your connection.',
        0
      );
    }
  },

  async getUploadedAlbums(page: number = 1, limit: number = 20, sort: string = 'createdAt', order: string = 'desc'): Promise<UploadedAlbumsResponse> {
    try {
      const response: AxiosResponse<UploadedAlbumsResponse> = await apiClient.get('/artist/uploaded-albums', {
        params: { page, limit, sort, order }
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Network error occurred while fetching uploaded albums. Please check your connection.',
        0
      );
    }
  },

  async deleteSong(songId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response: AxiosResponse<ApiResponse<{ message: string }>> = await apiClient.delete(`/artist/songs/${songId}`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Network error occurred while deleting song. Please check your connection.',
        0
      );
    }
  },

  async deleteAlbum(albumId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response: AxiosResponse<ApiResponse<{ message: string }>> = await apiClient.delete(`/artist/albums/${albumId}`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Network error occurred while deleting album. Please check your connection.',
        0
      );
    }
  },
};

