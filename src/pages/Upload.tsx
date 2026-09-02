import React, { useState, useCallback, useEffect } from 'react';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { UploadCloud, CheckCircle, XCircle, FileText, ChevronDown, X, Music, Disc } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Added useToast
import { api, ApiError, Artist, Genre, UploadedSong, UploadedAlbum, getGenreId } from "@/lib/api"; // Import api, ApiError, Artist, Genre, UploadedSong, and UploadedAlbum
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to get current user

interface UploadFormData {
  title: string;
  duration: number;
  albumId?: string;
  genreId: string;
  collaborators: string[]; // Array of artist IDs
  isExplicit: boolean;
  lyrics?: string;
}

interface AlbumFormData {
  title: string;
  releaseDate: string;
  explicit: boolean;
  genreId: string;
  caption?: string;
  existingSongIds: string[]; // Array of selected song IDs
  newSongs: Array<{
    title: string;
    duration: number;
    collaborators?: string[];
    isExplicit: boolean;
    lyrics?: string;
  }>;
}

type UploadType = 'single' | 'album';

const Upload = () => {
  const [uploadType, setUploadType] = useState<UploadType>('single');
  const [songFile, setSongFile] = useState<File | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [albumCoverPhotoFile, setAlbumCoverPhotoFile] = useState<File | null>(null);
  const [newSongFiles, setNewSongFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [uploadedSongs, setUploadedSongs] = useState<UploadedSong[]>([]);
  const [albums, setAlbums] = useState<UploadedAlbum[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [genreOpen, setGenreOpen] = useState(false);
  const [collaboratorsOpen, setCollaboratorsOpen] = useState(false);
  const [existingSongsOpen, setExistingSongsOpen] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    duration: 0,
    genreId: '',
    isExplicit: false,
    collaborators: [],
    lyrics: '',
  });
  const [albumFormData, setAlbumFormData] = useState<AlbumFormData>({
    title: '',
    releaseDate: '',
    explicit: false,
    genreId: '',
    caption: '',
    existingSongIds: [],
    newSongs: [],
  });
  const { toast } = useToast(); // Added useToast
  const { user } = useAuth(); // Get current user data

  // Fetch artists and genres on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [artistsResponse, genresResponse, uploadedSongsResponse, uploadedAlbumsResponse] = await Promise.all([
          api.getAllArtists(),
          api.getPlatformGenres(),
          api.getUploadedSongs(1, 100), // Fetch up to 100 songs for the dropdown
          api.getUploadedAlbums(1, 100) // Fetch up to 100 albums for the dropdown
        ]);

        if (artistsResponse.status === 'success' && artistsResponse.data) {
          setArtists(artistsResponse.data.artists);
        }

        if (genresResponse.status === 'success' && genresResponse.data) {
          setGenres(genresResponse.data.genres);
        }

        if (uploadedSongsResponse.status === 'success' && uploadedSongsResponse.data) {
          setUploadedSongs(uploadedSongsResponse.data.songs);
        }

        if (uploadedAlbumsResponse.status === 'success' && uploadedAlbumsResponse.data) {
          setAlbums(uploadedAlbumsResponse.data.albums);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les artistes et les genres. Actualisez la page.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSongFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Type de fichier invalide",
          description: "Sélectionnez un fichier audio (MP3, WAV, FLAC).",
          variant: "destructive",
        });
        setSongFile(null);
        return;
      }
      setSongFile(file);
      setUploadProgress(0);
      setUploadComplete(false);
    }
  }, [toast]);

  const handleCoverPhotoChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Type de fichier invalide",
          description: "Sélectionnez un fichier image (JPEG, PNG, WebP).",
          variant: "destructive",
        });
        setCoverPhotoFile(null);
        return;
      }
      setCoverPhotoFile(file);
    }
  }, [toast]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile.type.startsWith('audio/')) {
        setSongFile(droppedFile);
        setUploadProgress(0);
        setUploadComplete(false);
      } else if (droppedFile.type.startsWith('image/')) {
        setCoverPhotoFile(droppedFile);
      } else {
        toast({
          title: "Type de fichier non pris en charge",
          description: "Déposez un fichier audio ou image.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'duration' ? Number(value) : value }));
  }, []);

  const handleSelectChange = useCallback((name: keyof UploadFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!songFile) {
      toast({
        title: "Fichier audio manquant",
        description: "Sélectionnez un fichier audio à téléverser.",
        variant: "destructive",
      });
      return;
    }
    if (!coverPhotoFile) {
      toast({
        title: "Photo de couverture manquante",
        description: "Sélectionnez une photo de couverture pour votre titre.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('duration', formData.duration.toString());
    formDataToSend.append('genreId', formData.genreId);
    formDataToSend.append('isExplicit', formData.isExplicit.toString());
    if (formData.albumId) formDataToSend.append('albumId', formData.albumId);
    if (formData.collaborators.length > 0) formDataToSend.append('collaborators', JSON.stringify(formData.collaborators));
    if (formData.lyrics) formDataToSend.append('lyrics', formData.lyrics);
    formDataToSend.append('songFile', songFile);
    formDataToSend.append('coverPhoto', coverPhotoFile);

    try {
      await api.uploadSingleSong(formDataToSend);
      setUploadComplete(true);
      toast({
        title: "Téléversement réussi",
        description: "Votre titre a été téléversé avec succès !",
      });
      // Reset form and files for next upload
      setSongFile(null);
      setCoverPhotoFile(null);
      setFormData({
        title: '',
        duration: 0,
        genreId: '',
        isExplicit: false,
        collaborators: [],
        lyrics: '',
      });
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof ApiError ? error.message : "Une erreur inattendue s'est produite pendant le téléversement.";
      toast({
        title: "Échec du téléversement",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0); // Reset progress on completion or error
    }
  }, [songFile, coverPhotoFile, formData, toast]);

  const handleAlbumSubmit = useCallback(async () => {
    if (!albumCoverPhotoFile) {
      toast({
        title: "Photo de couverture manquante",
        description: "Sélectionnez une photo de couverture pour votre album.",
        variant: "destructive",
      });
      return;
    }

    if (!albumFormData.title || !albumFormData.releaseDate || !albumFormData.genreId) {
      toast({
        title: "Champs obligatoires manquants",
        description: "Remplissez tous les champs requis (titre, date de sortie, genre).",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formDataToSend = new FormData();
    formDataToSend.append('title', albumFormData.title);
    formDataToSend.append('releaseDate', albumFormData.releaseDate);
    formDataToSend.append('explicit', albumFormData.explicit.toString());
    formDataToSend.append('genreId', albumFormData.genreId);
    if (albumFormData.caption) formDataToSend.append('caption', albumFormData.caption);
    if (albumFormData.existingSongIds.length > 0) formDataToSend.append('existingSongIds', albumFormData.existingSongIds.join(','));
    
    // Add new songs metadata as JSON (always send, even if empty array)
    const newSongsMetadata = newSongFiles.map((file, index) => ({
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      duration: 0, // This would need to be calculated or provided by user
      collaborators: [],
      isExplicit: albumFormData.explicit,
      lyrics: ""
    }));
    formDataToSend.append('newSongs', JSON.stringify(newSongsMetadata));
    
    formDataToSend.append('coverPhoto', albumCoverPhotoFile);
    
    // Add new song files as an array (only if there are files)
    if (newSongFiles.length > 0) {
      newSongFiles.forEach((file) => {
        formDataToSend.append('songFiles', file);
      });
    }

    try {
      const response = await api.uploadAlbum(formDataToSend);
      setUploadComplete(true);
      toast({
        title: "Album créé avec succès",
        description: response.message || "Votre album a été créé et est en attente de validation !",
      });
      
      // Reset form and files for next upload
      setAlbumCoverPhotoFile(null);
      setNewSongFiles([]);
      setAlbumFormData({
        title: '',
        releaseDate: '',
        explicit: false,
        genreId: '',
        caption: '',
        existingSongIds: [],
        newSongs: [],
      });
    } catch (error) {
      console.error("Album upload error:", error);
      const errorMessage = error instanceof ApiError ? error.message : "Une erreur inattendue s'est produite pendant la création de l'album.";
      toast({
        title: "Échec de la création de l'album",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [albumCoverPhotoFile, albumFormData, newSongFiles, toast]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">Téléverser de la musique</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Upload Type Selection */}
              <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold text-foreground">Type de téléversement</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Choisissez si vous voulez téléverser un titre seul ou créer un album
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant={uploadType === 'single' ? 'default' : 'outline'}
                      className={`h-20 flex flex-col items-center justify-center gap-2 ${
                        uploadType === 'single' ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => setUploadType('single')}
                    >
                      <Music className="h-6 w-6" />
                      <span className="font-medium">Titre unique</span>
                      <span className="text-xs opacity-80">Téléverser un seul titre</span>
                    </Button>
                    <Button
                      variant={uploadType === 'album' ? 'default' : 'outline'}
                      className={`h-20 flex flex-col items-center justify-center gap-2 ${
                        uploadType === 'album' ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => setUploadType('album')}
                    >
                      <Disc className="h-6 w-6" />
                      <span className="font-medium">Album</span>
                      <span className="text-xs opacity-80">Créer un album avec plusieurs titres</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Single Upload Form */}
              {uploadType === 'single' && (
                <>
                  {/* Audio File Upload Area */}
                  <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold text-foreground">Fichier audio</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Glissez-déposez votre fichier audio ici, ou cliquez pour parcourir. Formats acceptés : MP3, WAV, FLAC (taille max. 50 Mo)
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:bg-accent/10 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('song-file-input')?.click()}
                  >
                    {songFile ? (
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-primary mb-3" />
                        <p className="text-foreground font-medium">{songFile.name}</p>
                        <p className="text-muted-foreground text-sm">{(songFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        {isUploading && (
                          <div className="w-full mt-4">
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-sm text-muted-foreground mt-2">Téléversement... {uploadProgress}%</p>
                          </div>
                        )}
                        {uploadComplete && (
                          <p className="text-primary text-sm mt-2 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" /> Téléversement terminé !
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-foreground font-medium">Glissez-déposez votre titre ou cliquez pour téléverser</p>
                        <p className="text-muted-foreground text-sm mt-1">Formats acceptés : MP3, WAV, FLAC</p>
                      </div>
                    )}
                    <input 
                      id="song-file-input"
                      type="file" 
                      accept=".mp3,.wav,.flac" 
                      className="hidden" 
                      onChange={handleSongFileChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Cover Photo Upload Area */}
              <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold text-foreground">Photo de couverture</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Glissez-déposez votre photo de couverture ici, ou cliquez pour parcourir. Formats acceptés : JPEG, PNG, WebP (taille max. 5 Mo)
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:bg-accent/10 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('cover-photo-input')?.click()}
                  >
                    {coverPhotoFile ? (
                      <div className="flex flex-col items-center">
                        <img src={URL.createObjectURL(coverPhotoFile)} alt="Cover Preview" className="h-24 w-24 object-cover rounded-md mb-3" />
                        <p className="text-foreground font-medium">{coverPhotoFile.name}</p>
                        <p className="text-muted-foreground text-sm">{(coverPhotoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-foreground font-medium">Glissez-déposez votre photo ou cliquez pour téléverser</p>
                        <p className="text-muted-foreground text-sm mt-1">Formats acceptés : JPEG, PNG, WebP</p>
                      </div>
                    )}
                    <input 
                      id="cover-photo-input"
                      type="file" 
                      accept=".jpeg,.jpg,.png,.webp" 
                      className="hidden" 
                      onChange={handleCoverPhotoChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Metadata Form */}
              <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold text-foreground">Détails du titre</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Renseignez les informations sur votre titre. Cela aide les auditeurs à trouver votre musique.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre</Label>
                      <Input id="title" name="title" value={formData.title} onChange={handleFormChange} placeholder="Titre du morceau" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée (secondes)</Label>
                      <Input id="duration" name="duration" type="number" value={formData.duration === 0 ? '' : formData.duration} onChange={handleFormChange} placeholder="ex. 233" required min="1" max="3600" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="albumId">Album (optionnel)</Label>
                      <Select name="albumId" value={formData.albumId || ''} onValueChange={(value) => handleSelectChange('albumId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un album" />
                        </SelectTrigger>
                        <SelectContent>
                          {albums.map((album) => (
                            <SelectItem key={album._id} value={album._id}>{album.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="genreId">Genre</Label>
                      <Popover open={genreOpen} onOpenChange={setGenreOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={genreOpen}
                            className="w-full justify-between"
                            disabled={isLoadingData}
                          >
                            {formData.genreId
                              ? genres.find((genre) => getGenreId(genre) === formData.genreId)?.name
                              : "Sélectionner un genre..."}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Rechercher un genre..." />
                            <CommandList>
                              <CommandEmpty>Aucun genre trouvé.</CommandEmpty>
                              <CommandGroup>
                                {genres.map((genre) => (
                                  <CommandItem
                                    key={getGenreId(genre)}
                                    value={genre.name}
                                    onSelect={() => {
                                      setFormData(prev => ({ ...prev, genreId: getGenreId(genre) }));
                                      setGenreOpen(false);
                                    }}
                                  >
                                    {genre.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="collaborators">Collaborateurs (optionnel)</Label>
                      <Popover open={collaboratorsOpen} onOpenChange={setCollaboratorsOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={collaboratorsOpen}
                            className="w-full justify-between"
                            disabled={isLoadingData}
                          >
                            {formData.collaborators.length > 0 
                              ? `${formData.collaborators.length} collaborateur(s) sélectionné(s)`
                              : "Sélectionner des collaborateurs..."}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Rechercher un artiste..." />
                            <CommandList>
                              <CommandEmpty>Aucun artiste trouvé.</CommandEmpty>
                              <CommandGroup>
                                {artists
                                  .filter((artist) => artist._id !== user?.id) // Filter out current user
                                  .map((artist) => {
                                    const isSelected = formData.collaborators.includes(artist._id);
                                    return (
                                      <CommandItem
                                        key={artist._id}
                                        value={`${artist.stageName} ${artist.bio}`}
                                        onSelect={() => {
                                          setFormData(prev => ({
                                            ...prev,
                                            collaborators: isSelected
                                              ? prev.collaborators.filter(id => id !== artist._id)
                                              : [...prev.collaborators, artist._id]
                                          }));
                                        }}
                                      >
                                        <div className="flex items-center justify-between w-full">
                                          <div>
                                            <div className="font-medium">{artist.stageName}</div>
                                            <div className="text-sm text-muted-foreground">{artist.bio}</div>
                                          </div>
                                          {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                                        </div>
                                      </CommandItem>
                                    );
                                  })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {formData.collaborators.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.collaborators.map((collaboratorId) => {
                            const artist = artists.find(a => a._id === collaboratorId);
                            return artist ? (
                              <div key={collaboratorId} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                                {artist.fullName}
                                <X 
                                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      collaborators: prev.collaborators.filter(id => id !== collaboratorId)
                                    }));
                                  }}
                                />
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 flex items-center gap-2">
                      <Input 
                        id="isExplicit" 
                        name="isExplicit" 
                        type="checkbox" 
                        checked={formData.isExplicit}
                        onChange={(e) => handleSelectChange('isExplicit', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="isExplicit">Contenu explicite</Label>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="lyrics">Paroles (optionnel, 10 000 caractères max.)</Label>
                      <Textarea 
                        id="lyrics" 
                        name="lyrics" 
                        value={formData.lyrics || ''} 
                        onChange={handleFormChange} 
                        placeholder="Saisissez les paroles ici..." 
                        rows={6} 
                        maxLength={10000}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button type="submit" disabled={!songFile || !coverPhotoFile || isUploading} className="bg-primary hover:bg-primary-dark text-primary-foreground flex items-center gap-2">
                        {isUploading ? 'Téléversement...' : 'Publier le titre'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
                </>
              )}

              {/* Album Upload Form */}
              {uploadType === 'album' && (
                <>
                  {/* Album Cover Photo Upload */}
                  <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl font-bold text-foreground">Photo de couverture de l'album</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Téléversez une photo de couverture pour votre album. Formats acceptés : JPEG, PNG, WebP (taille max. 5 Mo)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:bg-accent/10 transition-colors"
                        onClick={() => document.getElementById('album-cover-input')?.click()}
                      >
                        {albumCoverPhotoFile ? (
                          <div className="flex flex-col items-center">
                            <img src={URL.createObjectURL(albumCoverPhotoFile)} alt="Album Cover Preview" className="h-24 w-24 object-cover rounded-md mb-3" />
                            <p className="text-foreground font-medium">{albumCoverPhotoFile.name}</p>
                            <p className="text-muted-foreground text-sm">{(albumCoverPhotoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
                            <p className="text-foreground font-medium">Cliquez pour téléverser la couverture</p>
                            <p className="text-muted-foreground text-sm mt-1">Formats acceptés : JPEG, PNG, WebP</p>
                          </div>
                        )}
                        <input 
                          id="album-cover-input"
                          type="file" 
                          accept=".jpeg,.jpg,.png,.webp" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              if (!file.type.startsWith('image/')) {
                                toast({
                                  title: "Type de fichier invalide",
                                  description: "Sélectionnez un fichier image (JPEG, PNG, WebP).",
                                  variant: "destructive",
                                });
                                return;
                              }
                              setAlbumCoverPhotoFile(file);
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Album Details Form */}
                  <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl font-bold text-foreground">Détails de l'album</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Renseignez les informations sur votre album
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="album-title">Titre de l'album</Label>
                          <Input 
                            id="album-title" 
                            value={albumFormData.title} 
                            onChange={(e) => setAlbumFormData(prev => ({ ...prev, title: e.target.value }))} 
                            placeholder="Titre de l'album" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="release-date">Date de sortie</Label>
                          <Input 
                            id="release-date" 
                            type="date" 
                            value={albumFormData.releaseDate} 
                            onChange={(e) => setAlbumFormData(prev => ({ ...prev, releaseDate: e.target.value }))} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="album-genre">Genre</Label>
                          <Popover open={genreOpen} onOpenChange={setGenreOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={genreOpen}
                                className="w-full justify-between"
                                disabled={isLoadingData}
                              >
                                {albumFormData.genreId
                                  ? genres.find((genre) => getGenreId(genre) === albumFormData.genreId)?.name
                                  : "Sélectionner un genre..."}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Rechercher un genre..." />
                                <CommandList>
                                  <CommandEmpty>Aucun genre trouvé.</CommandEmpty>
                                  <CommandGroup>
                                    {genres.map((genre) => (
                                      <CommandItem
                                        key={getGenreId(genre)}
                                        value={genre.name}
                                        onSelect={() => {
                                          setAlbumFormData(prev => ({ ...prev, genreId: getGenreId(genre) }));
                                          setGenreOpen(false);
                                        }}
                                      >
                                        {genre.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2 flex items-center gap-2">
                          <Input 
                            id="album-explicit" 
                            type="checkbox" 
                            checked={albumFormData.explicit}
                            onChange={(e) => setAlbumFormData(prev => ({ ...prev, explicit: e.target.checked }))}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="album-explicit">Contenu explicite</Label>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="album-caption">Légende (optionnel)</Label>
                          <Textarea 
                            id="album-caption" 
                            value={albumFormData.caption || ''} 
                            onChange={(e) => setAlbumFormData(prev => ({ ...prev, caption: e.target.value }))} 
                            placeholder="Décrivez votre album..." 
                            rows={3} 
                            maxLength={500}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="existing-songs">Titres existants (optionnel)</Label>
                          <Popover open={existingSongsOpen} onOpenChange={setExistingSongsOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={existingSongsOpen}
                                className="w-full justify-between"
                                disabled={isLoadingData || uploadedSongs.length === 0}
                              >
                                {albumFormData.existingSongIds.length > 0
                                  ? `${albumFormData.existingSongIds.length} titre(s) sélectionné(s)`
                                  : uploadedSongs.length === 0 
                                    ? "Aucun titre téléversé disponible"
                                    : "Sélectionner des titres existants..."}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Rechercher un titre..." />
                                <CommandList>
                                  <CommandEmpty>Aucun titre trouvé.</CommandEmpty>
                                  <CommandGroup>
                                    {uploadedSongs.map((song) => {
                                      const isSelected = albumFormData.existingSongIds.includes(song.id);
                                      return (
                                        <CommandItem
                                          key={song.id}
                                          value={`${song.title} ${song.genre.name}`}
                                          onSelect={() => {
                                            setAlbumFormData(prev => ({
                                              ...prev,
                                              existingSongIds: isSelected
                                                ? prev.existingSongIds.filter(id => id !== song.id)
                                                : [...prev.existingSongIds, song.id]
                                            }));
                                          }}
                                        >
                                          <div className="flex items-center justify-between w-full">
                                            <div>
                                              <div className="font-medium">{song.title}</div>
                                              <div className="text-sm text-muted-foreground">
                                                {song.genre.name} • {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                                              </div>
                                            </div>
                                            {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                                          </div>
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {albumFormData.existingSongIds.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {albumFormData.existingSongIds.map((songId) => {
                                const song = uploadedSongs.find(s => s.id === songId);
                                return song ? (
                                  <div key={songId} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                                    {song.title}
                                    <X 
                                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                      onClick={() => {
                                        setAlbumFormData(prev => ({
                                          ...prev,
                                          existingSongIds: prev.existingSongIds.filter(id => id !== songId)
                                        }));
                                      }}
                                    />
                                  </div>
                                ) : null;
                              })}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Sélectionnez des titres déjà téléversés à inclure dans cet album
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* New Songs Upload */}
                  <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl font-bold text-foreground">Nouveaux titres</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Téléversez de nouveaux titres pour votre album. Vous pouvez téléverser plusieurs fichiers audio à la fois.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:bg-accent/10 transition-colors"
                        onClick={() => document.getElementById('new-songs-input')?.click()}
                      >
                        {newSongFiles.length > 0 ? (
                          <div className="flex flex-col items-center">
                            <FileText className="h-12 w-12 text-primary mb-3" />
                            <p className="text-foreground font-medium">{newSongFiles.length} titre(s) sélectionné(s)</p>
                            <div className="mt-2 space-y-1">
                              {newSongFiles.map((file, index) => (
                                <p key={index} className="text-sm text-muted-foreground">{file.name}</p>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
                            <p className="text-foreground font-medium">Cliquez pour téléverser de nouveaux titres</p>
                            <p className="text-muted-foreground text-sm mt-1">Formats acceptés : MP3, WAV, FLAC</p>
                          </div>
                        )}
                        <input 
                          id="new-songs-input"
                          type="file" 
                          accept=".mp3,.wav,.flac" 
                          multiple
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files) {
                              const files = Array.from(e.target.files);
                              const validFiles = files.filter(file => file.type.startsWith('audio/'));
                              if (validFiles.length !== files.length) {
                                toast({
                                  title: "Type de fichier invalide",
                                  description: "Certains fichiers n'étaient pas des fichiers audio et ont été ignorés.",
                                  variant: "destructive",
                                });
                              }
                              setNewSongFiles(validFiles);
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Album Submit Button */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAlbumSubmit}
                      disabled={!albumCoverPhotoFile || !albumFormData.title || !albumFormData.releaseDate || !albumFormData.genreId || isUploading}
                      className="bg-primary hover:bg-primary-dark text-primary-foreground flex items-center gap-2"
                    >
                      {isUploading ? "Création de l'album..." : "Créer l'album"}
                    </Button>
                  </div>
                </>
              )}

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Upload;
