/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse, AxiosError } from 'axios';
import { authService } from './auth';

// API service for AsraPa backend
// For production, set VITE_API_BASE_URL in your environment to 'https://api.asrapa.com/api/v1'
// For local development, it defaults to 'http://localhost:4000/api/v1'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

const AUTH_ROUTES = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/google',
  '/auth/facebook',
  '/auth/refresh-token',
  '/auth/check-email',
  '/auth/check-stage-name',
];

const isAuthRoute = (url?: string) => AUTH_ROUTES.some((route) => url?.includes(route));

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await axios.post<AuthSuccessResponse>(
        `${API_BASE_URL}/artist/auth/refresh-token`,
        {},
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.newAccessToken) {
        authService.updateAccessToken(response.data.newAccessToken, response.data.expiresIn);
        return response.data.newAccessToken;
      }

      return null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
  withCredentials: true,
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
  /** Ville au Tchad, pour le ciblage marketing local (Moundou, Sarh, Bongor, etc.). */
  city?: string;
  agreeToTerms: boolean;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  expiresIn?: string | number;
  newAccessToken?: string;
  refreshToken?: string;
  success?: boolean;
  error?: string | {
    statusCode: number;
    status: string;
    isOperational: boolean;
  };
}

export interface AuthSuccessResponse {
  status: string;
  message?: string;
  newAccessToken: string;
  refreshToken?: string;
  expiresIn?: string;
  data?: {
    artist: Record<string, unknown>;
    isNewUser?: boolean;
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
  _id?: string;
  id?: string;
  genreId?: string;
  name: string;
  description?: string;
  createdBy?: string;
  isActive?: boolean;
  __v?: number;
}

const extractIdValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.$oid === 'string') return obj.$oid.trim();
    if (typeof obj._id === 'string') return obj._id.trim();
    if (typeof obj.id === 'string') return obj.id.trim();
  }
  return undefined;
};

export const extractGenreId = (raw: unknown): string => {
  if (typeof raw === 'string') return raw.trim();
  if (!raw || typeof raw !== 'object') return '';

  const record = raw as Record<string, unknown>;
  const source =
    record.genre && typeof record.genre === 'object'
      ? (record.genre as Record<string, unknown>)
      : record;

  return (
    extractIdValue(source._id) ??
    extractIdValue(source.id) ??
    extractIdValue(source.genreId) ??
    ''
  );
};

export const getGenreId = (genre: Genre): string => extractGenreId(genre);

const normalizeGenre = (raw: unknown): Genre => {
  const id = extractGenreId(raw);
  const record =
    raw && typeof raw === 'object'
      ? ((raw as Record<string, unknown>).genre ?? raw) as Record<string, unknown>
      : {};

  return {
    _id: id || undefined,
    id: id || undefined,
    genreId: id || undefined,
    name: typeof record.name === 'string' ? record.name : '',
    description: typeof record.description === 'string' ? record.description : undefined,
    createdBy: typeof record.createdBy === 'string' ? record.createdBy : undefined,
    isActive: typeof record.isActive === 'boolean' ? record.isActive : undefined,
    __v: typeof record.__v === 'number' ? record.__v : undefined,
  };
};

const parseGenresPayload = (payload: unknown): Genre[] => {
  if (!payload || typeof payload !== 'object') return [];

  const root = payload as Record<string, unknown>;
  const data = root.data;

  if (Array.isArray(data)) {
    return data.map(normalizeGenre).filter((genre) => genre.name);
  }

  if (data && typeof data === 'object') {
    const dataRecord = data as Record<string, unknown>;
    const collections = [dataRecord.genres, dataRecord.genre];
    for (const collection of collections) {
      if (Array.isArray(collection)) {
        return collection.map(normalizeGenre).filter((genre) => genre.name);
      }
    }
  }

  if (Array.isArray(root.genres)) {
    return root.genres.map(normalizeGenre).filter((genre) => genre.name);
  }

  return [];
};

const assertGenreId = (genreId: string): string => {
  const id = genreId.trim();
  if (!id || id === 'genres' || id === 'undefined' || id === 'null') {
    throw new ApiError(
      'Identifiant de genre manquant ou invalide. Actualisez la page et réessayez.',
      400
    );
  }
  return id;
};

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
        const originalRequest = error.config;

        if (isAuthRoute(originalRequest?.url)) {
          throw new ApiError(
            (errorData?.message as string) || 'Authentication failed.',
            status,
            errorData
          );
        }

        if (originalRequest && !(originalRequest as { _retry?: boolean })._retry) {
          (originalRequest as { _retry?: boolean })._retry = true;
          const newToken = await refreshAccessToken();

          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }

        authService.clearAuthData();

        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }

        throw new ApiError(
          'Votre session a expiré. Veuillez vous reconnecter.',
          status,
          errorData
        );
      }
      
      // Handle forbidden errors
      if (status === 403) {
        throw new ApiError(
          'Vous n\'avez pas la permission d\'effectuer cette action.',
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
        'Erreur réseau. Vérifiez votre connexion.',
        0
      );
    } else {
      // Other error
      throw new ApiError(
        'Une erreur inattendue s\'est produite.',
        0
      );
    }
  }
);

export const api = {
  async signupArtist(data: ArtistSignupData): Promise<AuthSuccessResponse> {
    try {
      const response: AxiosResponse<AuthSuccessResponse> = await apiClient.post('/artist/auth/signup', data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau. Vérifiez votre connexion.',
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
        'Erreur réseau. Vérifiez votre connexion.',
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
        'Erreur réseau. Vérifiez votre connexion.',
        0
      );
    }
  },

  async loginArtist(credentials: {
    emailOrStageName: string;
    password: string;
  }): Promise<AuthSuccessResponse> {
    try {
      const response: AxiosResponse<AuthSuccessResponse> = await apiClient.post(
        '/artist/auth/login',
        credentials
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau. Vérifiez votre connexion.',
        0
      );
    }
  },

  async requestPasswordReset(email: string): Promise<{ status: string; message: string }> {
    return this.forgotPassword(email);
  },

  async forgotPassword(email: string): Promise<{ status: string; message: string }> {
    try {
      const response = await apiClient.post<{ status: string; message: string }>(
        '/artist/auth/forgot-password',
        { email }
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau. Vérifiez votre connexion.',
        0
      );
    }
  },

  async resetPassword(data: {
    otp: string;
    password: string;
    passwordConfirm: string;
  }): Promise<AuthSuccessResponse> {
    try {
      const response: AxiosResponse<AuthSuccessResponse> = await apiClient.patch(
        '/artist/auth/reset-password',
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau. Vérifiez votre connexion.',
        0
      );
    }
  },

  async googleAuth(data: { idToken: string; stageName?: string }): Promise<AuthSuccessResponse> {
    try {
      const response: AxiosResponse<AuthSuccessResponse> = await apiClient.post(
        '/artist/auth/google',
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau. Vérifiez votre connexion.',
        0
      );
    }
  },

  async facebookAuth(data: {
    accessToken: string;
    stageName?: string;
  }): Promise<AuthSuccessResponse> {
    try {
      const response: AxiosResponse<AuthSuccessResponse> = await apiClient.post(
        '/artist/auth/facebook',
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau. Vérifiez votre connexion.',
        0
      );
    }
  },

  async refreshToken(): Promise<AuthSuccessResponse> {
    try {
      const response: AxiosResponse<AuthSuccessResponse> = await apiClient.post(
        '/artist/auth/refresh-token'
      );
      if (response.data.newAccessToken) {
        authService.updateAccessToken(response.data.newAccessToken, response.data.expiresIn);
      }
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau. Vérifiez votre connexion.',
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
        'Erreur réseau pendant le téléversement du titre. Vérifiez votre connexion.',
        0
      );
    }
  },

  async updateArtistProfile(data: {
    fullName?: string;
    stageName?: string;
    email?: string;
    country?: string;
    city?: string;
    bio?: string;
  }): Promise<ApiResponse<{ artist: Record<string, unknown> }>> {
    try {
      const response: AxiosResponse<ApiResponse<{ artist: Record<string, unknown> }>> = await apiClient.patch(
        '/artist/profile',
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau pendant la mise à jour du profil. Vérifiez votre connexion.',
        0
      );
    }
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    try {
      const response: AxiosResponse<ApiResponse<{ message: string }>> = await apiClient.patch(
        '/artist/change-password',
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau pendant le changement de mot de passe. Vérifiez votre connexion.',
        0
      );
    }
  },

  async updateProfilePhoto(file: File): Promise<ApiResponse<{ artist: Record<string, unknown> }>> {
    try {
      const formData = new FormData();
      formData.append('artistProfilePicture', file);
      const response: AxiosResponse<ApiResponse<{ artist: Record<string, unknown> }>> = await apiClient.patch(
        '/artist/upload-profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau pendant la mise à jour de la photo de profil. Vérifiez votre connexion.',
        0
      );
    }
  },

  async updateBannerImage(file: File): Promise<ApiResponse<{ artist: Record<string, unknown> }>> {
    try {
      const formData = new FormData();
      formData.append('artistBannerPicture', file);
      const response: AxiosResponse<ApiResponse<{ artist: Record<string, unknown> }>> = await apiClient.patch(
        '/artist/upload-banner-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau pendant la mise à jour de la bannière. Vérifiez votre connexion.',
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
        'Erreur réseau lors du chargement des artistes. Vérifiez votre connexion.',
        0
      );
    }
  },

  async getArtistGenres(): Promise<GenresResponse> {
    try {
      const response: AxiosResponse<GenresResponse> = await apiClient.get('/artist/genres');
      const genres = parseGenresPayload(response.data);
      return {
        ...response.data,
        results: genres.length,
        data: { genres },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau lors du chargement des genres. Vérifiez votre connexion.',
        0
      );
    }
  },

  async getPlatformGenres(): Promise<GenresResponse> {
    try {
      const response: AxiosResponse<GenresResponse> = await apiClient.get('/genres');
      const genres = parseGenresPayload(response.data);
      return {
        ...response.data,
        results: genres.length,
        data: { genres },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau lors du chargement des genres. Vérifiez votre connexion.',
        0
      );
    }
  },

  async getAllGenres(): Promise<GenresResponse> {
    return this.getPlatformGenres();
  },

  async createGenre(name: string, description?: string): Promise<ApiResponse<{ genre: Genre }>> {
    try {
      const response: AxiosResponse<ApiResponse<{ genre: Genre }>> = await apiClient.post('/artist/genres', {
        name,
        ...(description ? { description } : {}),
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau lors de la création du genre. Vérifiez votre connexion.',
        0
      );
    }
  },

  async updateGenre(
    genreId: string,
    data: { name?: string; description?: string }
  ): Promise<ApiResponse<{ genre: Genre }>> {
    try {
      const id = assertGenreId(genreId);
      const response: AxiosResponse<ApiResponse<{ genre: Genre }>> = await apiClient.patch(
        `/artist/genres/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau lors de la modification du genre. Vérifiez votre connexion.',
        0
      );
    }
  },

  async deleteGenre(genreId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const id = assertGenreId(genreId);
      const response: AxiosResponse<ApiResponse<{ message: string }>> = await apiClient.delete(
        `/artist/genres/${id}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Erreur réseau lors de la suppression du genre. Vérifiez votre connexion.',
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
          error.response.data?.message || 'Échec du téléversement de l\'album',
          error.response.status
        );
      } else if (error.request) {
        console.error('Network error:', error.request);
        throw new ApiError(
          'Erreur réseau pendant le téléversement de l\'album. Vérifiez votre connexion.',
          0
        );
      } else if (error.code === 'ECONNABORTED') {
        console.error('Request timeout:', error.message);
        throw new ApiError(
          'Le téléversement de l\'album a expiré. Réessayez avec des fichiers plus légers ou vérifiez votre connexion.',
          0
        );
      } else {
        console.error('Unexpected error:', error.message);
        throw new ApiError(
          'Une erreur inattendue s\'est produite pendant le téléversement de l\'album.',
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
        'Erreur réseau lors du chargement de vos titres. Vérifiez votre connexion.',
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
        'Erreur réseau lors du chargement de vos albums. Vérifiez votre connexion.',
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
        'Erreur réseau lors de la suppression du titre. Vérifiez votre connexion.',
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
        'Erreur réseau lors de la suppression de l\'album. Vérifiez votre connexion et réessayez.',
        0
      );
    }
  },
};

