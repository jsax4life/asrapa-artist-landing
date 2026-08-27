import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppSidebar } from '@/components/dashboard-components/AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/dashboard-sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Plus, Trash2, Tags } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api, ApiError, Genre, getGenreId } from '@/lib/api';

const GenreManagement = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newGenreName, setNewGenreName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [editingGenreId, setEditingGenreId] = useState('');
  const [editName, setEditName] = useState('');
  const [deletingGenre, setDeletingGenre] = useState<Genre | null>(null);
  const [deletingGenreId, setDeletingGenreId] = useState('');

  const fetchGenres = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.getPlatformGenres();
      if (response.status === 'success' && response.data) {
        setGenres(response.data.genres);
      }
    } catch (error) {
      toast({
        title: t('genres.loadError'),
        description: error instanceof ApiError ? error.message : t('common.unexpectedError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleAddGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newGenreName.trim();
    if (!trimmed) return;

    try {
      setIsSubmitting(true);
      await api.createGenre(trimmed);
      setNewGenreName('');
      await fetchGenres();
      toast({ title: t('genres.addSuccess'), description: t('genres.addSuccessDesc', { name: trimmed }) });
    } catch (error) {
      toast({
        title: t('genres.addError'),
        description: error instanceof ApiError ? error.message : t('common.unexpectedError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (genre: Genre) => {
    const genreId = getGenreId(genre);
    setEditingGenre(genre);
    setEditingGenreId(genreId);
    setEditName(genre.name);
  };

  const handleEditGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGenre) return;
    const trimmed = editName.trim();
    if (!trimmed) return;

    const genreId = editingGenreId || getGenreId(editingGenre);
    if (!genreId) {
      toast({
        title: t('genres.editError'),
        description: t('genres.missingIdError'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await api.updateGenre(genreId, { name: trimmed });
      setEditingGenre(null);
      setEditingGenreId('');
      setEditName('');
      await fetchGenres();
      toast({ title: t('genres.editSuccess'), description: t('genres.editSuccessDesc', { name: trimmed }) });
    } catch (error) {
      toast({
        title: t('genres.editError'),
        description: error instanceof ApiError ? error.message : t('common.unexpectedError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGenre = async () => {
    if (!deletingGenre) return;

    const genreId = deletingGenreId || getGenreId(deletingGenre);
    if (!genreId) {
      toast({
        title: t('genres.deleteError'),
        description: t('genres.missingIdError'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await api.deleteGenre(genreId);
      setDeletingGenre(null);
      setDeletingGenreId('');
      await fetchGenres();
      toast({
        title: t('genres.deleteSuccess'),
        description: t('genres.deleteSuccessDesc', { name: deletingGenre.name }),
      });
    } catch (error) {
      toast({
        title: t('genres.deleteError'),
        description: error instanceof ApiError ? error.message : t('common.unexpectedError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">{t('genres.title')}</h2>
          </header>

          <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {t('genres.addNew')}
                </CardTitle>
                <CardDescription>{t('genres.addNewDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddGenre} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={newGenreName}
                    onChange={(e) => setNewGenreName(e.target.value)}
                    placeholder={t('genres.namePlaceholder')}
                    className="sm:max-w-md"
                    disabled={isSubmitting}
                  />
                  <Button type="submit" disabled={isSubmitting || !newGenreName.trim()}>
                    {t('genres.addButton')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  {t('genres.existing')}
                </CardTitle>
                <CardDescription>{t('genres.existingDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground">{t('common.loading')}</p>
                ) : genres.length === 0 ? (
                  <p className="text-muted-foreground">{t('genres.empty')}</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {genres.map((genre) => (
                      <li
                        key={getGenreId(genre)}
                        className="flex items-center justify-between py-3 gap-4"
                      >
                        <span className="font-medium text-foreground">{genre.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(genre)}
                            disabled={isSubmitting || !getGenreId(genre)}
                            aria-label={t('genres.editButton', { name: genre.name })}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            {t('common.edit')}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setDeletingGenre(genre);
                              setDeletingGenreId(getGenreId(genre));
                            }}
                            disabled={isSubmitting || !getGenreId(genre)}
                            aria-label={t('genres.deleteButton', { name: genre.name })}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {t('common.delete')}
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>

      <Dialog
        open={!!editingGenre}
        onOpenChange={(open) => {
          if (!open) {
            setEditingGenre(null);
            setEditingGenreId('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('genres.editTitle')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditGenre}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-genre-name">{t('genres.nameLabel')}</Label>
                <Input
                  id="edit-genre-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={t('genres.namePlaceholder')}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingGenre(null)}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting || !editName.trim()}>
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingGenre}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingGenre(null);
            setDeletingGenreId('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('genres.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('genres.deleteConfirmDesc', { name: deletingGenre?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGenre}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default GenreManagement;
