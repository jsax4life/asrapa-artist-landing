const API_BASE = "https://api.asrapa.com";

export type SpotlightArtist = {
  id: string;
  name: string;
  stageName?: string;
  fullName?: string;
  profilePicture?: string;
};

export type SpotlightGenre = {
  id: string;
  name: string;
  coverImageUrl?: string;
};

export type SpotlightAlbum = {
  id: string;
  title: string;
  coverPhotoUrl?: string;
};

export type SpotlightTrack = {
  id: string;
  title: string;
  duration: number;
  songUrl: string;
  s3Key?: string;
  coverPhotoUrl?: string;
  isExplicit?: boolean;
  streams?: number;
  monthlyListens: number;
  releaseDate?: string;
  artist: SpotlightArtist;
  genre: SpotlightGenre;
  album?: SpotlightAlbum;
};

export type SpotlightCollection = {
  type: string;
  id: string;
  title: string;
  coverPhotoUrl?: string;
  trackCount: number;
};

export type LandingSpotlight = {
  currentTrack: SpotlightTrack;
  featuredArtist: SpotlightArtist & {
    totalFans?: number;
    newFansThisMonth: number;
  };
  relatedCollections: SpotlightCollection[];
};

type LandingSpotlightResponse = {
  status: string;
  data: LandingSpotlight;
};

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function formatCount(n: number, locale: "en" | "fr"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(n);
}

export function trackCoverUrl(track: SpotlightTrack): string | undefined {
  return track.coverPhotoUrl || track.album?.coverPhotoUrl;
}

export function artistDisplayName(artist: SpotlightArtist): string {
  return artist.stageName || artist.name;
}

export async function fetchLandingSpotlight(): Promise<LandingSpotlight> {
  const paths = ["/api/v1/settings/landing-spotlight", "/api/v1/settings/trending-now"];

  let lastError = "Landing spotlight request failed";

  for (const path of paths) {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
    });

    const json = (await res.json().catch(() => null)) as
      LandingSpotlightResponse | { status?: string; message?: string } | null;

    if (res.ok && json && json.status === "success" && "data" in json && json.data?.currentTrack) {
      return json.data;
    }

    lastError =
      json && "message" in json && json.message
        ? json.message
        : `Landing spotlight request failed (${res.status})`;
  }

  throw new Error(lastError);
}
