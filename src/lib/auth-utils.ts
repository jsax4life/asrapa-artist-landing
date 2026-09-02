import { authService, AuthToken, UserData } from '@/lib/auth';
import { AuthSuccessResponse } from '@/lib/api';

export const mapArtistToUserData = (artist: Record<string, unknown>): UserData => ({
  id: String(artist.id ?? artist._id ?? ''),
  fullName: String(artist.fullName ?? ''),
  stageName: String(artist.stageName ?? ''),
  email: String(artist.email ?? ''),
  country: String(artist.country ?? ''),
  createdAt: String(artist.createdAt ?? new Date().toISOString()),
});

export const persistAuthResponse = (
  response: AuthSuccessResponse,
  onLogin?: (userData: UserData) => void
): { userData: UserData; isNewUser: boolean } => {
  const artist = (response.data?.artist ?? response.data ?? {}) as Record<string, unknown>;
  const userData = mapArtistToUserData(artist);

  if (response.newAccessToken) {
    const tokenData: AuthToken = {
      newAccessToken: response.newAccessToken,
      expiresIn: response.expiresIn,
    };
    authService.setAuthData(tokenData, userData);
    onLogin?.(userData);
  }

  return {
    userData,
    isNewUser: response.data?.isNewUser ?? false,
  };
};
