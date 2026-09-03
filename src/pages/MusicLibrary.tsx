import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Music, Edit, Trash2, BarChart2, Loader2, AlertCircle, Disc3, Mic, Eye, Archive, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { api, ApiError, UploadedSong, UploadedAlbum } from "@/lib/api";

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
  songsCount?: number;
  likesCount?: number;
  downloads?: number;
  streams?: number;
  isFromAlbum: boolean;
}

const MusicLibrary = () => {
  const { t, i18n } = useTranslation();
  const [singles, setSingles] = useState<CombinedRelease[]>([]);
  const [albums, setAlbums] = useState<CombinedRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRelease, setSelectedRelease] = useState<CombinedRelease | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [songsResponse, albumsResponse] = await Promise.all([
        api.getUploadedSongs(1, 50),
        api.getUploadedAlbums(1, 50)
      ]);

      const singlesData: CombinedRelease[] = [];
      const albumsData: CombinedRelease[] = [];

      if (songsResponse.status === 'success' && songsResponse.data) {
        const songReleases: CombinedRelease[] = songsResponse.data.songs.map(song => ({
          id: song.id,
          title: song.title,
          type: 'Single' as const,
          releaseDate: song.createdAt,
          status: 'Active',
          artwork: song.coverPhotoUrl,
          genre: song.genre.name,
          downloads: song.downloads,
          streams: song.streams,
          isFromAlbum: false
        }));
        singlesData.push(...songReleases);
      }

      if (albumsResponse.status === 'success' && albumsResponse.data) {
        const albumReleases: CombinedRelease[] = albumsResponse.data.albums.map(album => ({
          id: album._id,
          title: album.title,
          type: 'Album' as const,
          releaseDate: album.releaseDate,
          status: album.status,
          artwork: album.coverPhotoUrl,
          genre: album.genre.name,
          caption: album.caption,
          songsCount: album.songsCount,
          likesCount: album.likesCount,
          isFromAlbum: true
        }));
        albumsData.push(...albumReleases);
      }

      singlesData.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      albumsData.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      
      setSingles(singlesData);
      setAlbums(albumsData);
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
  };

  const handleEditRelease = (release: CombinedRelease) => {
    // TODO: Implement edit functionality
    toast({
      title: t('musicLibraryPage.toast.comingSoonTitle'),
      description: t('musicLibraryPage.toast.editComingSoonDescription'),
    });
  };

  const handleAnalyticsRelease = (release: CombinedRelease) => {
    // TODO: Navigate to analytics page with release filter
    toast({
      title: t('musicLibraryPage.toast.comingSoonTitle'),
      description: t('musicLibraryPage.toast.analyticsComingSoonDescription'),
    });
  };

  const handleDeleteRelease = async (release: CombinedRelease) => {
    try {
      setIsDeleting(true);
      
      if (release.type === 'Single') {
        await api.deleteSong(release.id);
        setSingles(prev => prev.filter(s => s.id !== release.id));
      } else {
        await api.deleteAlbum(release.id);
        setAlbums(prev => prev.filter(a => a.id !== release.id));
      }

      toast({
        title: t('musicLibraryPage.toast.deleteSuccessTitle'),
        description: t('musicLibraryPage.toast.deleteSuccessDescription', { title: release.title }),
      });
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

  const renderReleaseList = (releases: CombinedRelease[], emptyMessage: string, emptyIcon: React.ReactNode) => {
    if (releases.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          {emptyIcon}
          <h3 className="text-lg font-medium text-foreground mb-2 mt-4">{t('musicLibraryPage.emptyState.title')}</h3>
          <p className="text-muted-foreground mb-4">
            {emptyMessage}
          </p>
          <Link to="/upload">
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
                  <DialogContent className="max-w-2xl">
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
                    <div className="space-y-4">
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
                    </div>
                  </DialogContent>
                </Dialog>

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
                        {t('musicLibraryPage.deleteDialog.description', { title: release.title })}
                        {release.type === 'Album' && release.songsCount && (
                          <span className="block mt-2 text-primary font-medium">
                            {t('musicLibraryPage.deleteDialog.albumWarning', { count: release.songsCount })}
                          </span>
                        )}
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
                          t('musicLibraryPage.deleteDialog.confirm')
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
                <Link to="/upload">
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
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="singles" className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        {t('musicLibraryPage.tabs.singles', { count: singles.length })}
                      </TabsTrigger>
                      <TabsTrigger value="albums" className="flex items-center gap-2">
                        <Disc3 className="h-4 w-4" />
                        {t('musicLibraryPage.tabs.albums', { count: albums.length })}
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
                  </Tabs>
                </CardContent>
              </Card>

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MusicLibrary;
