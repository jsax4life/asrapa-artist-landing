import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Music, Edit, Trash2, BarChart2, Loader2, AlertCircle, Disc3, Mic, Eye, ScrollText, ArchiveRestore } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, ApiError, AlbumDetailTrack, DeletedSong, Genre, extractGenreId, getGenreId, UploadedSong } from "@/lib/api";
import { ROUTES } from "@/constants/routes";

const toDateInputValue = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

const openDatePicker = (event: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
  event.currentTarget.showPicker?.();
};

const resolveGenreId = (genre: { _id?: string; name: string } | undefined, genres: Genre[]) => {
  const fromObject = extractGenreId(genre);
  if (fromObject) return fromObject;
  if (genre?.name) {
    const match = genres.find((g) => g.name === genre.name);
    if (match) return getGenreId(match);
  }
  return '';
};

// Combined release data for display
interface CombinedRelease {
  id: string;
  title: string;
  type: 'Single' | 'Album';
  releaseDate: string;
  status: string;
  artwork: string;
  genre: string;
  caption?: string;
  songUrl?: string;
  songsCount?: number;
  likesCount?: number;
  downloads?: number;
  streams?: number;
  isFromAlbum: boolean;
  duration?: number;
  explicit?: boolean;
  genreId?: string;
  lyrics?: string;
}

type EditForm = {
  title: string;
  genreId: string;
  explicit: boolean;
  duration: number;
  lyrics: string;
  releaseDate: string;
  caption: string;
  coverPhoto: File | null;
  coverPreview: string | null;
  existingSongIds: string[];
  newSongFiles: File[];
};

/** Nombre max. de titres qu'on peut ajouter à un album existant en une fois — même
 * limite que celle imposée par le backend à la création (voir Upload.tsx). */
const MAX_NEW_SONGS_PER_ALBUM = 10;

const getSongAlbumId = (album: UploadedSong['album']): string | null => {
  if (!album) return null;
  if (typeof album === 'string') return album;
  if (typeof album === 'object' && album._id) return String(album._id);
  return null;
};

/** Singles tab: API isSingle when present; else orphans / deleted album / no active album. */
const shouldShowInSinglesTab = (song: UploadedSong, activeAlbumIds: Set<string>): boolean => {
  if (song.isSingle === true) return true;
  if (song.isSingle === false) return false;
  if (!song.album) return true;
  if (typeof song.album === 'object' && song.album.isDeleted) return true;
  const albumId = getSongAlbumId(song.album);
  if (!albumId) return true;
  return !activeAlbumIds.has(albumId);
};

const formatDurationMmSs = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const MusicLibrary = () => {
  const { t, i18n } = useTranslation();
  const [singles, setSingles] = useState<CombinedRelease[]>([]);
  const [albums, setAlbums] = useState<CombinedRelease[]>([]);
  const [deletedSongs, setDeletedSongs] = useState<DeletedSong[]>([]);
  const [trashRetentionDays, setTrashRetentionDays] = useState(7);
  const [trashActionId, setTrashActionId] = useState<string | null>(null);
  const [standaloneSongs, setStandaloneSongs] = useState<UploadedSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRelease, setSelectedRelease] = useState<CombinedRelease | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingRelease, setEditingRelease] = useState<CombinedRelease | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [editForm, setEditForm] = useState<EditForm>({
    title: '',
    genreId: '',
    explicit: false,
    duration: 0,
    lyrics: '',
    releaseDate: '',
    caption: '',
    coverPhoto: null,
    coverPreview: null,
    existingSongIds: [],
    newSongFiles: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [analyticsRelease, setAnalyticsRelease] = useState<CombinedRelease | null>(null);
  const [albumTracksById, setAlbumTracksById] = useState<Record<string, AlbumDetailTrack[]>>({});
  const [loadingAlbumTracksId, setLoadingAlbumTracksId] = useState<string | null>(null);
  const [albumTracksErrorId, setAlbumTracksErrorId] = useState<string | null>(null);
  const [deletingTrackId, setDeletingTrackId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getTrashedTracksForAlbum = useCallback(
    (albumId: string, albumTitle: string) =>
      deletedSongs.filter((song) => {
        const songAlbumId = getSongAlbumId(song.album as UploadedSong['album']);
        if (songAlbumId) return songAlbumId === albumId;
        return (
          typeof song.album === 'object' &&
          song.album?.title != null &&
          song.album.title === albumTitle
        );
      }),
    [deletedSongs]
  );

  const loadAlbumTracks = useCallback(async (albumId: string) => {
    setLoadingAlbumTracksId(albumId);
    setAlbumTracksErrorId(null);

    const catalogSongToTrack = (song: UploadedSong): AlbumDetailTrack => ({
      _id: song._id,
      title: song.title,
      duration: song.duration,
      songUrl: song.songUrl,
      coverPhotoUrl: song.coverPhotoUrl,
      downloads: song.downloads,
      streams: song.streams,
    });

    try {
      const [detailResult, catalogResult] = await Promise.allSettled([
        api.getAlbumById(albumId),
        api.getUploadedSongsForAlbum(albumId),
      ]);

      const byId = new Map<string, AlbumDetailTrack>();
      let albumOrder: string[] = [];

      if (detailResult.status === 'fulfilled') {
        albumOrder = (detailResult.value.data?.album?.songs ?? []).map((t) => String(t._id));
        for (const track of detailResult.value.data?.album?.songs ?? []) {
          if (track?._id) {
            byId.set(String(track._id), track);
          }
        }
      }

      if (catalogResult.status === 'fulfilled') {
        for (const song of catalogResult.value) {
          byId.set(String(song._id), catalogSongToTrack(song));
        }
      }

      const tracks = Array.from(byId.values());
      tracks.sort((a, b) => {
        const indexA = albumOrder.indexOf(String(a._id));
        const indexB = albumOrder.indexOf(String(b._id));
        if (indexA === -1 && indexB === -1) {
          return a.title.localeCompare(b.title);
        }
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });

      if (
        tracks.length === 0 &&
        detailResult.status === 'rejected' &&
        catalogResult.status === 'rejected'
      ) {
        setAlbumTracksErrorId(albumId);
      } else {
        setAlbumTracksById((prev) => ({ ...prev, [albumId]: tracks }));
      }
    } catch (err) {
      console.error('Failed to load album tracks:', err);
      setAlbumTracksErrorId(albumId);
    } finally {
      setLoadingAlbumTracksId(null);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setAlbumTracksById({});
      setAlbumTracksErrorId(null);
      
      const [songsResponse, albumsResponse, genresResponse, deletedResponse] = await Promise.all([
        api.getUploadedSongs(1, 100),
        api.getUploadedAlbums(1, 50),
        api.getPlatformGenres(),
        api.getDeletedSongs(1, 50).catch(() => null),
      ]);

      const genreList = genresResponse.status === 'success' && genresResponse.data
        ? genresResponse.data.genres
        : [];
      setGenres(genreList);

      const singlesData: CombinedRelease[] = [];
      const albumsData: CombinedRelease[] = [];

      let activeAlbumIdSet = new Set<string>();

      if (albumsResponse.status === 'success' && albumsResponse.data) {
        const activeAlbums = albumsResponse.data.albums.filter((album) => !album.isDeleted);
        activeAlbumIdSet = new Set(activeAlbums.map((album) => album._id));
        const albumReleases: CombinedRelease[] = activeAlbums.map((album) => ({
          id: album._id,
          title: album.title,
          type: 'Album' as const,
          releaseDate: album.releaseDate,
          status: album.status,
          artwork: album.coverPhotoUrl,
          genre: album.genre.name,
          genreId: resolveGenreId(album.genre, genreList),
          caption: album.caption,
          explicit: album.explicit ?? album.moderation?.isExplicit ?? false,
          songsCount: album.songsCount,
          likesCount: album.likesCount,
          isFromAlbum: true
        }));
        albumsData.push(...albumReleases);
      }

      if (songsResponse.status === 'success' && songsResponse.data) {
        const activeSongs = songsResponse.data.songs.filter((song) => !song.isDeleted);
        const librarySingles = activeSongs.filter((song) =>
          shouldShowInSinglesTab(song, activeAlbumIdSet)
        );
        setStandaloneSongs(librarySingles);
        const songReleases: CombinedRelease[] = librarySingles.map((song) => ({
          id: song._id,
          title: song.title,
          type: 'Single' as const,
          releaseDate: song.releaseDate,
          status: 'Active',
          artwork: song.coverPhotoUrl,
          songUrl: song.songUrl,
          genre: song.genre.name,
          genreId: resolveGenreId(song.genre, genreList),
          downloads: song.downloads,
          streams: song.streams,
          isFromAlbum: false,
          duration: song.duration,
          explicit: song.explicit,
          lyrics: song.lyrics,
        }));
        singlesData.push(...songReleases);
      }

      singlesData.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      albumsData.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      
      setSingles(singlesData);
      setAlbums(albumsData);

      if (deletedResponse?.status === 'success' && deletedResponse.data) {
        setDeletedSongs(deletedResponse.data.songs);
        if (deletedResponse.retentionDays) {
          setTrashRetentionDays(deletedResponse.retentionDays);
        }
      } else {
        setDeletedSongs([]);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      const errorMessage = error instanceof ApiError ? error.message : t('musicLibraryPage.toast.loadErrorDescription');
      setError(errorMessage);
      toast({
        title: t('musicLibraryPage.toast.loadErrorTitle'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch releases data
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'distributed':
      case 'published':
        return 'bg-primary text-primary-foreground';
      case 'pending':
      case 'under review':
        return 'bg-white/15 text-white/80';
      case 'upcoming':
        return 'bg-primary/20 text-primary';
      case 'archived':
      case 'draft':
        return 'bg-white/10 text-white/50';
      default:
        return 'bg-white/10 text-white/50';
    }
  };

  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'distributed':
      case 'published':
        return t('musicLibraryPage.status.active');
      case 'pending':
      case 'under review':
        return t('musicLibraryPage.status.pending');
      case 'upcoming':
        return t('musicLibraryPage.status.upcoming');
      case 'archived':
        return t('musicLibraryPage.status.archived');
      case 'draft':
        return t('musicLibraryPage.status.draft');
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Action handlers
  const handleViewRelease = (release: CombinedRelease) => {
    setSelectedRelease(release);
    if (release.type === 'Album') {
      void loadAlbumTracks(release.id);
    }
  };

  const navigateToLyrics = (track: {
    _id: string;
    title: string;
    songUrl?: string;
    duration?: number;
    coverPhotoUrl?: string;
  }) => {
    navigate(
      ROUTES.SONG_LYRICS.replace(':songId', track._id),
      {
        state: {
          songId: track._id,
          title: track.title,
          songUrl: track.songUrl,
          durationSec: track.duration,
          artwork: track.coverPhotoUrl,
        },
      }
    );
  };

  const handleEditRelease = (release: CombinedRelease) => {
    setEditingRelease(release);
    setEditForm({
      title: release.title,
      genreId: release.genreId || resolveGenreId({ name: release.genre }, genres),
      explicit: release.explicit || false,
      duration: release.duration || 0,
      lyrics: release.lyrics || '',
      releaseDate: toDateInputValue(release.releaseDate),
      caption: release.caption || '',
      coverPhoto: null,
      coverPreview: release.artwork || null,
      existingSongIds: [],
      newSongFiles: [],
    });
  };

  const handleNewSongFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    event.target.value = '';
    if (files.length === 0) return;

    const validFiles = files.filter(file => file.type.startsWith('audio/'));
    if (validFiles.length !== files.length) {
      toast({
        title: t('uploadPage.toast.invalidFileTypeTitle'),
        description: t('uploadPage.toast.someFilesIgnoredDescription'),
        variant: "destructive",
      });
    }

    setEditForm((prev) => {
      const combined = [...prev.newSongFiles, ...validFiles];
      if (combined.length > MAX_NEW_SONGS_PER_ALBUM) {
        toast({
          title: t('uploadPage.toast.tooManySongsTitle'),
          description: t('uploadPage.toast.tooManySongsDescription', { max: MAX_NEW_SONGS_PER_ALBUM, count: combined.length }),
          variant: "destructive",
        });
      }
      return { ...prev, newSongFiles: combined.slice(0, MAX_NEW_SONGS_PER_ALBUM) };
    });
  };

  const handleCoverPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: t('musicLibraryPage.editDialog.invalidCoverTitle'),
        description: t('musicLibraryPage.editDialog.invalidCoverDescription'),
        variant: "destructive",
      });
      return;
    }

    setEditForm((prev) => ({
      ...prev,
      coverPhoto: file,
      coverPreview: URL.createObjectURL(file),
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingRelease) return;
    try {
      setIsSaving(true);

      const releaseDate = editForm.releaseDate
        ? new Date(`${editForm.releaseDate}T00:00:00.000Z`).toISOString()
        : undefined;

      if (editingRelease.type === 'Single') {
        await api.updateSong(editingRelease.id, {
          title: editForm.title.trim(),
          duration: editForm.duration,
          genreId: editForm.genreId || undefined,
          explicit: editForm.explicit,
          lyrics: editForm.lyrics,
          releaseDate,
          coverPhoto: editForm.coverPhoto || undefined,
        });
      } else {
        await api.updateAlbum(editingRelease.id, {
          title: editForm.title.trim(),
          releaseDate,
          genreId: editForm.genreId || undefined,
          explicit: editForm.explicit,
          caption: editForm.caption,
          coverPhoto: editForm.coverPhoto || undefined,
          existingSongIds: editForm.existingSongIds.length ? editForm.existingSongIds : undefined,
          newSongFiles: editForm.newSongFiles.length ? editForm.newSongFiles : undefined,
        });
      }

      toast({
        title: t('musicLibraryPage.toast.editSuccessTitle'),
        description: t('musicLibraryPage.toast.editSuccessDescription', { title: editForm.title }),
      });
      setEditingRelease(null);
      refreshData();
    } catch (error) {
      console.error('Error updating release:', error);
      const errorMessage = error instanceof ApiError ? error.message : t('musicLibraryPage.toast.editErrorDescription');
      toast({
        title: t('musicLibraryPage.toast.editErrorTitle'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyticsRelease = (release: CombinedRelease) => {
    setAnalyticsRelease(release);
  };

  const handleDeleteAlbumTrack = async (albumId: string, track: AlbumDetailTrack) => {
    try {
      setDeletingTrackId(track._id);
      const result = await api.deleteSong(track._id);
      toast({
        title: t('musicLibraryPage.toast.softDeleteSuccessTitle'),
        description:
          result.message ||
          t('musicLibraryPage.toast.softDeleteAlbumTrackDescription', {
            title: track.title,
            days: result.retentionDays ?? trashRetentionDays,
          }),
      });
      await refreshData();
      await loadAlbumTracks(albumId);
    } catch (error) {
      console.error('Error deleting album track:', error);
      const errorMessage =
        error instanceof ApiError ? error.message : t('musicLibraryPage.toast.deleteErrorDescription');
      toast({
        title: t('musicLibraryPage.toast.deleteErrorTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setDeletingTrackId(null);
    }
  };

  const handleDeleteRelease = async (release: CombinedRelease) => {
    try {
      setIsDeleting(true);
      
      if (release.type === 'Single') {
        const result = await api.deleteSong(release.id);
        toast({
          title: t('musicLibraryPage.toast.softDeleteSuccessTitle'),
          description:
            result.message ||
            t('musicLibraryPage.toast.softDeleteSuccessDescription', {
              title: release.title,
              days: result.retentionDays ?? trashRetentionDays,
            }),
        });
      } else {
        await api.deleteAlbum(release.id);
        toast({
          title: t('musicLibraryPage.toast.softDeleteSuccessTitle'),
          description: t('musicLibraryPage.toast.softDeleteAlbumDescription', {
            title: release.title,
            days: trashRetentionDays,
          }),
        });
      }

      await refreshData();
    } catch (error) {
      console.error('Error deleting release:', error);
      const errorMessage = error instanceof ApiError ? error.message : t('musicLibraryPage.toast.deleteErrorDescription');
      toast({
        title: t('musicLibraryPage.toast.deleteErrorTitle'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestoreSong = async (song: DeletedSong, albumIdToReload?: string) => {
    try {
      setTrashActionId(song._id);
      const result = await api.restoreSong(song._id);
      const albumTitle =
        song.album && typeof song.album === 'object' && song.album.title ? song.album.title : null;
      toast({
        title: t('musicLibraryPage.toast.restoreSuccessTitle'),
        description:
          result.message ||
          (albumTitle
            ? t('musicLibraryPage.toast.restoreSuccessAlbumTrack', {
                title: song.title,
                album: albumTitle,
              })
            : t('musicLibraryPage.toast.restoreSuccessDescription', { title: song.title })),
      });
      await refreshData();
      if (albumIdToReload) {
        await loadAlbumTracks(albumIdToReload);
      }
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : t('musicLibraryPage.toast.restoreErrorDescription');
      toast({
        title: t('musicLibraryPage.toast.restoreErrorTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setTrashActionId(null);
    }
  };

  const handlePermanentDeleteSong = async (song: DeletedSong, albumIdToReload?: string) => {
    try {
      setTrashActionId(song._id);
      const result = await api.permanentlyDeleteSong(song._id);
      toast({
        title: t('musicLibraryPage.toast.permanentDeleteSuccessTitle'),
        description:
          result.message ||
          t('musicLibraryPage.toast.permanentDeleteSuccessDescription', { title: song.title }),
      });
      await refreshData();
      if (albumIdToReload) {
        await loadAlbumTracks(albumIdToReload);
      }
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : t('musicLibraryPage.toast.permanentDeleteErrorDescription');
      toast({
        title: t('musicLibraryPage.toast.permanentDeleteErrorTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setTrashActionId(null);
    }
  };

  const formatTrashDate = (iso?: string | null) => {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const renderTrashList = () => {
    if (deletedSongs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Trash2 className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2 mt-4">{t('musicLibraryPage.trash.emptyTitle')}</h3>
          <p className="text-muted-foreground max-w-md">{t('musicLibraryPage.trash.emptyDescription')}</p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[500px]">
        <div className="grid gap-4">
          {deletedSongs.map((song) => {
            const busy = trashActionId === song._id;
            return (
              <div
                key={song._id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-md border border-border bg-muted/20"
              >
                <Avatar className="h-16 w-16 rounded-md shrink-0">
                  <AvatarImage src={song.coverPhotoUrl} alt={song.title} />
                  <AvatarFallback>{song.title.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{song.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {song.genre?.name} • {t('musicLibraryPage.trash.deletedOn', { date: formatTrashDate(song.deletedAt) })}
                  </p>
                  {song.album?.title && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('musicLibraryPage.trash.fromAlbum', { album: song.album.title })}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {song.restoreAllowed
                      ? t('musicLibraryPage.trash.permanentOn', {
                          date: formatTrashDate(song.permanentDeletionAt),
                        })
                      : t('musicLibraryPage.trash.restoreExpired')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy || !song.restoreAllowed}
                    onClick={() => handleRestoreSong(song)}
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ArchiveRestore className="h-4 w-4 mr-1" />
                        {t('musicLibraryPage.trash.restore')}
                      </>
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive" size="sm" disabled={busy}>
                        {t('musicLibraryPage.trash.deleteForever')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t('musicLibraryPage.trash.permanentDialog.title', { title: song.title })}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('musicLibraryPage.trash.permanentDialog.description')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('musicLibraryPage.trash.permanentDialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handlePermanentDeleteSong(song)}
                        >
                          {t('musicLibraryPage.trash.permanentDialog.confirm')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  const renderReleaseList = (releases: CombinedRelease[], emptyMessage: string, emptyIcon: React.ReactNode) => {
    if (releases.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          {emptyIcon}
          <h3 className="text-lg font-medium text-foreground mb-2 mt-4">{t('musicLibraryPage.emptyState.title')}</h3>
          <p className="text-muted-foreground mb-4">
            {emptyMessage}
          </p>
          <Link to={ROUTES.UPLOAD}>
            <Button className="bg-primary hover:bg-primary-dark text-primary-foreground">
              <Upload className="h-4 w-4 mr-2" />
              {t('musicLibraryPage.emptyState.uploadButton')}
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[500px]">
        <div className="grid gap-4">
          {releases.map((release) => (
            <div key={release.id} className="flex items-center space-x-4 p-3 hover:bg-accent/50 rounded-md transition-colors">
              <Avatar className="h-16 w-16 rounded-md">
                <AvatarImage src={release.artwork} alt={release.title} />
                <AvatarFallback>{release.title.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {release.title} 
                  <span className="text-sm text-muted-foreground ml-1">({release.type})</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('musicLibraryPage.list.releaseInfo', { genre: release.genre, date: formatDate(release.releaseDate) })}
                </p>
                {release.caption && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {release.caption}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block ${getStatusColor(release.status)}`}>
                    {translateStatus(release.status)}
                  </span>
                  {release.songsCount && (
                    <span className="text-xs text-muted-foreground">
                      {t('musicLibraryPage.list.songsCount', { count: release.songsCount })}
                    </span>
                  )}
                  {release.downloads && (
                    <span className="text-xs text-muted-foreground">
                      {t('musicLibraryPage.list.downloads', { count: release.downloads })}
                    </span>
                  )}
                  {release.streams && (
                    <span className="text-xs text-muted-foreground">
                      {t('musicLibraryPage.list.streams', { count: release.streams })}
                    </span>
                  )}
                  {release.likesCount && (
                    <span className="text-xs text-muted-foreground">
                      {t('musicLibraryPage.list.likes', { count: release.likesCount })}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {/* View Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-primary"
                      onClick={() => handleViewRelease(release)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-4 overflow-hidden">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={release.artwork} alt={release.title} />
                          <AvatarFallback>{release.title.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {release.title}
                      </DialogTitle>
                      <DialogDescription>
                        {t('musicLibraryPage.dialog.subtitle', {
                          type: release.type === 'Single' ? t('musicLibraryPage.dialog.single') : t('musicLibraryPage.dialog.album'),
                          genre: release.genre,
                          date: formatDate(release.releaseDate),
                        })}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 min-h-0 flex-1 overflow-y-auto pr-1">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">{t('musicLibraryPage.dialog.status')}</h4>
                          <span className={`text-sm font-semibold px-2 py-1 rounded-full inline-block ${getStatusColor(release.status)}`}>
                            {translateStatus(release.status)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">{t('musicLibraryPage.dialog.type')}</h4>
                          <p className="text-sm">{release.type === 'Single' ? t('musicLibraryPage.dialog.single') : t('musicLibraryPage.dialog.album')}</p>
                        </div>
                      </div>
                      {release.caption && (
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">{t('musicLibraryPage.dialog.description')}</h4>
                          <p className="text-sm">{release.caption}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        {release.downloads && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground">{t('musicLibraryPage.dialog.downloads')}</h4>
                            <p className="text-sm font-medium">{release.downloads.toLocaleString()}</p>
                          </div>
                        )}
                        {release.streams && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground">{t('musicLibraryPage.dialog.streams')}</h4>
                            <p className="text-sm font-medium">{release.streams.toLocaleString()}</p>
                          </div>
                        )}
                        {release.songsCount && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground">{t('musicLibraryPage.dialog.songs')}</h4>
                            <p className="text-sm font-medium">{release.songsCount}</p>
                          </div>
                        )}
                        {release.likesCount && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground">{t('musicLibraryPage.dialog.likes')}</h4>
                            <p className="text-sm font-medium">{release.likesCount}</p>
                          </div>
                        )}
                      </div>
                      {release.type === 'Album' ? (
                        <div className="border-t border-white/10 pt-4">
                          <h4 className="font-medium text-sm text-muted-foreground mb-3">
                            {t('musicLibraryPage.dialog.trackListTitle')}
                            {' '}
                            <span className="text-white/70">
                              ({t('musicLibraryPage.dialog.trackListCount', {
                                shown: albumTracksById[release.id]?.length ?? 0,
                                total: release.songsCount ?? albumTracksById[release.id]?.length ?? 0,
                              })})
                            </span>
                          </h4>
                          {loadingAlbumTracksId === release.id ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {t('musicLibraryPage.dialog.trackListLoading')}
                            </div>
                          ) : albumTracksErrorId === release.id ? (
                            <div className="flex flex-col gap-2 py-2">
                              <p className="text-sm text-destructive">
                                {t('musicLibraryPage.dialog.trackListError')}
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-fit"
                                onClick={() => void loadAlbumTracks(release.id)}
                              >
                                {t('musicLibraryPage.error.retry')}
                              </Button>
                            </div>
                          ) : (albumTracksById[release.id]?.length ?? 0) === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              {t('musicLibraryPage.dialog.trackListEmpty')}
                            </p>
                          ) : (
                            <div
                              className="max-h-[min(320px,45vh)] overflow-y-auto overscroll-contain rounded-md border border-white/10 pr-1"
                              role="region"
                              aria-label={t('musicLibraryPage.dialog.trackListTitle')}
                            >
                              <ul className="space-y-2 p-1">
                                {(albumTracksById[release.id] ?? []).map((track, index) => (
                                  <li
                                    key={track._id}
                                    className="flex items-center justify-between gap-2 rounded-md bg-white/5 px-3 py-2"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium truncate">
                                        {index + 1}. {track.title}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDurationMmSs(track.duration || 0)}
                                        {track.streams != null
                                          ? ` • ${t('musicLibraryPage.list.streams', { count: track.streams })}`
                                          : null}
                                      </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-0.5">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-primary"
                                        title={t('musicLibraryPage.lyrics.manage')}
                                        onClick={() => navigateToLyrics(track)}
                                      >
                                        <ScrollText className="h-4 w-4" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-red-500"
                                            disabled={deletingTrackId === track._id}
                                            title={t('musicLibraryPage.deleteDialog.confirmMoveToTrash')}
                                          >
                                            {deletingTrackId === track._id ? (
                                              <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                              <Trash2 className="h-4 w-4" />
                                            )}
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              {t('musicLibraryPage.deleteDialog.titleAlbumTrack')}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              {t('musicLibraryPage.deleteDialog.descriptionAlbumTrack', {
                                                title: track.title,
                                                album: release.title,
                                                days: trashRetentionDays,
                                              })}
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              {t('musicLibraryPage.deleteDialog.cancel')}
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              className="bg-destructive hover:bg-destructive/90"
                                              disabled={deletingTrackId === track._id}
                                              onClick={() => handleDeleteAlbumTrack(release.id, track)}
                                            >
                                              {t('musicLibraryPage.deleteDialog.confirmMoveToTrash')}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(() => {
                            const trashed = getTrashedTracksForAlbum(release.id, release.title);
                            if (trashed.length === 0) return null;
                            return (
                              <div className="border-t border-white/10 pt-4 mt-4">
                                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                                  {t('musicLibraryPage.dialog.tracksInTrashTitle')}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-3">
                                  {t('musicLibraryPage.dialog.tracksInTrashHint', {
                                    days: trashRetentionDays,
                                  })}
                                </p>
                                <ul className="space-y-2">
                                  {trashed.map((song) => {
                                    const busy = trashActionId === song._id;
                                    return (
                                      <li
                                        key={song._id}
                                        className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-md border border-border/60 bg-muted/20 px-3 py-2"
                                      >
                                        <div className="min-w-0 flex-1">
                                          <p className="text-sm font-medium truncate">{song.title}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {t('musicLibraryPage.trash.deletedOn', {
                                              date: formatTrashDate(song.deletedAt),
                                            })}
                                          </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 shrink-0">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={busy || !song.restoreAllowed}
                                            onClick={() => handleRestoreSong(song, release.id)}
                                          >
                                            {busy ? (
                                              <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                              <>
                                                <ArchiveRestore className="h-4 w-4 mr-1" />
                                                {t('musicLibraryPage.trash.restore')}
                                              </>
                                            )}
                                          </Button>
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                disabled={busy}
                                              >
                                                {t('musicLibraryPage.trash.deleteForever')}
                                              </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                  {t('musicLibraryPage.trash.permanentDialog.title', {
                                                    title: song.title,
                                                  })}
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  {t('musicLibraryPage.trash.permanentDialog.description')}
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                  {t('musicLibraryPage.trash.permanentDialog.cancel')}
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                  className="bg-destructive hover:bg-destructive/90"
                                                  onClick={() =>
                                                    handlePermanentDeleteSong(song, release.id)
                                                  }
                                                >
                                                  {t('musicLibraryPage.trash.permanentDialog.confirm')}
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            );
                          })()}
                        </div>
                      ) : null}
                    </div>
                  </DialogContent>
                </Dialog>

                {release.type === 'Single' ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                    title={t('musicLibraryPage.lyrics.manage')}
                    onClick={() =>
                      navigateToLyrics({
                        _id: release.id,
                        title: release.title,
                        songUrl: release.songUrl,
                        duration: release.duration,
                        coverPhotoUrl: release.artwork,
                      })
                    }
                  >
                    <ScrollText className="h-4 w-4" />
                  </Button>
                ) : null}

                {/* Edit Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleEditRelease(release)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                {/* Analytics Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => handleAnalyticsRelease(release)}
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>

                {/* Delete Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-red-500"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {release.type === 'Single' ? t('musicLibraryPage.deleteDialog.titleSingle') : t('musicLibraryPage.deleteDialog.titleAlbum')}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {release.type === 'Single'
                          ? t('musicLibraryPage.deleteDialog.descriptionSingle', {
                              title: release.title,
                              days: trashRetentionDays,
                            })
                          : t('musicLibraryPage.deleteDialog.descriptionAlbum', {
                              title: release.title,
                              days: trashRetentionDays,
                            })}
                        {release.type === 'Album' && release.songsCount ? (
                          <span className="block mt-2 text-primary font-medium">
                            {t('musicLibraryPage.deleteDialog.albumWarning', { count: release.songsCount })}
                          </span>
                        ) : null}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('musicLibraryPage.deleteDialog.cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteRelease(release)}
                        className="bg-destructive hover:bg-destructive/90"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {t('musicLibraryPage.deleteDialog.deleting')}
                          </>
                        ) : (
                          t('musicLibraryPage.deleteDialog.confirmMoveToTrash')
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 flex flex-col">
            <header className="h-16 flex items-center border-b border-border bg-card px-6">
              <SidebarTrigger className="mr-4" />
              <h2 className="text-lg font-semibold text-foreground">{t('musicLibraryPage.header.title')}</h2>
            </header>
            <main className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">{t('musicLibraryPage.loading.message')}</p>
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 flex flex-col">
            <header className="h-16 flex items-center border-b border-border bg-card px-6">
              <SidebarTrigger className="mr-4" />
              <h2 className="text-lg font-semibold text-foreground">{t('musicLibraryPage.header.title')}</h2>
            </header>
            <main className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-destructive">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  {t('musicLibraryPage.error.retry')}
                </Button>
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">{t('musicLibraryPage.header.title')}</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Upload Music CTA */}
              <Card className="bg-card border-border shadow-card animate-fade-in flex flex-col sm:flex-row items-center justify-between p-6">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">{t('musicLibraryPage.cta.title')}</CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    {t('musicLibraryPage.cta.description')}
                  </CardDescription>
                </div>
                <Link to={ROUTES.UPLOAD}>
                  <Button className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark text-primary-foreground flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    {t('musicLibraryPage.cta.button')}
                  </Button>
                </Link>
              </Card>

              {/* Music Library with Tabs */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">{t('musicLibraryPage.card.title')}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('musicLibraryPage.card.description', { count: singles.length + albums.length })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="singles" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="singles" className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        {t('musicLibraryPage.tabs.singles', { count: singles.length })}
                      </TabsTrigger>
                      <TabsTrigger value="albums" className="flex items-center gap-2">
                        <Disc3 className="h-4 w-4" />
                        {t('musicLibraryPage.tabs.albums', { count: albums.length })}
                      </TabsTrigger>
                      <TabsTrigger value="trash" className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        {t('musicLibraryPage.tabs.trash', { count: deletedSongs.length })}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="singles" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-foreground">{t('musicLibraryPage.tabs.singlesTitle')}</CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {t('musicLibraryPage.tabs.singlesDescription')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {renderReleaseList(
                            singles,
                            t('musicLibraryPage.emptyState.singles'),
                            <Mic className="h-12 w-12 text-muted-foreground" />
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="albums" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-foreground">{t('musicLibraryPage.tabs.albumsTitle')}</CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {t('musicLibraryPage.tabs.albumsDescription')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {renderReleaseList(
                            albums,
                            t('musicLibraryPage.emptyState.albums'),
                            <Disc3 className="h-12 w-12 text-muted-foreground" />
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="trash" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-foreground">
                            {t('musicLibraryPage.trash.title')}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {t('musicLibraryPage.trash.description', { days: trashRetentionDays })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>{renderTrashList()}</CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

            </div>
          </main>
        </div>
      </SidebarInset>

      {/* Edit Dialog */}
      <Dialog open={!!editingRelease} onOpenChange={(open) => !open && setEditingRelease(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRelease?.type === 'Album'
                ? t('musicLibraryPage.editDialog.titleAlbum')
                : t('musicLibraryPage.editDialog.titleSingle')}
            </DialogTitle>
            <DialogDescription>
              {t('musicLibraryPage.editDialog.description', { title: editingRelease?.title })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-cover">{t('musicLibraryPage.editDialog.coverLabel')}</Label>
              <div className="flex items-center gap-4">
                {editForm.coverPreview ? (
                  <img
                    src={editForm.coverPreview}
                    alt={editForm.title}
                    className="h-20 w-20 rounded-md object-cover border border-border"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-md border border-dashed border-border bg-muted" />
                )}
                <div>
                  <Input
                    id="edit-cover"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCoverPhotoChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('musicLibraryPage.editDialog.coverHint')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title">{t('musicLibraryPage.editDialog.titleLabel')}</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-genre">{t('musicLibraryPage.editDialog.genreLabel')}</Label>
              <Select
                value={editForm.genreId}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, genreId: value }))}
              >
                <SelectTrigger id="edit-genre">
                  <SelectValue placeholder={t('musicLibraryPage.editDialog.genrePlaceholder')} />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {genres.map((genre) => (
                    <SelectItem key={getGenreId(genre)} value={getGenreId(genre)}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {editingRelease?.type === 'Single' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">{t('musicLibraryPage.editDialog.durationLabel')}</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    min="1"
                    value={editForm.duration || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-release-date">{t('musicLibraryPage.editDialog.releaseDateLabel')}</Label>
                  <Input
                    id="edit-release-date"
                    type="date"
                    className="w-full cursor-pointer"
                    value={editForm.releaseDate}
                    onClick={openDatePicker}
                    onFocus={openDatePicker}
                    onChange={(e) => setEditForm(prev => ({ ...prev, releaseDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lyrics">{t('musicLibraryPage.editDialog.lyricsLabel')}</Label>
                  <Textarea
                    id="edit-lyrics"
                    value={editForm.lyrics}
                    onChange={(e) => setEditForm(prev => ({ ...prev, lyrics: e.target.value }))}
                    rows={4}
                    placeholder={t('musicLibraryPage.editDialog.lyricsPlaceholder')}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-release-date">{t('musicLibraryPage.editDialog.releaseDateLabel')}</Label>
                  <Input
                    id="edit-release-date"
                    type="date"
                    className="w-full cursor-pointer"
                    value={editForm.releaseDate}
                    onClick={openDatePicker}
                    onFocus={openDatePicker}
                    onChange={(e) => setEditForm(prev => ({ ...prev, releaseDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-caption">{t('musicLibraryPage.editDialog.captionLabel')}</Label>
                  <Textarea
                    id="edit-caption"
                    value={editForm.caption}
                    onChange={(e) => setEditForm(prev => ({ ...prev, caption: e.target.value }))}
                    rows={3}
                    maxLength={500}
                    placeholder={t('musicLibraryPage.editDialog.captionPlaceholder')}
                  />
                  <p className="text-xs text-muted-foreground text-right">{editForm.caption.length}/500</p>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <Label>{t('musicLibraryPage.editDialog.addTracksLabel')}</Label>
                  <p className="text-xs text-muted-foreground">{t('musicLibraryPage.editDialog.addTracksHint')}</p>

                  {standaloneSongs.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground mt-2">{t('musicLibraryPage.editDialog.existingSongsLabel')}</p>
                      <div className="max-h-40 overflow-y-auto rounded-md border border-border divide-y divide-border">
                        {standaloneSongs.map((song) => {
                          const isSelected = editForm.existingSongIds.includes(song._id);
                          return (
                            <label key={song._id} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent/50">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => setEditForm(prev => ({
                                  ...prev,
                                  existingSongIds: isSelected
                                    ? prev.existingSongIds.filter(id => id !== song._id)
                                    : [...prev.existingSongIds, song._id],
                                }))}
                              />
                              <span className="flex-1">{song.title}</span>
                              <span className="text-xs text-muted-foreground">{song.genre.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 mt-3">
                    <p className="text-xs font-medium text-muted-foreground">{t('musicLibraryPage.editDialog.newSongsLabel')}</p>
                    <Input
                      id="edit-new-songs"
                      type="file"
                      accept=".mp3,.wav,.flac"
                      multiple
                      onChange={handleNewSongFilesChange}
                    />
                    {editForm.newSongFiles.length > 0 && (
                      <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        {editForm.newSongFiles.map((file, index) => (
                          <li key={`${file.name}-${index}`} className="flex items-center justify-between">
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              className="text-destructive hover:underline ml-2 shrink-0"
                              onClick={() => setEditForm(prev => ({
                                ...prev,
                                newSongFiles: prev.newSongFiles.filter((_, i) => i !== index),
                              }))}
                            >
                              {t('musicLibraryPage.editDialog.removeFile')}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-explicit">{t('musicLibraryPage.editDialog.explicitLabel')}</Label>
              <Switch
                id="edit-explicit"
                checked={editForm.explicit}
                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, explicit: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRelease(null)} disabled={isSaving}>
              {t('musicLibraryPage.editDialog.cancel')}
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving || !editForm.title.trim() || !editForm.releaseDate}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('musicLibraryPage.editDialog.saving')}
                </>
              ) : (
                t('musicLibraryPage.editDialog.save')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={!!analyticsRelease} onOpenChange={(open) => !open && setAnalyticsRelease(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              {analyticsRelease?.title}
            </DialogTitle>
            <DialogDescription>
              {t('musicLibraryPage.analyticsDialog.subtitle', { genre: analyticsRelease?.genre })}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">{t('musicLibraryPage.dialog.streams')}</h4>
              <p className="text-lg font-semibold">{(analyticsRelease?.streams || 0).toLocaleString()}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">{t('musicLibraryPage.dialog.downloads')}</h4>
              <p className="text-lg font-semibold">{(analyticsRelease?.downloads || 0).toLocaleString()}</p>
            </div>
            {analyticsRelease?.duration !== undefined && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">{t('musicLibraryPage.analyticsDialog.duration')}</h4>
                <p className="text-lg font-semibold">
                  {Math.floor(analyticsRelease.duration / 60)}:{String(Math.round(analyticsRelease.duration % 60)).padStart(2, '0')}
                </p>
              </div>
            )}
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">{t('musicLibraryPage.analyticsDialog.releaseDate')}</h4>
              <p className="text-lg font-semibold">{analyticsRelease && formatDate(analyticsRelease.releaseDate)}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t('musicLibraryPage.analyticsDialog.moreComingSoon')}</p>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default MusicLibrary;
