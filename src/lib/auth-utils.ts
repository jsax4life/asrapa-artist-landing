import { authService, AuthToken, UserData } from '@/lib/auth';
import { AuthSuccessResponse } from '@/lib/api';

const optionalString = (value: unknown) => (value ? String(value) : undefined);

export const mapArtistToUserData = (artist: Record<string, unknown>): UserData => ({
  id: String(artist.id ?? artist._id ?? ''),
  fullName: String(artist.fullName ?? ''),
  stageName: String(artist.stageName ?? ''),
  email: String(artist.email ?? ''),
  country: String(artist.country ?? ''),
  createdAt: String(artist.createdAt ?? new Date().toISOString()),
  ...(optionalString(artist.profilePicture) ? { profilePhotoUrl: String(artist.profilePicture) } : {}),
  ...(optionalString(artist.bannerImage ?? artist.bannerImageUrl)
    ? { bannerImageUrl: String(artist.bannerImage ?? artist.bannerImageUrl) }
    : {}),
  ...(optionalString(artist.bio) ? { bio: String(artist.bio) } : {}),
  ...(optionalString(artist.city) ? { city: String(artist.city) } : {}),
  ...(optionalString(artist.hometown) ? { hometown: String(artist.hometown) } : {}),
  ...(optionalString(artist.website) ? { website: String(artist.website) } : {}),
  ...(optionalString(artist.twitter) ? { twitter: String(artist.twitter) } : {}),
  ...(optionalString(artist.facebook) ? { facebook: String(artist.facebook) } : {}),
  ...(optionalString(artist.instagram) ? { instagram: String(artist.instagram) } : {}),
  ...(optionalString(artist.youtube) ? { youtube: String(artist.youtube) } : {}),
  ...(optionalString(artist.tiktok) ? { tiktok: String(artist.tiktok) } : {}),
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
