import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2, Plus, ScrollText } from 'lucide-react';
import { AppSidebar } from '@/components/dashboard-components/AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/dashboard-sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LyricsSyncEditor } from '@/components/lyrics/LyricsSyncEditor';
import {
  SongLyricsAudioPlayer,
  SongLyricsAudioPlayerHandle,
} from '@/components/lyrics/SongLyricsAudioPlayer';
import { api, ApiError } from '@/lib/api';
import { ROUTES } from '@/constants/routes';
import { Lyric, LyricLineInput, SongLyricsContext } from '@/lib/lyrics/types';
import { toLyricLineInputs } from '@/lib/lyrics/mappers';
import {
  DEFAULT_LYRIC_LANGUAGES,
  findActiveLineIndex,
  finalizeLineEndTimes,
  languageLabel,
  splitPlainTextToLines,
  validateSyncedLines,
} from '@/lib/lyrics/utils';
import { buildLyricsSavePayload } from '@/lib/lyrics/payload';
import { getLyricsApiErrorMessage } from '@/lib/lyrics/errors';
import { LyricPendingNotice, LyricStatusBadge } from '@/components/lyrics/LyricStatusBadge';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'list' | 'edit' | 'sync' | 'preview';

const statusKey = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === 'approved') return 'approved';
  if (normalized === 'rejected') return 'rejected';
  return 'pending';
};

const SongLyrics = () => {
  const { songId = '' } = useParams<{ songId: string }>();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const locationState = location.state as SongLyricsContext | null;

  const [songMeta, setSongMeta] = useState<SongLyricsContext | null>(locationState);
  const [lyricsList, setLyricsList] = useState<Lyric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [view, setView] = useState<ViewMode>('list');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [plainText, setPlainText] = useState('');
  const [customLanguage, setCustomLanguage] = useState('');
  const [syncLines, setSyncLines] = useState<LyricLineInput[]>([]);
  const [previewLines, setPreviewLines] = useState<LyricLineInput[]>([]);
  const [deleteLanguage, setDeleteLanguage] = useState<string | null>(null);
  const [previewPositionMs, setPreviewPositionMs] = useState(0);
  const previewPlayerRef = useRef<SongLyricsAudioPlayerHandle>(null);
  const previewListRef = useRef<HTMLDivElement>(null);

  const resolveSongMeta = useCallback(async () => {
    if (locationState?.songId === songId && locationState.songUrl) {
      setSongMeta(locationState);
      return locationState;
    }

    const response = await api.getUploadedSongs(1, 100);
    const song = response.data?.songs.find((s) => s._id === songId);
    if (!song) return null;

    const meta: SongLyricsContext = {
      songId,
      title: song.title,
      songUrl: song.songUrl,
      durationSec: song.duration,
      artwork: song.coverPhotoUrl,
    };
    setSongMeta(meta);
    return meta;
  }, [locationState, songId]);

  const loadLyrics = useCallback(async (options?: { silent?: boolean }) => {
    if (!songId) return;
    if (!options?.silent) setIsLoading(true);
    try {
      await resolveSongMeta();
      const list = await api.getSongLyrics(songId);
      setLyricsList(list);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setLyricsList([]);
        return;
      }
      const message = getLyricsApiErrorMessage(error, t('lyricsPage.toast.loadError'));
      toast({ title: t('lyricsPage.toast.errorTitle'), description: message, variant: 'destructive' });
    } finally {
      if (!options?.silent) setIsLoading(false);
    }
  }, [songId, resolveSongMeta, t, toast]);

  useEffect(() => {
    loadLyrics();
  }, [loadLyrics]);

  const activeLyric = useMemo(
    () => lyricsList.find((l) => l.language === selectedLanguage),
    [lyricsList, selectedLanguage]
  );

  const languageOptions = useMemo(() => {
    const codes = new Set<string>([...DEFAULT_LYRIC_LANGUAGES, ...lyricsList.map((l) => l.language)]);
    return Array.from(codes).filter(Boolean);
  }, [lyricsList]);

  const openEdit = (language: string, existing?: Lyric) => {
    setSelectedLanguage(language);
    setPlainText(existing?.plainText ?? '');
    setCustomLanguage(language);
    setView('edit');
  };

  const openAddLanguage = () => {
    const unused = languageOptions.find(
      (code) => !lyricsList.some((l) => l.language === code)
    );
    const lang = unused ?? 'en';
    setSelectedLanguage('');
    setCustomLanguage(lang);
    setPlainText('');
    setView('edit');
  };

  const savePlainLyrics = async (goSync: boolean) => {
    if (!songId) return;
    const language = (customLanguage || selectedLanguage).trim().toLowerCase();
    if (!language) {
      toast({
        title: t('lyricsPage.toast.errorTitle'),
        description: t('lyricsPage.toast.languageRequired'),
        variant: 'destructive',
      });
      return;
    }
    if (!plainText.trim()) {
      toast({
        title: t('lyricsPage.toast.errorTitle'),
        description: t('lyricsPage.toast.plainTextRequired'),
        variant: 'destructive',
      });
      return;
    }

    if (isSaving) return;
    setIsSaving(true);
    try {
      const payload = buildLyricsSavePayload(language, plainText, false);

      const existing = lyricsList.find((l) => l.language === language);
      if (existing) {
        await api.updateSongLyrics(songId, language, payload);
      } else {
        await api.createSongLyrics(songId, payload);
      }

      toast({
        title: t('lyricsPage.toast.savedTitle'),
        description: t('lyricsPage.toast.pendingApproval'),
      });

      await loadLyrics({ silent: true });
      setSelectedLanguage(language);

      if (goSync) {
        setSyncLines(splitPlainTextToLines(plainText));
        setView('sync');
      } else {
        setView('list');
      }
    } catch (error) {
      const message = getLyricsApiErrorMessage(error, t('lyricsPage.toast.saveError'));
      toast({ title: t('lyricsPage.toast.errorTitle'), description: message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const startSyncFromExisting = (lyric: Lyric) => {
    setSelectedLanguage(lyric.language);
    const baseLines =
      lyric.isSynced && lyric.lines.length > 0
        ? toLyricLineInputs(lyric.lines)
        : splitPlainTextToLines(lyric.plainText);
    setSyncLines(baseLines);
    setView('sync');
  };

  const saveSyncedLyrics = async (lines: LyricLineInput[]) => {
    if (!songId || !selectedLanguage) return;
    const durationMs =
      songMeta?.durationSec !== undefined
        ? Math.round(songMeta.durationSec * 1000)
        : previewPlayerRef.current?.getDurationMs();

    const finalized = finalizeLineEndTimes(lines, durationMs && durationMs > 0 ? durationMs : undefined);
    const validation = validateSyncedLines(finalized, durationMs && durationMs > 0 ? durationMs : undefined);
    if (!validation.valid) {
      toast({
        title: t('lyricsPage.toast.errorTitle'),
        description: validation.errors[0],
        variant: 'destructive',
      });
      return;
    }

    if (isSaving) return;
    setIsSaving(true);
    try {
      const payload = buildLyricsSavePayload(
        selectedLanguage,
        finalized.map((l) => l.text).join('\n'),
        true,
        finalized
      );

      const existing = lyricsList.find((l) => l.language === selectedLanguage);
      if (existing) {
        await api.updateSongLyrics(songId, selectedLanguage, payload);
      } else {
        await api.createSongLyrics(songId, payload);
      }

      toast({
        title: t('lyricsPage.toast.savedTitle'),
        description: t('lyricsPage.toast.pendingApproval'),
      });
      await loadLyrics({ silent: true });
      setView('list');
    } catch (error) {
      const message = getLyricsApiErrorMessage(error, t('lyricsPage.toast.saveError'));
      toast({ title: t('lyricsPage.toast.errorTitle'), description: message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!songId || !deleteLanguage) return;
    setIsSaving(true);
    try {
      await api.deleteSongLyrics(songId, deleteLanguage);
      toast({ title: t('lyricsPage.toast.deletedTitle'), description: t('lyricsPage.toast.deletedDescription') });
      setDeleteLanguage(null);
      if (selectedLanguage === deleteLanguage) {
        setSelectedLanguage('');
        setView('list');
      }
      await loadLyrics();
    } catch (error) {
      const message = getLyricsApiErrorMessage(error, t('lyricsPage.toast.deleteError'));
      toast({ title: t('lyricsPage.toast.errorTitle'), description: message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const previewActiveIndex = findActiveLineIndex(previewLines, previewPositionMs);

  useEffect(() => {
    if (view !== 'preview' || !previewListRef.current) return;
    const el = previewListRef.current.querySelector(`[data-line-index="${previewActiveIndex}"]`);
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [previewActiveIndex, view, previewPositionMs]);

  if (!songId) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6 gap-3">
            <SidebarTrigger className="mr-1" />
            <Button variant="ghost" size="icon" asChild>
              <Link to={ROUTES.MUSIC_LIBRARY}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">
                {t('lyricsPage.headerTitle')}
              </h2>
              {songMeta?.title ? (
                <p className="text-sm text-muted-foreground truncate">{songMeta.title}</p>
              ) : null}
            </div>
          </header>

          <main className="flex-1 overflow-auto p-3 sm:p-6 bg-background">
            <div className="max-w-3xl mx-auto space-y-6">
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('lyricsPage.loading')}
                </div>
              ) : null}

              {!isLoading && view === 'list' ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ScrollText className="h-5 w-5" />
                      {t('lyricsPage.list.title')}
                    </CardTitle>
                    <CardDescription>{t('lyricsPage.list.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <LyricPendingNotice />
                    {lyricsList.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t('lyricsPage.list.empty')}</p>
                    ) : (
                      <ul className="space-y-3">
                        {lyricsList.map((lyric) => (
                          <li
                            key={lyric.language}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-border"
                          >
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-foreground">
                                  {languageLabel(lyric.language, i18n.language)}
                                  <span className="text-muted-foreground text-sm ml-2">({lyric.language})</span>
                                </p>
                                <LyricStatusBadge status={lyric.status} />
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {lyric.isSynced ? t('lyricsPage.list.synced') : t('lyricsPage.list.plain')}
                                {statusKey(lyric.status) === 'pending'
                                  ? ` · ${t('lyricsPage.list.notPublicYet')}`
                                  : ''}
                              </p>
                              {lyric.status.toLowerCase() === 'rejected' && lyric.moderationComment ? (
                                <p className="text-sm text-destructive mt-1">
                                  {t('lyricsPage.rejectedReason', { reason: lyric.moderationComment })}
                                </p>
                              ) : null}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button type="button" size="sm" variant="outline" disabled={isSaving} onClick={() => openEdit(lyric.language, lyric)}>
                                {t('lyricsPage.list.edit')}
                              </Button>
                              {songMeta?.songUrl ? (
                                <Button type="button" size="sm" variant="outline" disabled={isSaving} onClick={() => startSyncFromExisting(lyric)}>
                                  {t('lyricsPage.list.sync')}
                                </Button>
                              ) : null}
                              <Button type="button" size="sm" variant="destructive" disabled={isSaving} onClick={() => setDeleteLanguage(lyric.language)}>
                                {t('lyricsPage.list.delete')}
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Button type="button" variant="outline" className="gap-2" disabled={isSaving} onClick={openAddLanguage}>
                      <Plus className="h-4 w-4" />
                      {t('lyricsPage.list.addLanguage')}
                    </Button>
                  </CardContent>
                </Card>
              ) : null}

              {!isLoading && view === 'edit' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('lyricsPage.edit.title')}</CardTitle>
                    <CardDescription>{t('lyricsPage.edit.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t('lyricsPage.edit.language')}</Label>
                      <Select
                        value={customLanguage}
                        onValueChange={setCustomLanguage}
                        disabled={Boolean(selectedLanguage && activeLyric)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('lyricsPage.edit.languagePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((code) => (
                            <SelectItem key={code} value={code}>
                              {languageLabel(code, i18n.language)} ({code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value.trim().toLowerCase())}
                        placeholder={t('lyricsPage.edit.customLanguagePlaceholder')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="plain-lyrics">{t('lyricsPage.edit.plainText')}</Label>
                      <Textarea
                        id="plain-lyrics"
                        rows={10}
                        value={plainText}
                        onChange={(e) => setPlainText(e.target.value)}
                        placeholder={t('lyricsPage.edit.plainTextPlaceholder')}
                      />
                    </div>

                    <LyricPendingNotice />

                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button type="button" variant="outline" disabled={isSaving} onClick={() => setView('list')}>
                        {t('lyricsPage.cancel')}
                      </Button>
                      <Button type="button" disabled={isSaving} onClick={() => savePlainLyrics(false)}>
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {t('lyricsPage.saving')}
                          </>
                        ) : (
                          t('lyricsPage.edit.saveLyrics')
                        )}
                      </Button>
                      {songMeta?.songUrl ? (
                        <Button type="button" disabled={isSaving} onClick={() => savePlainLyrics(true)}>
                          {t('lyricsPage.edit.syncLyrics')}
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {!isLoading && view === 'sync' && songMeta?.songUrl ? (
                <Card>
                  <CardContent className="pt-6">
                    <LyricsSyncEditor
                      songTitle={songMeta.title}
                      songUrl={songMeta.songUrl}
                      durationSec={songMeta.durationSec}
                      lines={syncLines}
                      onLinesChange={setSyncLines}
                      onSave={saveSyncedLyrics}
                      onPreview={(lines) => {
                        setPreviewLines(lines);
                        setView('preview');
                      }}
                      isSaving={isSaving}
                    />
                    <div className="mt-4">
                      <Button type="button" variant="ghost" onClick={() => setView('list')}>
                        {t('lyricsPage.backToList')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {!isLoading && view === 'preview' && songMeta?.songUrl ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('lyricsPage.preview.title')}</CardTitle>
                    <CardDescription>{t('lyricsPage.preview.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SongLyricsAudioPlayer
                      ref={previewPlayerRef}
                      songUrl={songMeta.songUrl}
                      durationSec={songMeta.durationSec}
                      onPositionMsChange={setPreviewPositionMs}
                    />
                    <div ref={previewListRef} className="max-h-64 overflow-y-auto space-y-2 rounded-lg border border-border p-3">
                      {[...previewLines]
                        .sort((a, b) => a.lineIndex - b.lineIndex)
                        .map((line) => (
                          <p
                            key={line.lineIndex}
                            data-line-index={line.lineIndex}
                            className={`text-sm transition-colors ${
                              line.lineIndex === previewActiveIndex
                                ? 'text-primary font-semibold'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {line.text}
                          </p>
                        ))}
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setView('sync')}>
                        {t('lyricsPage.preview.backToSync')}
                      </Button>
                      <Button type="button" onClick={() => saveSyncedLyrics(previewLines)} disabled={isSaving}>
                        {isSaving ? t('lyricsPage.saving') : t('lyricsPage.sync.save')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </main>
        </div>
      </SidebarInset>

      <AlertDialog open={Boolean(deleteLanguage)} onOpenChange={(open) => !open && setDeleteLanguage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('lyricsPage.delete.title', {
                language: deleteLanguage ? languageLabel(deleteLanguage, i18n.language) : '',
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>{t('lyricsPage.delete.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('lyricsPage.delete.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              {t('lyricsPage.delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default SongLyrics;
